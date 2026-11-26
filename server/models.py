from datetime import datetime, date
import json

from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


WORKFLOW_STATUSES = (
    "draft",
    "in_review",
    "pending_confirmation",
    "approved",
    "scheduled",
    "published",
    "archived",
    "trashed",
    "withdrawn",
)

ACTOR_TYPES = (
    "wing",
    "party",
    "stalin",
    "tn_govt_pre_2026",
    "counsel",
)

ACTIVITY_CATEGORIES = (
    "Legal aid and helplines",
    "Court interventions",
    "Protests and agitations",
    "Conferences and round-tables",
    "Representations and memoranda",
    "Election and electoral-roll support",
    "Advocate welfare and training",
    "Felicitations",
    "Statements",
)


class Serializable:
    """Turns a row into a plain dict (dates become ISO strings)."""

    def to_dict(self):
        out = {}
        for col in self.__table__.columns:
            value = getattr(self, col.name)
            if isinstance(value, (datetime, date)):
                value = value.isoformat()
            out[col.name] = value
        return out


class Admin(db.Model, Serializable):
    __tablename__ = "admins"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(190), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    # super_admin, publisher, editor, district_editor
    role = db.Column(db.String(30), nullable=False, default="super_admin")
    district_scope = db.Column(db.String(120), default="")
    totp_secret = db.Column(db.String(64), default="")
    totp_enabled = db.Column(db.Boolean, default=False)
    failed_logins = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime, nullable=True)
    last_login_at = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, raw):
        self.password_hash = generate_password_hash(raw)

    def check_password(self, raw):
        return check_password_hash(self.password_hash, raw)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "district_scope": self.district_scope,
            "totp_enabled": bool(self.totp_enabled),
            "is_active": bool(self.is_active),
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class AuditLog(db.Model, Serializable):
    """Immutable CMS audit trail (retained >= 1 year per DPDP Rules)."""
    __tablename__ = "audit_logs"
    id = db.Column(db.Integer, primary_key=True)
    actor_id = db.Column(db.Integer, nullable=True, index=True)
    actor_email = db.Column(db.String(190), nullable=False, default="")
    actor_role = db.Column(db.String(30), default="")
    action = db.Column(db.String(40), nullable=False, index=True)
    resource = db.Column(db.String(60), nullable=False, index=True)
    resource_id = db.Column(db.String(64), default="")
    ip_address = db.Column(db.String(64), default="")
    before_json = db.Column(db.Text, default="")
    after_json = db.Column(db.Text, default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)


class OfficeBearer(db.Model, Serializable):
    __tablename__ = "office_bearers"
    id = db.Column(db.Integer, primary_key=True)
    # head, secretary, joint, deputy, hq
    group_key = db.Column(db.String(20), nullable=False, default="joint")
    tier = db.Column(db.String(40), default="")
    name_en = db.Column(db.String(160), nullable=False)
    name_ta = db.Column(db.String(160), nullable=False)
    role_en = db.Column(db.String(160), default="")
    role_ta = db.Column(db.String(160), default="")
    place_en = db.Column(db.String(120), default="")
    place_ta = db.Column(db.String(120), default="")
    # Office contacts only (no personal residence addresses)
    office_email = db.Column(db.String(190), default="")
    phone = db.Column(db.String(80), default="")
    bar_enrolment = db.Column(db.String(80), default="")
    photo = db.Column(db.String(255), default="")
    consent_obtained = db.Column(db.Boolean, default=False)
    term_start = db.Column(db.Date, nullable=True)
    term_end = db.Column(db.Date, nullable=True)
    confirmed_by_wing_on = db.Column(db.Date, nullable=True)
    as_of_date = db.Column(db.String(40), default="")
    source_note = db.Column(db.String(255), default="")
    status = db.Column(db.String(30), default="pending_confirmation", index=True)
    trashed_at = db.Column(db.DateTime, nullable=True)
    sort_order = db.Column(db.Integer, default=0)


