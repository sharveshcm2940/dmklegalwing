from datetime import date, datetime, timedelta

from flask import Blueprint, jsonify, request

from audit import log_audit
from extensions import db, limiter
from models import (
    Activity, ContactMessage, DatedCounter, District, GalleryAlbum,
    LegalResource, News, OfficeBearer, Page, RevenueDistrict, SiteSetting,
)

public_bp = Blueprint("public", __name__)


def clean(value, limit):
    return (value or "").strip()[:limit]


def _settings_map():
    rows = SiteSetting.query.all()
    return {r.key: r.value for r in rows}


def _live_filter(query, model):
    now = datetime.utcnow()
    query = query.filter(model.status == "published")
    if hasattr(model, "trashed_at"):
        query = query.filter(model.trashed_at.is_(None))
    if hasattr(model, "publish_at"):
        query = query.filter(db.or_(model.publish_at.is_(None), model.publish_at <= now))
    if hasattr(model, "unpublish_at"):
        query = query.filter(db.or_(model.unpublish_at.is_(None), model.unpublish_at >= now))
    return query


@public_bp.get("/settings")
def public_settings():
    s = _settings_map()
    return jsonify(
        election_mode=s.get("election_mode", "false") == "true",
        wing_official_email=s.get("wing_official_email", ""),
        wing_official_phone=s.get("wing_official_phone", ""),
        wing_office_address_en=s.get("wing_office_address_en", ""),
        wing_office_address_ta=s.get("wing_office_address_ta", ""),
        grievance_officer_name=s.get("grievance_officer_name", ""),
        grievance_officer_email=s.get("grievance_officer_email", ""),
        last_updated_date=s.get("last_updated_date", "2026-11-26"),
        sir_helpline_confirmed=s.get("sir_helpline_confirmed", "false") == "true",
    )


@public_bp.get("/home")
def home():
    news = (
        _live_filter(News.query, News)
        .order_by(News.pinned.desc(), News.published_at.desc())
        .limit(6)
        .all()
    )
    upcoming = (
        _live_filter(Activity.query, Activity)
        .filter(Activity.event_date >= date.today())
        .order_by(Activity.event_date.asc())
        .limit(4)
        .all()
    )
    if not upcoming:
        upcoming = (
            _live_filter(Activity.query, Activity)
            .order_by(Activity.event_date.desc())
            .limit(4)
            .all()
        )
    resources = (
        _live_filter(LegalResource.query, LegalResource)
        .order_by(LegalResource.created_at.desc())
        .limit(4)
        .all()
    )
    counters = (
        DatedCounter.query.filter_by(status="published")
        .order_by(DatedCounter.sort_order.asc())
        .all()
    )
    bearers = (
        OfficeBearer.query.filter_by(status="published", consent_obtained=True)
        .filter(OfficeBearer.trashed_at.is_(None))
        .order_by(OfficeBearer.sort_order.asc(), OfficeBearer.id.asc())
        .all()
    )
    albums = (
        GalleryAlbum.query.filter_by(status="published")
        .filter(GalleryAlbum.trashed_at.is_(None))
        .order_by(GalleryAlbum.created_at.desc())
        .limit(6)
        .all()
    )
    gallery_teaser = []
    for alb in albums:
        for img in alb.images:
            if img.takedown_status == "none" and img.courtroom_check_passed:
                d = img.to_dict()
                d["album_title"] = alb.title
                d["album_title_ta"] = alb.title_ta
                gallery_teaser.append(d)
                if len(gallery_teaser) >= 6:
                    break
        if len(gallery_teaser) >= 6:
            break

    page = Page.query.filter_by(key="home").first()
    return jsonify(
        intro=page.to_dict() if page else None,
        counters=[c.to_dict() for c in counters],
        news=[n.to_dict() for n in news],
        activities=[a.to_dict() for a in upcoming],
        resources=[r.to_dict() for r in resources],
        bearers=[b.to_dict() for b in bearers],
        gallery=gallery_teaser,
        revenue_district_count=RevenueDistrict.query.count(),
        party_district_published_count=District.query.filter_by(status="published").filter(District.trashed_at.is_(None)).count(),
        settings=_settings_map(),
    )


@public_bp.get("/pages/<key>")
def page(key):
    row = Page.query.filter_by(key=key).first_or_404()
    return jsonify(row.to_dict())


