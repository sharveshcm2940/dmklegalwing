from datetime import date, datetime, timedelta
import os
import re
import uuid

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import (
    create_access_token, get_jwt, get_jwt_identity,
    jwt_required, set_access_cookies, unset_jwt_cookies,
)

from audit import has_role, log_audit
from extensions import db, limiter
from models import (
    Activity, Admin, AuditLog, ChecklistItem, ContactMessage, DatedCounter,
    District, GalleryAlbum, GalleryImage, LegalResource, News, OfficeBearer,
    Page, RevenueDistrict, SiteSetting,
)
from totp import generate_secret, provisioning_uri, verify_totp

admin_bp = Blueprint("admin", __name__)

# resource name -> (model, editable fields, required fields, order column, order descending, can create, min_write_role)
RESOURCES = {
    "news": (
        News,
        ["slug", "title", "title_ta", "summary", "summary_ta", "body", "body_ta",
         "source_type", "outlet_name", "external_url", "dateline", "actor", "district_tag",
         "related_activity_id", "pinned", "cover_image", "status", "legal_reviewed",
         "legal_reviewed_by", "approved_by", "published_at", "publish_at", "unpublish_at", "is_published"],
        ["title", "body"], "published_at", True, True, "district_editor",
    ),
    "activities": (
        Activity,
        ["slug", "title", "title_ta", "description", "description_ta", "event_date", "end_date",
         "location", "location_ta", "district_tag", "category", "actor", "court_name", "bench",
         "case_stage", "case_number", "sub_judice", "court_order_summary", "party_allegations",
         "participants", "press_links", "attachment_url", "tags", "cover_image", "source_note",
         "status", "legal_reviewed", "legal_reviewed_by", "publish_at", "unpublish_at", "is_published"],
        ["title", "event_date", "actor"], "event_date", True, True, "district_editor",
    ),
    "resources": (
        LegalResource,
        ["title", "title_ta", "description", "description_ta", "category", "resource_type",
         "court_or_forum", "citation", "decision_date", "bench", "later_developments",
         "later_developments_ta", "language_badge", "file_url", "external_url",
         "source_verified", "last_reviewed", "review_owner", "status"],
        ["title"], "created_at", True, True, "editor",
    ),
    "albums": (
        GalleryAlbum,
        ["slug", "title", "title_ta", "category", "event_date", "place", "district_tag", "cover_image", "status"],
        ["title"], "created_at", True, True, "district_editor",
    ),
    "images": (
        GalleryImage,
        ["album_id", "media_type", "image_url", "video_url", "caption", "caption_ta",
         "alt_text", "alt_text_ta", "date_taken", "place", "district_tag", "event_type",
         "credit_line", "licence_type", "people_consent", "minors_present",
         "courtroom_check_passed", "watermark_flag", "takedown_status", "rights_expiry", "sort_order"],
        ["album_id", "image_url"], "id", True, True, "district_editor",
    ),
    "bearers": (
        OfficeBearer,
        ["group_key", "tier", "name_en", "name_ta", "role_en", "role_ta", "place_en", "place_ta",
         "office_email", "phone", "bar_enrolment", "photo", "consent_obtained", "term_start",
         "term_end", "confirmed_by_wing_on", "as_of_date", "source_note", "status", "sort_order"],
        ["name_en", "name_ta"], "sort_order", False, True, "editor",
    ),
    "districts": (
        District,
        ["name", "name_ta", "revenue_district_id", "revenue_district_name", "assembly_constituencies",
         "organiser", "organiser_ta", "deputies", "office_address", "phone", "principal_court",
         "bar_associations", "high_court_seat", "member_count", "status",
         "confirmed_by_wing_on", "source_note", "last_updated", "sort_order"],
        ["name"], "sort_order", False, True, "editor",
    ),
    "revenue_districts": (
        RevenueDistrict,
        ["name_en", "name_ta", "high_court_seat", "region", "notes_en", "notes_ta", "sort_order"],
        ["name_en", "name_ta"], "sort_order", False, True, "publisher",
    ),
    "counters": (
        DatedCounter,
        ["key", "label_en", "label_ta", "value_text", "as_of_date", "source_note", "status", "sort_order"],
        ["key", "label_en", "value_text", "as_of_date"], "sort_order", False, True, "publisher",
    ),
    "pages": (
        Page,
        ["title_en", "title_ta", "body_en", "body_ta"],
        [], "key", False, False, "editor",
    ),
    "messages": (
        ContactMessage,
        ["is_read", "status"],
        [], "created_at", True, False, "editor",
    ),
}