class RevenueDistrict(db.Model, Serializable):
    """Official Tamil Nadu 38 revenue districts + Puducherry/Karaikal mapped to HC seats."""
    __tablename__ = "revenue_districts"
    id = db.Column(db.Integer, primary_key=True)
    name_en = db.Column(db.String(120), nullable=False, unique=True)
    name_ta = db.Column(db.String(120), nullable=False)
    # Chennai (Principal Seat) or Madurai (Madurai Bench)
    high_court_seat = db.Column(db.String(40), nullable=False, default="Chennai")
    region = db.Column(db.String(60), default="Tamil Nadu")
    notes_en = db.Column(db.String(255), default="")
    notes_ta = db.Column(db.String(255), default="")
    sort_order = db.Column(db.Integer, default=0)


class District(db.Model, Serializable):
    """Party organisational district unit (separate from revenue district; 77 -> 110 Aug 2026)."""
    __tablename__ = "districts"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    name_ta = db.Column(db.String(120), default="")
    revenue_district_id = db.Column(db.Integer, db.ForeignKey("revenue_districts.id"), nullable=True)
    revenue_district_name = db.Column(db.String(120), default="")
    assembly_constituencies = db.Column(db.String(255), default="")
    organiser = db.Column(db.String(160), default="")
    organiser_ta = db.Column(db.String(160), default="")
    deputies = db.Column(db.String(255), default="")
    office_address = db.Column(db.String(255), default="")
    phone = db.Column(db.String(80), default="")
    principal_court = db.Column(db.String(190), default="")
    bar_associations = db.Column(db.String(255), default="")
    high_court_seat = db.Column(db.String(40), default="Chennai")
    member_count = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(30), default="pending_confirmation", index=True)
    confirmed_by_wing_on = db.Column(db.Date, nullable=True)
    source_note = db.Column(db.String(255), default="")
    last_updated = db.Column(db.Date, nullable=True)
    trashed_at = db.Column(db.DateTime, nullable=True)
    sort_order = db.Column(db.Integer, default=0)


class News(db.Model, Serializable):
    __tablename__ = "news"
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(180), default="", index=True)
    title = db.Column(db.String(255), nullable=False)
    title_ta = db.Column(db.String(255), default="")
    summary = db.Column(db.String(500), default="")
    summary_ta = db.Column(db.String(500), default="")
    body = db.Column(db.Text, nullable=False, default="")
    body_ta = db.Column(db.Text, default="")
    # own_statement, press_release, external_coverage
    source_type = db.Column(db.String(30), default="own_statement")
    outlet_name = db.Column(db.String(120), default="")
    external_url = db.Column(db.String(500), default="")
    dateline = db.Column(db.String(120), default="")
    # wing, party, stalin, tn_govt_pre_2026, counsel
    actor = db.Column(db.String(30), default="wing", index=True)
    district_tag = db.Column(db.String(120), default="")
    related_activity_id = db.Column(db.Integer, nullable=True)
    pinned = db.Column(db.Boolean, default=False)
    cover_image = db.Column(db.String(255), default="")
    status = db.Column(db.String(30), default="published", index=True)
    legal_reviewed = db.Column(db.Boolean, default=False)
    legal_reviewed_by = db.Column(db.String(120), default="")
    approved_by = db.Column(db.String(120), default="")
    published_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    publish_at = db.Column(db.DateTime, nullable=True)
    unpublish_at = db.Column(db.DateTime, nullable=True)
    is_published = db.Column(db.Boolean, default=True)
    trashed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        d = Serializable.to_dict(self)
        d["title_en"] = self.title
        d["summary_en"] = self.summary
        d["body_en"] = self.body
        return d