@public_bp.get("/news")
def news_list():
    page_no = max(request.args.get("page", 1, type=int), 1)
    q = clean(request.args.get("q"), 80)
    actor = clean(request.args.get("actor"), 30)
    source_type = clean(request.args.get("source_type"), 30)
    query = _live_filter(News.query, News)
    if actor:
        query = query.filter(News.actor == actor)
    if source_type:
        query = query.filter(News.source_type == source_type)
    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(
            News.title.like(like), News.title_ta.like(like),
            News.summary.like(like), News.summary_ta.like(like),
        ))
    total = query.count()
    per_page = 9
    rows = (
        query.order_by(News.pinned.desc(), News.published_at.desc())
        .offset((page_no - 1) * per_page)
        .limit(per_page)
        .all()
    )
    items = []
    for n in rows:
        d = n.to_dict()
        d.pop("body", None)
        d.pop("body_en", None)
        d.pop("body_ta", None)
        items.append(d)
    return jsonify(
        items=items,
        page=page_no,
        pages=max((total + per_page - 1) // per_page, 1),
        total=total,
    )


@public_bp.get("/news/<int:news_id>")
def news_detail(news_id):
    row = db.session.get(News, news_id)
    if not row or row.trashed_at is not None:
        return jsonify(error="Article not found."), 404
    if row.status == "withdrawn":
        return jsonify(
            withdrawn=True,
            id=row.id,
            message_en="This item has been withdrawn following editorial or legal review.",
            message_ta="ஆசிரியர் அல்லது சட்ட மறுஆய்வைத் தொடர்ந்து இந்தப் பதிவு திரும்பப் பெறப்பட்டுள்ளது.",
        )
    if row.status != "published":
        return jsonify(error="Article not found."), 404
    return jsonify(row.to_dict())


@public_bp.get("/activities")
def activities():
    category = clean(request.args.get("category"), 80)
    actor = clean(request.args.get("actor"), 30)
    district = clean(request.args.get("district"), 120)
    q = clean(request.args.get("q"), 80)
    query = _live_filter(Activity.query, Activity)
    if category:
        query = query.filter(Activity.category == category)
    if actor:
        query = query.filter(Activity.actor == actor)
    if district:
        query = query.filter(Activity.district_tag == district)
    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(
            Activity.title.like(like), Activity.title_ta.like(like),
            Activity.description.like(like), Activity.description_ta.like(like),
            Activity.location.like(like), Activity.tags.like(like),
        ))
    rows = query.order_by(Activity.event_date.desc()).limit(200).all()
    cats = [
        c[0]
        for c in db.session.query(Activity.category)
        .filter(Activity.status == "published", Activity.trashed_at.is_(None))
        .distinct()
        .order_by(Activity.category)
        .all()
    ]
    return jsonify(items=[a.to_dict() for a in rows], categories=cats)


@public_bp.get("/activities/<int:act_id>")
def activity_detail(act_id):
    row = db.session.get(Activity, act_id)
    if not row or row.trashed_at is not None:
        return jsonify(error="Activity not found."), 404
    if row.status == "withdrawn":
        return jsonify(
            withdrawn=True,
            id=row.id,
            message_en="This activity record has been withdrawn pending legal review.",
            message_ta="சட்ட மறுஆய்வின் அடிப்படையில் இந்தச் செயல்பாட்டுப் பதிவு திரும்பப் பெறப்பட்டுள்ளது.",
        )
    if row.status != "published":
        return jsonify(error="Activity not found."), 404
    return jsonify(row.to_dict())


@public_bp.get("/resources")
def resources():
    category = clean(request.args.get("category"), 80)
    lang_badge = clean(request.args.get("language"), 30)
    q = clean(request.args.get("q"), 80)
    query = LegalResource.query.filter_by(status="published").filter(LegalResource.trashed_at.is_(None))
    if category:
        query = query.filter_by(category=category)
    if lang_badge:
        query = query.filter_by(language_badge=lang_badge)
    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(
            LegalResource.title.like(like), LegalResource.title_ta.like(like),
            LegalResource.description.like(like), LegalResource.description_ta.like(like),
        ))
    rows = query.order_by(LegalResource.created_at.desc()).limit(300).all()
    cats = [
        c[0]
        for c in db.session.query(LegalResource.category)
        .filter(LegalResource.status == "published", LegalResource.trashed_at.is_(None))
        .distinct()
        .order_by(LegalResource.category)
        .all()
    ]
    return jsonify(items=[r.to_dict() for r in rows], categories=cats)