IMAGE_MAGIC = {
    "png": [b"\x89PNG\r\n\x1a\n"],
    "jpg": [b"\xff\xd8\xff"],
    "jpeg": [b"\xff\xd8\xff"],
    "gif": [b"GIF87a", b"GIF89a"],
    "webp": [b"RIFF"],
}

MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_PDF_BYTES = 25 * 1024 * 1024


def bad(message, code=400):
    return jsonify(error=message), code


def spec_for(res):
    return RESOURCES.get(res)


def _current_admin(min_role="district_editor"):
    claims = get_jwt()
    if claims.get("totp_pending"):
        return None, bad("Two-factor verification is required.", 401)
    admin = db.session.get(Admin, int(get_jwt_identity()))
    if not admin or not admin.is_active:
        return None, bad("Account not found or disabled.", 401)
    if not has_role(admin, min_role):
        return None, bad("You do not have permission for this action.", 403)
    return admin, None


def _snapshot(row):
    return row.to_dict() if hasattr(row, "to_dict") else {}


def _auto_slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return s[:120]


def coerce(model, field, value):
    kind = model.__table__.columns[field].type.__class__.__name__
    if kind == "Boolean":
        return value in (True, 1, "1", "true", "True")
    if value is None or value == "":
        return None if kind in ("DateTime", "Date", "Integer") else ""
    if kind == "DateTime":
        return datetime.fromisoformat(str(value).replace("Z", ""))
    if kind == "Date":
        return date.fromisoformat(str(value)[:10])
    if kind == "Integer":
        return int(value)
    return str(value).strip()


def apply_fields(row, model, fields, data):
    for field in fields:
        if field in data:
            setattr(row, field, coerce(model, field, data[field]))
    if hasattr(row, "is_published") and "status" in fields and "status" in data:
        row.is_published = data["status"] == "published"


def _validate_compliance(res, row, data, admin):
    new_status = data.get("status", getattr(row, "status", "draft"))

    # Role gate: editors & district_editors cannot publish/approve/withdraw
    if new_status in ("approved", "scheduled", "published", "withdrawn") and not has_role(admin, "publisher"):
        return "Editors cannot approve or publish directly. Save as 'draft' or 'in_review' for a Publisher."

    # District scope gate for district_editor
    if admin.role == "district_editor" and admin.district_scope:
        tag = data.get("district_tag", getattr(row, "district_tag", ""))
        if tag and tag.lower() != admin.district_scope.lower():
            return f"District editors may only edit items tagged to {admin.district_scope}."

    # Election mode gate
    if new_status == "published":
        em = SiteSetting.query.filter_by(key="election_mode").first()
        if em and em.value == "true" and not getattr(row, "legal_reviewed", True):
            return "Election Mode is active: legal review is required before publishing."

    if res in ("news", "activities") and new_status in ("approved", "scheduled", "published"):
        sub_judice = data.get("sub_judice", getattr(row, "sub_judice", False))
        actor = data.get("actor", getattr(row, "actor", "wing"))
        legal_reviewed = data.get("legal_reviewed", getattr(row, "legal_reviewed", False))
        if (sub_judice or actor != "wing") and not legal_reviewed:
            return "Sub judice or third-party-actor records require the Legal Review checkbox before publishing."

    if res == "bearers" and new_status == "published":
        consent = data.get("consent_obtained", getattr(row, "consent_obtained", False))
        if not consent:
            return "Written consent must be recorded before publishing an office bearer."

    if res == "images":
        courtroom_ok = data.get("courtroom_check_passed", getattr(row, "courtroom_check_passed", False))
        licence = data.get("licence_type", getattr(row, "licence_type", ""))
        credit = data.get("credit_line", getattr(row, "credit_line", ""))
        if courtroom_ok and (not licence or not str(credit).strip()):
            return "Credit line and licence type (own/agency/supplied) are required for cleared gallery items."

    return None