class Activity(db.Model, Serializable):
    __tablename__ = "activities"
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(180), default="", index=True)
    title = db.Column(db.String(255), nullable=False)
    title_ta = db.Column(db.String(255), default="")
    description = db.Column(db.Text, default="")
    description_ta = db.Column(db.Text, default="")
    event_date = db.Column(db.Date, nullable=False, index=True)
    end_date = db.Column(db.Date, nullable=True)
    location = db.Column(db.String(190), default="")
    location_ta = db.Column(db.String(190), default="")
    district_tag = db.Column(db.String(120), default="", index=True)
    category = db.Column(db.String(80), default="Court interventions", index=True)
    # Mandatory actor tag: wing, party, stalin, tn_govt_pre_2026, counsel
    actor = db.Column(db.String(30), nullable=False, default="wing", index=True)
    court_name = db.Column(db.String(160), default="")
    bench = db.Column(db.String(160), default="")
    case_stage = db.Column(db.String(160), default="")
    case_number = db.Column(db.String(120), default="")
    sub_judice = db.Column(db.Boolean, default=False)
    court_order_summary = db.Column(db.Text, default="")
    party_allegations = db.Column(db.Text, default="")
    participants = db.Column(db.String(255), default="")
    press_links = db.Column(db.Text, default="")  # JSON list of {outlet, date, url}
    attachment_url = db.Column(db.String(255), default="")
    tags = db.Column(db.String(255), default="")
    cover_image = db.Column(db.String(255), default="")
    source_note = db.Column(db.String(255), default="")
    status = db.Column(db.String(30), default="published", index=True)
    legal_reviewed = db.Column(db.Boolean, default=False)
    legal_reviewed_by = db.Column(db.String(120), default="")
    publish_at = db.Column(db.DateTime, nullable=True)
    unpublish_at = db.Column(db.DateTime, nullable=True)
    is_published = db.Column(db.Boolean, default=True)
    trashed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        d = Serializable.to_dict(self)
        d["title_en"] = self.title
        d["description_en"] = self.description
        d["location_en"] = self.location
        try:
            d["press_links_parsed"] = json.loads(self.press_links) if self.press_links else []
        except Exception:
            d["press_links_parsed"] = []
        return d


class LegalResource(db.Model, Serializable):
    __tablename__ = "legal_resources"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    title_ta = db.Column(db.String(255), default="")
    description = db.Column(db.Text, default="")
    description_ta = db.Column(db.Text, default="")
    category = db.Column(db.String(80), default="Constitution & Statutes", index=True)
    resource_type = db.Column(db.String(60), default="Official Link")
    court_or_forum = db.Column(db.String(160), default="")
    citation = db.Column(db.String(160), default="")
    decision_date = db.Column(db.String(40), default="")
    bench = db.Column(db.String(255), default="")
    later_developments = db.Column(db.Text, default="")
    later_developments_ta = db.Column(db.Text, default="")
    # ta, en, both, en_with_ta_summary
    language_badge = db.Column(db.String(30), default="en")
    file_url = db.Column(db.String(500), default="")
    external_url = db.Column(db.String(500), default="")
    source_verified = db.Column(db.Boolean, default=True)
    last_reviewed = db.Column(db.String(40), default="")
    review_owner = db.Column(db.String(120), default="")
    status = db.Column(db.String(30), default="published", index=True)
    trashed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        d = Serializable.to_dict(self)
        d["title_en"] = self.title
        d["description_en"] = self.description
        d["later_developments_en"] = self.later_developments
        return d


class GalleryAlbum(db.Model, Serializable):
    __tablename__ = "gallery_albums"
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(180), default="")
    title = db.Column(db.String(255), nullable=False)
    title_ta = db.Column(db.String(255), default="")
    category = db.Column(db.String(80), default="Wing conferences")
    event_date = db.Column(db.Date, nullable=True)
    place = db.Column(db.String(160), default="")
    district_tag = db.Column(db.String(120), default="")
    cover_image = db.Column(db.String(255), default="")
    # draft, published, embargo, trashed
    status = db.Column(db.String(30), default="published", index=True)
    trashed_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    images = db.relationship(
        "GalleryImage", backref="album", cascade="all, delete-orphan",
        order_by="GalleryImage.sort_order, GalleryImage.id",
    )

    def to_dict(self):
        data = Serializable.to_dict(self)
        data["title_en"] = self.title
        active_images = [i for i in self.images if i.takedown_status == "none"]
        data["image_count"] = len(active_images)
        if not data["cover_image"] and active_images:
            data["cover_image"] = active_images[0].image_url
        return data