@public_bp.get("/albums")
def albums():
    category = clean(request.args.get("category"), 80)
    district = clean(request.args.get("district"), 120)
    year = request.args.get("year", type=int)
    query = GalleryAlbum.query.filter_by(status="published").filter(GalleryAlbum.trashed_at.is_(None))
    if category:
        query = query.filter_by(category=category)
    if district:
        query = query.filter_by(district_tag=district)
    rows = query.order_by(GalleryAlbum.created_at.desc()).all()
    if year:
        rows = [r for r in rows if r.event_date and r.event_date.year == year]
    return jsonify(items=[a.to_dict() for a in rows])


@public_bp.get("/albums/<int:album_id>")
def album(album_id):
    row = db.get_or_404(GalleryAlbum, album_id)
    if row.status != "published" or row.trashed_at is not None:
        return jsonify(error="Album not available."), 404
    data = row.to_dict()
    data["images"] = [
        i.to_dict()
        for i in row.images
        if i.takedown_status == "none" and i.courtroom_check_passed
    ]
    return jsonify(data)


@public_bp.get("/bearers")
def bearers():
    # Compliance: publish only wing-confirmed entries with explicit consent and office contacts only
    rows = (
        OfficeBearer.query.filter_by(status="published", consent_obtained=True)
        .filter(OfficeBearer.trashed_at.is_(None))
        .order_by(OfficeBearer.sort_order, OfficeBearer.id)
        .all()
    )
    pending_count = (
        OfficeBearer.query.filter_by(status="pending_confirmation")
        .filter(OfficeBearer.trashed_at.is_(None))
        .count()
    )
    return jsonify(items=[b.to_dict() for b in rows], pending_confirmation_count=pending_count)


@public_bp.get("/districts")
def districts():
    rev_rows = RevenueDistrict.query.order_by(RevenueDistrict.sort_order, RevenueDistrict.name_en).all()
    party_rows = (
        District.query.filter_by(status="published")
        .filter(District.trashed_at.is_(None))
        .order_by(District.sort_order, District.name)
        .all()
    )
    pending_party_count = (
        District.query.filter_by(status="pending_confirmation")
        .filter(District.trashed_at.is_(None))
        .count()
    )
    recent_acts = (
        _live_filter(Activity.query, Activity)
        .filter(Activity.district_tag != "")
        .order_by(Activity.event_date.desc())
        .limit(100)
        .all()
    )
    act_map = {}
    for a in recent_acts:
        act_map.setdefault(a.district_tag, []).append({
            "id": a.id,
            "title": a.title,
            "title_ta": a.title_ta,
            "event_date": a.event_date.isoformat(),
            "actor": a.actor,
        })

    return jsonify(
        revenue_districts=[r.to_dict() for r in rev_rows],
        party_districts=[d.to_dict() for d in party_rows],
        pending_confirmation_count=pending_party_count,
        activities_by_district=act_map,
    )


@public_bp.post("/contact")
@limiter.limit("8 per hour")
def contact():
    data = request.get_json(silent=True) or {}
    if data.get("website"):  # honeypot
        return jsonify(ok=True)
    name = clean(data.get("name"), 120)
    message = clean(data.get("message"), 4000)
    email = clean(data.get("email"), 190)
    phone = clean(data.get("phone"), 40)
    district = clean(data.get("district"), 120)
    inquiry_type = clean(data.get("inquiry_type"), 30) or "general"
    if inquiry_type not in ("general", "cadre_helpdesk", "dpdp_erasure", "takedown", "correction"):
        inquiry_type = "general"

    if not data.get("dpdp_consent"):
        return jsonify(error="Please confirm the DPDP privacy notice consent checkbox before submitting."), 400
    if not data.get("is_adult_or_guardian", True):
        return jsonify(error="Verifiable guardian consent is required for persons under 18."), 400
    if not name or len(message) < 10:
        return jsonify(error="Please enter your name and a message of at least 10 characters."), 400
    if email and ("@" not in email or "." not in email):
        return jsonify(error="That email address does not look right."), 400

    row = ContactMessage(
        inquiry_type=inquiry_type,
        district=district,
        name=name,
        email=email,
        phone=phone,
        message=message,
        dpdp_consent=True,
        is_adult_or_guardian=bool(data.get("is_adult_or_guardian", True)),
        purpose_acknowledged=clean(data.get("purpose_acknowledged"), 190) or f"Inquiry: {inquiry_type}",
        retention_until=date.today() + timedelta(days=365),
        status="new",
    )
    db.session.add(row)
    db.session.flush()
    log_audit(None, "submit", "contact_message", row.id, after={"inquiry_type": inquiry_type, "district": district})
    db.session.commit()
    return jsonify(ok=True, reference_id=row.id, retention_until=row.retention_until.isoformat()), 201