@admin_bp.post("/login")
@limiter.limit("12 per minute")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    admin = Admin.query.filter_by(email=email).first()

    if admin and admin.locked_until and admin.locked_until > datetime.utcnow():
        return bad("Account temporarily locked due to repeated failed attempts. Try again later.", 423)

    if not admin or not admin.is_active or not admin.check_password(data.get("password") or ""):
        if admin:
            admin.failed_logins = (admin.failed_logins or 0) + 1
            if admin.failed_logins >= 5:
                admin.locked_until = datetime.utcnow() + timedelta(minutes=15)
            log_audit(admin, "login_failed", "admin", admin.id)
            db.session.commit()
        return bad("Email or password is incorrect.", 401)

    if admin.totp_enabled:
        code = (data.get("totp_code") or "").strip()
        if not code:
            challenge = create_access_token(
                identity=str(admin.id),
                expires_delta=timedelta(minutes=5),
                additional_claims={"totp_pending": True},
            )
            resp = jsonify(requires_totp=True, message="Enter the 6-digit authenticator code.")
            set_access_cookies(resp, challenge)
            return resp, 202
        if not verify_totp(admin.totp_secret, code):
            log_audit(admin, "login_totp_failed", "admin", admin.id)
            db.session.commit()
            return bad("Invalid authenticator code.", 401)

    admin.failed_logins = 0
    admin.locked_until = None
    admin.last_login_at = datetime.utcnow()
    log_audit(admin, "login", "admin", admin.id)
    db.session.commit()

    resp = jsonify(admin=admin.to_dict(), require_2fa_setup=bool(current_app.config.get("REQUIRE_2FA") and not admin.totp_enabled))
    set_access_cookies(resp, create_access_token(identity=str(admin.id)))
    return resp


@admin_bp.post("/login/totp")
@jwt_required()
@limiter.limit("10 per minute")
def login_totp():
    claims = get_jwt()
    if not claims.get("totp_pending"):
        return bad("No 2FA challenge pending.", 400)
    admin = db.session.get(Admin, int(get_jwt_identity()))
    if not admin or not admin.is_active or not admin.totp_enabled:
        return bad("Account not found.", 401)
    data = request.get_json(silent=True) or {}
    code = (data.get("totp_code") or "").strip()
    if not verify_totp(admin.totp_secret, code):
        log_audit(admin, "login_totp_failed", "admin", admin.id)
        db.session.commit()
        return bad("Invalid 6-digit authenticator code.", 401)
    admin.failed_logins = 0
    admin.locked_until = None
    admin.last_login_at = datetime.utcnow()
    log_audit(admin, "login", "admin", admin.id, after={"method": "totp"})
    db.session.commit()
    resp = jsonify(admin=admin.to_dict())
    set_access_cookies(resp, create_access_token(identity=str(admin.id)))
    return resp


@admin_bp.post("/logout")
def logout():
    resp = jsonify(ok=True)
    unset_jwt_cookies(resp)
    return resp


@admin_bp.get("/me")
@jwt_required()
def me():
    admin, err = _current_admin("district_editor")
    if err:
        return err
    return jsonify(admin=admin.to_dict())


@admin_bp.post("/2fa/setup")
@jwt_required()
def totp_setup():
    admin, err = _current_admin("district_editor")
    if err:
        return err
    secret = generate_secret()
    admin.totp_secret = secret
    admin.totp_enabled = False
    log_audit(admin, "2fa_setup", "admin", admin.id)
    db.session.commit()
    return jsonify(secret=secret, otpauth_uri=provisioning_uri(secret, admin.email))