class GalleryImage(db.Model, Serializable):
    __tablename__ = "gallery_images"
    id = db.Column(db.Integer, primary_key=True)
    album_id = db.Column(db.Integer, db.ForeignKey("gallery_albums.id"), nullable=False, index=True)
    media_type = db.Column(db.String(20), default="image")  # image, video_youtube
    image_url = db.Column(db.String(500), nullable=False)
    video_url = db.Column(db.String(500), default="")
    caption = db.Column(db.String(255), default="")
    caption_ta = db.Column(db.String(255), default="")
    alt_text = db.Column(db.String(255), default="")
    alt_text_ta = db.Column(db.String(255), default="")
    date_taken = db.Column(db.String(40), default="")
    place = db.Column(db.String(160), default="")
    district_tag = db.Column(db.String(120), default="")
    event_type = db.Column(db.String(80), default="")
    credit_line = db.Column(db.String(190), default="")
    # own, agency, supplied
    licence_type = db.Column(db.String(30), default="own")
    people_consent = db.Column(db.Boolean, default=False)
    minors_present = db.Column(db.Boolean, default=False)
    courtroom_check_passed = db.Column(db.Boolean, default=False)
    watermark_flag = db.Column(db.Boolean, default=False)
    # none, hidden, removed
    takedown_status = db.Column(db.String(20), default="none")
    rights_expiry = db.Column(db.String(40), default="")
    sort_order = db.Column(db.Integer, default=0)


class ContactMessage(db.Model, Serializable):
    __tablename__ = "contact_messages"
    id = db.Column(db.Integer, primary_key=True)
    # general, cadre_helpdesk, dpdp_erasure, takedown, correction
    inquiry_type = db.Column(db.String(30), default="general")
    district = db.Column(db.String(120), default="")
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(190), default="")
    phone = db.Column(db.String(40), default="")
    message = db.Column(db.Text, nullable=False)
    dpdp_consent = db.Column(db.Boolean, default=False)
    is_adult_or_guardian = db.Column(db.Boolean, default=True)
    purpose_acknowledged = db.Column(db.String(190), default="")
    status = db.Column(db.String(30), default="new")  # new, in_progress, resolved, erased
    retention_until = db.Column(db.Date, nullable=True)
    erased_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)


class Page(db.Model, Serializable):
    """Editable text blocks: home, about, ideology, organisation."""
    __tablename__ = "pages"
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(40), unique=True, nullable=False)
    title_en = db.Column(db.String(190), default="")
    title_ta = db.Column(db.String(190), default="")
    body_en = db.Column(db.Text, default="")
    body_ta = db.Column(db.Text, default="")
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DatedCounter(db.Model, Serializable):
    """Editable key figures with mandatory 'as of' date and source attribution (no win rates/case counts)."""
    __tablename__ = "dated_counters"
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(60), unique=True, nullable=False)
    label_en = db.Column(db.String(160), nullable=False)
    label_ta = db.Column(db.String(160), nullable=False)
    value_text = db.Column(db.String(80), nullable=False)
    as_of_date = db.Column(db.String(60), nullable=False)
    source_note = db.Column(db.String(255), default="")
    status = db.Column(db.String(30), default="published")
    sort_order = db.Column(db.Integer, default=0)


class SiteSetting(db.Model, Serializable):
    """Global settings including Election Mode, official contacts, and DPDP grievance officer."""
    __tablename__ = "site_settings"
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(80), unique=True, nullable=False)
    value = db.Column(db.Text, default="")
    description = db.Column(db.String(255), default="")
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ChecklistItem(db.Model, Serializable):
    """Tracks the 25-item pre-launch client confirmation checklist from the research brief."""
    __tablename__ = "checklist_items"
    id = db.Column(db.Integer, primary_key=True)
    item_no = db.Column(db.Integer, unique=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    why = db.Column(db.String(255), default="")
    status = db.Column(db.String(30), default="pending")  # pending, in_progress, confirmed, omitted
    client_response = db.Column(db.Text, default="")
    updated_by = db.Column(db.String(120), default="")
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
