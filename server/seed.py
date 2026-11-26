"""Creates tables and loads verified starting data. Safe to re-run: fills empty tables only.

    python seed.py
"""
from datetime import date, datetime
import os
import secrets

from app import create_app
from extensions import db
from models import (
    Activity, Admin, ChecklistItem, DatedCounter, District,
    LegalResource, News, OfficeBearer, Page, RevenueDistrict, SiteSetting,
)
from seed_data import (
    ACTIVITIES, BEARERS_UNCONFIRMED, DATED_COUNTERS, LEGACY_DISTRICTS_UNCONFIRMED,
    LEGAL_RESOURCES, NEWS_ITEMS, PAGES, PRELAUNCH_CHECKLIST, REVENUE_DISTRICTS,
    SITE_SETTINGS, VERIFIED_HELPLINE_HUBS,
)

app = create_app()

with app.app_context():
    db.create_all()

    if not Admin.query.first():
        email = os.getenv("ADMIN_EMAIL", "admin@dmklegalwing.example").strip().lower()
        password = os.getenv("ADMIN_PASSWORD", "").strip()
        generated = not password
        if generated:
            password = secrets.token_urlsafe(14)
        admin = Admin(
            name=os.getenv("ADMIN_NAME", "Wing Super Admin"),
            email=email,
            role="super_admin",
            is_active=True,
        )
        admin.set_password(password)
        db.session.add(admin)
        print(f"Admin created: {email} (role=super_admin)")
        if generated:
            print(f"Temporary password (shown once, change after login): {password}")

    if not RevenueDistrict.query.first():
        for i, (en, ta, seat, region) in enumerate(REVENUE_DISTRICTS, start=1):
            db.session.add(RevenueDistrict(
                name_en=en, name_ta=ta, high_court_seat=seat, region=region, sort_order=i,
            ))
        db.session.flush()
        print(f"Revenue districts loaded: {len(REVENUE_DISTRICTS)}")

    rev_map = {r.name_en: r.id for r in RevenueDistrict.query.all()}

    if not District.query.first():
        order = 1
        # Verified May 2026 helpline hubs / Aug 2026 regional clusters (published, no unconfirmed personal numbers)
        for name_en, name_ta, rev_name, seat, note_en, note_ta in VERIFIED_HELPLINE_HUBS:
            db.session.add(District(
                name=name_en,
                name_ta=name_ta,
                revenue_district_id=rev_map.get(rev_name),
                revenue_district_name=rev_name,
                high_court_seat=seat,
                source_note=note_en,
                principal_court=f"Madras High Court ({seat})" if seat == "Chennai" else "Madurai Bench of Madras High Court",
                status="published",
                last_updated=date(2026, 8, 28),
                sort_order=order,
            ))
            order += 1

        # Legacy 2021/earlier entries held in pending_confirmation queue (never public until confirmed)
        for name_en, name_ta, rev_name, seat, org, phone in LEGACY_DISTRICTS_UNCONFIRMED:
            db.session.add(District(
                name=name_en,
                name_ta=name_ta,
                revenue_district_id=rev_map.get(rev_name),
                revenue_district_name=rev_name,
                high_court_seat=seat,
                organiser=org,
                phone=phone,
                source_note="Legacy 2021/pre-2026 list — awaiting 110-district restructuring confirmation (Checklist #6)",
                status="pending_confirmation",
                sort_order=order,
            ))
            order += 1
        print(f"Party districts loaded: {order - 1} ({len(VERIFIED_HELPLINE_HUBS)} published regional hubs, {len(LEGACY_DISTRICTS_UNCONFIRMED)} pending confirmation)")

    if not OfficeBearer.query.first():
        for i, (grp, tier, ne, nt, re_, rt, pe, pt, note) in enumerate(BEARERS_UNCONFIRMED, start=1):
            db.session.add(OfficeBearer(
                group_key=grp, tier=tier, name_en=ne, name_ta=nt, role_en=re_, role_ta=rt,
                place_en=pe, place_ta=pt, source_note=note, consent_obtained=False,
                status="pending_confirmation", sort_order=i,
            ))
        print(f"Office bearers queued (pending confirmation): {len(BEARERS_UNCONFIRMED)}")

    if not Activity.query.first():
        for item in ACTIVITIES:
            db.session.add(Activity(
                title=item["title"],
                title_ta=item["title_ta"],
                description=item["description"],
                description_ta=item["description_ta"],
                event_date=date.fromisoformat(item["event_date"]),
                end_date=date.fromisoformat(item["end_date"]) if item.get("end_date") else None,
                location=item.get("location", ""),
                location_ta=item.get("location_ta", ""),
                district_tag=item.get("district_tag", ""),
                category=item["category"],
                actor=item["actor"],
                court_name=item.get("court_name", ""),
                case_number=item.get("case_number", ""),
                case_stage=item.get("case_stage", ""),
                participants=item.get("participants", ""),
                court_order_summary=item.get("court_order_summary", ""),
                party_allegations=item.get("party_allegations", ""),
                sub_judice=bool(item.get("sub_judice", False)),
                source_note=item.get("source_note", ""),
                legal_reviewed=bool(item.get("legal_reviewed", False)),
                legal_reviewed_by=item.get("legal_reviewed_by", ""),
                status="published",
                is_published=True,
            ))
        print(f"Verified activities loaded: {len(ACTIVITIES)}")

    if not News.query.first():
        for n in NEWS_ITEMS:
            db.session.add(News(
                title=n["title"],
                title_ta=n["title_ta"],
                summary=n["summary"],
                summary_ta=n["summary_ta"],
                body=n["body"],
                body_ta=n["body_ta"],
                source_type=n["source_type"],
                outlet_name=n["outlet_name"],
                dateline=n["dateline"],
                actor=n["actor"],
                district_tag=n.get("district_tag", ""),
                pinned=bool(n.get("pinned", False)),
                published_at=datetime.fromisoformat(n["published_at"]),
                legal_reviewed=bool(n.get("legal_reviewed", False)),
                status="published",
                is_published=True,
            ))
        print(f"Verified news items loaded: {len(NEWS_ITEMS)}")

    if not LegalResource.query.first():
        for r in LEGAL_RESOURCES:
            db.session.add(LegalResource(
                title=r["title"],
                title_ta=r["title_ta"],
                description=r["description"],
                description_ta=r["description_ta"],
                category=r["category"],
                resource_type=r["resource_type"],
                court_or_forum=r.get("court_or_forum", ""),
                citation=r.get("citation", ""),
                decision_date=r.get("decision_date", ""),
                bench=r.get("bench", ""),
                later_developments=r.get("later_developments", ""),
                later_developments_ta=r.get("later_developments_ta", ""),
                language_badge=r.get("language_badge", "en"),
                external_url=r.get("external_url", ""),
                source_verified=bool(r.get("source_verified", True)),
                last_reviewed=r.get("last_reviewed", ""),
                review_owner=r.get("review_owner", ""),
                status="published",
            ))
        print(f"Legal resources loaded: {len(LEGAL_RESOURCES)}")

    if not DatedCounter.query.first():
        for key, len_, lta, val, as_of, src, order in DATED_COUNTERS:
            db.session.add(DatedCounter(
                key=key, label_en=len_, label_ta=lta, value_text=val,
                as_of_date=as_of, source_note=src, status="published", sort_order=order,
            ))
        print(f"Dated counters loaded: {len(DATED_COUNTERS)}")

    for key, (te, tt, be, bt) in PAGES.items():
        if not Page.query.filter_by(key=key).first():
            db.session.add(Page(key=key, title_en=te, title_ta=tt, body_en=be, body_ta=bt))

    for key, (val, desc) in SITE_SETTINGS.items():
        if not SiteSetting.query.filter_by(key=key).first():
            db.session.add(SiteSetting(key=key, value=val, description=desc))

    if not ChecklistItem.query.first():
        for no, title, why in PRELAUNCH_CHECKLIST:
            db.session.add(ChecklistItem(item_no=no, title=title, why=why, status="pending"))
        print(f"Pre-launch checklist loaded: {len(PRELAUNCH_CHECKLIST)} items")

    db.session.commit()
    print("Done.")