@admin_bp.post("/2fa/enable")
@jwt_required()
def totp_enable():
    admin, err = _current_admin("district_editor")
    if err:
        return err
    data = request.get_json(silent=True) or {}
    code = (data.get("code") or "").strip()
    if not admin.totp_secret or not verify_totp(admin.totp_secret, code):
        return bad("Invalid authenticator code. Please check your device time and try again.")
    admin.totp_enabled = True
    log_audit(admin, "2fa_enabled", "admin", admin.id)
    db.session.commit()
    return jsonify(ok=True, admin=admin.to_dict())


@admin_bp.post("/2fa/disable")
@jwt_required()
def totp_disable():
    admin, err = _current_admin("district_editor")
    if err:
        return err
    data = request.get_json(silent=True) or {}
    if not admin.check_password(data.get("password") or ""):
        return bad("Password is incorrect.")
    if admin.totp_enabled and not verify_totp(admin.totp_secret, data.get("code") or ""):
        return bad("Current authenticator code is invalid.")
    admin.totp_enabled = False
    admin.totp_secret = ""
    log_audit(admin, "2fa_disabled", "admin", admin.id)
    db.session.commit()
    return jsonify(ok=True, admin=admin.to_dict())


@admin_bp.post("/password")
@jwt_required()
def change_password():
    admin, err = _current_admin("district_editor")
    if err:
        return err
    data = request.get_json(silent=True) or {}
    if not admin.check_password(data.get("current") or ""):
        return bad("Current password is incorrect.", 400)
    new = data.get("new") or ""
    if len(new) < 10:
        return bad("New password must be at least 10 characters.")
    admin.set_password(new)
    log_audit(admin, "password_change", "admin", admin.id)
    db.session.commit()
    return jsonify(ok=True)


@admin_bp.get("/stats")
@jwt_required()
def stats():
    admin, err = _current_admin("district_editor")
    if err:
        return err
    em = SiteSetting.query.filter_by(key="election_mode").first()
    return jsonify(
        news=News.query.filter(News.trashed_at.is_(None)).count(),
        activities=Activity.query.filter(Activity.trashed_at.is_(None)).count(),
        resources=LegalResource.query.filter(LegalResource.trashed_at.is_(None)).count(),
        albums=GalleryAlbum.query.filter(GalleryAlbum.trashed_at.is_(None)).count(),
        unread=ContactMessage.query.filter_by(is_read=False).count(),
        pending_bearers=OfficeBearer.query.filter_by(status="pending_confirmation").filter(OfficeBearer.trashed_at.is_(None)).count(),
        pending_districts=District.query.filter_by(status="pending_confirmation").filter(District.trashed_at.is_(None)).count(),
        checklist_confirmed=ChecklistItem.query.filter_by(status="confirmed").count(),
        checklist_total=ChecklistItem.query.count(),
        election_mode=bool(em and em.value == "true"),
        admin_role=admin.role,
    )


@admin_bp.post("/upload")
@jwt_required()
def upload():
    admin, err = _current_admin("district_editor")
    if err:
        return err
    f = request.files.get("file")
    if not f or not f.filename:
        return bad("Choose a file to upload.")
    kind = request.form.get("kind", "image")
    ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else ""
    allowed = {"pdf"} if kind == "pdf" else set(IMAGE_MAGIC)
    if ext not in allowed:
        return bad("Allowed file types: PDF." if kind == "pdf" else "Allowed image types: JPG, PNG, WEBP, GIF.")

    f.seek(0, os.SEEK_END)
    size = f.tell()
    f.seek(0)
    limit = MAX_PDF_BYTES if kind == "pdf" else MAX_IMAGE_BYTES
    if size > limit:
        return bad(f"File exceeds the maximum limit ({'25 MB' if kind == 'pdf' else '10 MB'}).")

    head = f.read(16)
    f.seek(0)
    signatures = [b"%PDF"] if kind == "pdf" else IMAGE_MAGIC[ext]
    if not any(head.startswith(sig) for sig in signatures):
        return bad("This file does not match the declared " + ("PDF format." if kind == "pdf" else "image format."))

    name = uuid.uuid4().hex + "." + ext
    f.save(os.path.join(current_app.config["UPLOAD_DIR"], name))
    log_audit(admin, "upload", "media", name, after={"kind": kind, "bytes": size})
    db.session.commit()
    return jsonify(url="/uploads/" + name)


@admin_bp.get("/audit")
@jwt_required()
def audit_list():
    _, err = _current_admin("publisher")
    if err:
        return err
    rows = AuditLog.query.order_by(AuditLog.created_at.desc(), AuditLog.id.desc()).limit(250).all()
    return jsonify(items=[r.to_dict() for r in rows])


@admin_bp.get("/checklist")
@jwt_required()
def checklist_list():
    _, err = _current_admin("district_editor")
    if err:
        return err
    rows = ChecklistItem.query.order_by(ChecklistItem.item_no.asc()).all()
    return jsonify(items=[r.to_dict() for r in rows])


@admin_bp.put("/checklist/<int:item_id>")
@jwt_required()
def checklist_update(item_id):
    admin, err = _current_admin("publisher")
    if err:
        return err
    row = db.get_or_404(ChecklistItem, item_id)
    before = _snapshot(row)
    data = request.get_json(silent=True) or {}
    if "status" in data and data["status"] in ("pending", "in_progress", "confirmed", "omitted"):
        row.status = data["status"]
    if "client_response" in data:
        row.client_response = str(data["client_response"] or "").strip()
    row.updated_by = admin.email
    log_audit(admin, "update", "checklist", row.id, before=before, after=_snapshot(row))
    db.session.commit()
    return jsonify(item=row.to_dict())


@admin_bp.get("/settings")
@jwt_required()
def settings_list():
    _, err = _current_admin("publisher")
    if err:
        return err
    rows = SiteSetting.query.order_by(SiteSetting.key.asc()).all()
    return jsonify(items=[r.to_dict() for r in rows])


@admin_bp.put("/settings/<key>")
@jwt_required()
def settings_update(key):
    admin, err = _current_admin("publisher")
    if err:
        return err
    row = SiteSetting.query.filter_by(key=key).first()
    if not row:
        row = SiteSetting(key=key, value="")
        db.session.add(row)
    before = _snapshot(row)
    data = request.get_json(silent=True) or {}
    row.value = str(data.get("value", "")).strip()
    log_audit(admin, "update", "setting", key, before=before, after={"key": key, "value": row.value})
    db.session.commit()
    return jsonify(item=row.to_dict())


@admin_bp.get("/users")
@jwt_required()
def users_list():
    _, err = _current_admin("super_admin")
    if err:
        return err
    rows = Admin.query.order_by(Admin.id.asc()).all()
    return jsonify(items=[u.to_dict() for u in rows])


@admin_bp.post("/users")
@jwt_required()
def users_create():
    admin, err = _current_admin("super_admin")
    if err:
        return err
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "").strip()
    password = data.get("password") or ""
    role = data.get("role") or "editor"
    if role not in ("super_admin", "publisher", "editor", "district_editor"):
        return bad("Invalid role.")
    if not email or not name or len(password) < 10:
        return bad("Name, email, and a password of at least 10 characters are required.")
    if Admin.query.filter_by(email=email).first():
        return bad("An admin account with that email already exists.")
    user = Admin(
        name=name,
        email=email,
        role=role,
        district_scope=(data.get("district_scope") or "").strip(),
        is_active=True,
    )
    user.set_password(password)
    db.session.add(user)
    db.session.flush()
    log_audit(admin, "create", "admin_user", user.id, after=user.to_dict())
    db.session.commit()
    return jsonify(item=user.to_dict()), 201


@admin_bp.put("/users/<int:user_id>")
@jwt_required()
def users_update(user_id):
    admin, err = _current_admin("super_admin")
    if err:
        return err
    user = db.get_or_404(Admin, user_id)
    before = user.to_dict()
    data = request.get_json(silent=True) or {}
    if "name" in data and data["name"]:
        user.name = str(data["name"]).strip()
    if "role" in data and data["role"] in ("super_admin", "publisher", "editor", "district_editor"):
        user.role = data["role"]
    if "district_scope" in data:
        user.district_scope = str(data["district_scope"] or "").strip()
    if "is_active" in data:
        user.is_active = bool(data["is_active"])
    if data.get("password"):
        if len(data["password"]) < 10:
            return bad("Password must be at least 10 characters.")
        user.set_password(data["password"])
    log_audit(admin, "update", "admin_user", user.id, before=before, after=user.to_dict())
    db.session.commit()
    return jsonify(item=user.to_dict())


@admin_bp.post("/messages/<int:msg_id>/erase")
@jwt_required()
def erase_message_pii(msg_id):
    """DPDP Act/Rules PII erasure: removes personal fields while retaining anonymous audit record."""
    admin, err = _current_admin("publisher")
    if err:
        return err
    row = db.get_or_404(ContactMessage, msg_id)
    before = _snapshot(row)
    row.name = "[ERASED UNDER DPDP]"
    row.email = ""
    row.phone = ""
    row.message = "[Personal data erased upon request / retention expiry]"
    row.status = "erased"
    row.erased_at = datetime.utcnow()
    row.is_read = True
    log_audit(admin, "dpdp_erase", "contact_message", row.id, before={"inquiry_type": before.get("inquiry_type")}, after={"status": "erased"})
    db.session.commit()
    return jsonify(item=row.to_dict())


@admin_bp.post("/images/<int:img_id>/takedown")
@jwt_required()
def toggle_image_takedown(img_id):
    admin, err = _current_admin("publisher")
    if err:
        return err
    row = db.get_or_404(GalleryImage, img_id)
    before = _snapshot(row)
    data = request.get_json(silent=True) or {}
    new_status = data.get("takedown_status", "hidden")
    if new_status not in ("none", "hidden", "removed"):
        return bad("Invalid takedown status.")
    row.takedown_status = new_status
    log_audit(admin, "takedown", "gallery_image", row.id, before=before, after={"takedown_status": new_status})
    db.session.commit()
    return jsonify(item=row.to_dict())


@admin_bp.get("/<res>")
@jwt_required()
def list_rows(res):
    admin, err = _current_admin("district_editor")
    if err:
        return err
    spec = spec_for(res)
    if not spec:
        return bad("Unknown section.", 404)
    model, _, _, order_col, desc, _, _ = spec
    column = getattr(model, order_col)
    query = model.query
    if res == "images" and request.args.get("album_id"):
        query = query.filter_by(album_id=request.args.get("album_id", type=int))
    if not request.args.get("include_trashed") and hasattr(model, "trashed_at"):
        query = query.filter(model.trashed_at.is_(None))
    if admin.role == "district_editor" and admin.district_scope and hasattr(model, "district_tag"):
        query = query.filter(db.or_(model.district_tag == admin.district_scope, model.district_tag == ""))
    rows = query.order_by(column.desc() if desc else column.asc()).limit(1000).all()
    return jsonify(items=[r.to_dict() for r in rows])


@admin_bp.post("/<res>")
@jwt_required()
def create_row(res):
    spec = spec_for(res)
    if not spec:
        return bad("Unknown section.", 404)
    model, fields, required, _, _, can_create, min_role = spec
    admin, err = _current_admin(min_role)
    if err:
        return err
    if not can_create:
        return bad("This section cannot be added to.", 405)
    data = request.get_json(silent=True) or {}
    for field in required:
        if data.get(field) in (None, ""):
            return bad(f"“{field.replace('_', ' ')}” is required.")
    if "slug" in fields and not data.get("slug") and data.get("title"):
        data["slug"] = _auto_slug(data["title"])
    if admin.role == "editor" or admin.role == "district_editor":
        if "status" in fields and data.get("status") in ("published", "approved", "scheduled"):
            data["status"] = "in_review"
    row = model()
    comp_err = _validate_compliance(res, row, data, admin)
    if comp_err:
        return bad(comp_err, 400)
    try:
        apply_fields(row, model, fields, data)
        db.session.add(row)
        db.session.flush()
        log_audit(admin, "create", res, getattr(row, "id", ""), after=_snapshot(row))
        db.session.commit()
    except (ValueError, TypeError):
        db.session.rollback()
        return bad("One of the values is not in the right format.")
    return jsonify(item=row.to_dict()), 201


@admin_bp.put("/<res>/<int:row_id>")
@jwt_required()
def update_row(res, row_id):
    spec = spec_for(res)
    if not spec:
        return bad("Unknown section.", 404)
    model, fields, required, _, _, _, min_role = spec
    admin, err = _current_admin(min_role)
    if err:
        return err
    row = db.get_or_404(model, row_id)
    before = _snapshot(row)
    data = request.get_json(silent=True) or {}
    for field in required:
        if field in data and data.get(field) in (None, ""):
            return bad(f"“{field.replace('_', ' ')}” cannot be empty.")
    comp_err = _validate_compliance(res, row, data, admin)
    if comp_err:
        return bad(comp_err, 400)
    try:
        apply_fields(row, model, fields, data)
        if res in ("news", "activities") and data.get("status") == "published" and hasattr(row, "approved_by"):
            row.approved_by = admin.email
        log_audit(admin, "update", res, row_id, before=before, after=_snapshot(row))
        db.session.commit()
    except (ValueError, TypeError):
        db.session.rollback()
        return bad("One of the values is not in the right format.")
    return jsonify(item=row.to_dict())


@admin_bp.delete("/<res>/<int:row_id>")
@jwt_required()
def delete_row(res, row_id):
    spec = spec_for(res)
    if not spec:
        return bad("Unknown section.", 404)
    admin, err = _current_admin("publisher")
    if err:
        return err
    if res == "pages":
        return bad("Pages cannot be deleted.", 405)
    model = spec[0]
    row = db.get_or_404(model, row_id)
    before = _snapshot(row)
    if hasattr(row, "trashed_at"):
        row.trashed_at = datetime.utcnow()
        if hasattr(row, "status"):
            row.status = "trashed"
        if hasattr(row, "is_published"):
            row.is_published = False
        log_audit(admin, "trash", res, row_id, before=before, after=_snapshot(row))
        db.session.commit()
        return jsonify(ok=True, trashed=True)
    db.session.delete(row)
    log_audit(admin, "delete", res, row_id, before=before)
    db.session.commit()
    return jsonify(ok=True)


@admin_bp.post("/<res>/<int:row_id>/restore")
@jwt_required()
def restore_row(res, row_id):
    spec = spec_for(res)
    if not spec:
        return bad("Unknown section.", 404)
    admin, err = _current_admin("publisher")
    if err:
        return err
    model = spec[0]
    row = db.get_or_404(model, row_id)
    if not hasattr(row, "trashed_at"):
        return bad("This section does not support trash restore.")
    before = _snapshot(row)
    row.trashed_at = None
    if hasattr(row, "status"):
        row.status = "draft"
    log_audit(admin, "restore", res, row_id, before=before, after=_snapshot(row))
    db.session.commit()
    return jsonify(item=row.to_dict())


@admin_bp.delete("/<res>/<int:row_id>/purge")
@jwt_required()
def purge_row(res, row_id):
    spec = spec_for(res)
    if not spec:
        return bad("Unknown section.", 404)
    admin, err = _current_admin("super_admin")
    if err:
        return err
    row = db.get_or_404(spec[0], row_id)
    before = _snapshot(row)
    db.session.delete(row)
    log_audit(admin, "purge", res, row_id, before=before)
    db.session.commit()
    return jsonify(ok=True)
