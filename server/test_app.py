"""Comprehensive API, compliance, RBAC, DPDP, TOTP, and verification tests for DMK Legal Wing."""
import os
import tempfile
import unittest
from datetime import date, datetime

# Configure isolated temp SQLite DB before importing app
_TMP_DIR = tempfile.mkdtemp(prefix="lw_test_")
os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(_TMP_DIR, "test.sqlite3").replace("\\", "/")
os.environ["UPLOAD_DIR"] = os.path.join(_TMP_DIR, "uploads")
os.environ["SECRET_KEY"] = "test-secret"
os.environ["JWT_SECRET_KEY"] = "test-jwt-secret"

import sys
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app
from extensions import db
from models import (
    Activity, Admin, AuditLog, ChecklistItem, ContactMessage, DatedCounter,
    District, GalleryAlbum, GalleryImage, LegalResource, News, OfficeBearer,
    Page, RevenueDistrict, SiteSetting,
)
from seed_data import (
    ACTIVITIES, BEARERS_UNCONFIRMED, DATED_COUNTERS, LEGACY_DISTRICTS_UNCONFIRMED,
    LEGAL_RESOURCES, NEWS_ITEMS, PAGES, PRELAUNCH_CHECKLIST, REVENUE_DISTRICTS,
    SITE_SETTINGS, VERIFIED_HELPLINE_HUBS,
)
from totp import totp_code


class LegalWingTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()
        with self.app.app_context():
            db.drop_all()
            db.create_all()
            self._seed()

    def _seed(self):
        super_admin = Admin(name="Super", email="super@test.org", role="super_admin", is_active=True)
        super_admin.set_password("SuperSecret123")
        editor = Admin(name="Editor", email="editor@test.org", role="editor", is_active=True)
        editor.set_password("EditorSecret123")
        dist_ed = Admin(name="DistEd", email="madurai@test.org", role="district_editor", district_scope="Madurai", is_active=True)
        dist_ed.set_password("DistSecret123")
        db.session.add_all([super_admin, editor, dist_ed])

        for i, (en, ta, seat, region) in enumerate(REVENUE_DISTRICTS, start=1):
            db.session.add(RevenueDistrict(name_en=en, name_ta=ta, high_court_seat=seat, region=region, sort_order=i))
        db.session.flush()
        rev_map = {r.name_en: r.id for r in RevenueDistrict.query.all()}

        order = 1
        for name_en, name_ta, rev_name, seat, note_en, _ in VERIFIED_HELPLINE_HUBS:
            db.session.add(District(name=name_en, name_ta=name_ta, revenue_district_id=rev_map.get(rev_name),
                                    revenue_district_name=rev_name, high_court_seat=seat, source_note=note_en,
                                    status="published", sort_order=order))
            order += 1
        for name_en, name_ta, rev_name, seat, org, phone in LEGACY_DISTRICTS_UNCONFIRMED:
            db.session.add(District(name=name_en, name_ta=name_ta, revenue_district_id=rev_map.get(rev_name),
                                    revenue_district_name=rev_name, high_court_seat=seat, organiser=org,
                                    phone=phone, status="pending_confirmation", sort_order=order))
            order += 1

        for i, (grp, tier, ne, nt, re_, rt, pe, pt, note) in enumerate(BEARERS_UNCONFIRMED, start=1):
            db.session.add(OfficeBearer(group_key=grp, tier=tier, name_en=ne, name_ta=nt, role_en=re_, role_ta=rt,
                                        place_en=pe, place_ta=pt, source_note=note, consent_obtained=False,
                                        status="pending_confirmation", sort_order=i))

        for item in ACTIVITIES:
            db.session.add(Activity(
                title=item["title"], title_ta=item["title_ta"], description=item["description"],
                description_ta=item["description_ta"], event_date=date.fromisoformat(item["event_date"]),
                location=item.get("location", ""), location_ta=item.get("location_ta", ""),
                district_tag=item.get("district_tag", ""), category=item["category"], actor=item["actor"],
                sub_judice=bool(item.get("sub_judice", False)), legal_reviewed=bool(item.get("legal_reviewed", False)),
                status="published", is_published=True,
            ))

        for n in NEWS_ITEMS:
            db.session.add(News(
                title=n["title"], title_ta=n["title_ta"], summary=n["summary"], summary_ta=n["summary_ta"],
                body=n["body"], body_ta=n["body_ta"], source_type=n["source_type"], outlet_name=n["outlet_name"],
                actor=n["actor"], published_at=datetime.fromisoformat(n["published_at"]),
                legal_reviewed=True, status="published", is_published=True,
            ))

        for r in LEGAL_RESOURCES:
            db.session.add(LegalResource(
                title=r["title"], title_ta=r["title_ta"], description=r["description"],
                description_ta=r["description_ta"], category=r["category"],
                language_badge=r.get("language_badge", "en"), status="published",
            ))

        for key, len_, lta, val, as_of, src, ord_ in DATED_COUNTERS:
            db.session.add(DatedCounter(key=key, label_en=len_, label_ta=lta, value_text=val,
                                        as_of_date=as_of, source_note=src, status="published", sort_order=ord_))

        for key, (te, tt, be, bt) in PAGES.items():
            db.session.add(Page(key=key, title_en=te, title_ta=tt, body_en=be, body_ta=bt))

        for key, (val, desc) in SITE_SETTINGS.items():
            db.session.add(SiteSetting(key=key, value=val, description=desc))

        for no, title, why in PRELAUNCH_CHECKLIST:
            db.session.add(ChecklistItem(item_no=no, title=title, why=why, status="pending"))

        db.session.commit()

    def _login(self, email, password, totp=None):
        payload = {"email": email, "password": password}
        if totp:
            payload["totp_code"] = totp
        return self.client.post("/api/admin/login", json=payload)

    def _csrf_headers(self):
        c = self.client.get_cookie("csrf_access_token")
        return {"X-CSRF-TOKEN": c.value} if c else {}

    def test_public_verified_only_and_unconfirmed_held(self):
        # Bearers with pending_confirmation or no consent must NOT appear publicly
        r = self.client.get("/api/bearers")
        self.assertEqual(r.status_code, 200)
        data = r.get_json()
        self.assertEqual(data["items"], [])
        self.assertEqual(data["pending_confirmation_count"], len(BEARERS_UNCONFIRMED))

        # Districts: 38 revenue districts, 12 verified hubs public, 29 legacy held
        r = self.client.get("/api/districts")
        self.assertEqual(r.status_code, 200)
        d = r.get_json()
        self.assertEqual(len(d["revenue_districts"]), 38)
        self.assertEqual(len(d["party_districts"]), len(VERIFIED_HELPLINE_HUBS))
        self.assertEqual(d["pending_confirmation_count"], len(LEGACY_DISTRICTS_UNCONFIRMED))

        # Activities actor filter
        r = self.client.get("/api/activities?actor=stalin")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.get_json()["items"]), 1)
        self.assertIn("WP 34892", r.get_json()["items"][0]["title"])

    def test_dpdp_contact_consent_and_erasure(self):
        # Missing DPDP consent must fail
        r = self.client.post("/api/contact", json={
            "name": "Ravi",
            "message": "Need help with district inquiry.",
            "dpdp_consent": False,
        })
        self.assertEqual(r.status_code, 400)

        # Valid submission with consent succeeds
        r = self.client.post("/api/contact", json={
            "inquiry_type": "cadre_helpdesk",
            "district": "Chennai",
            "name": "Ravi K",
            "phone": "9840000001",
            "message": "Requesting cadre helpdesk routing for Chennai.",
            "dpdp_consent": True,
            "is_adult_or_guardian": True,
        })
        self.assertEqual(r.status_code, 201)
        ref_id = r.get_json()["reference_id"]

        # Super admin erases PII under DPDP
        self._login("super@test.org", "SuperSecret123")
        headers = self._csrf_headers()
        r = self.client.post(f"/api/admin/messages/{ref_id}/erase", headers=headers)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()["item"]["name"], "[ERASED UNDER DPDP]")
        self.assertEqual(r.get_json()["item"]["status"], "erased")

    def test_rbac_workflow_and_legal_review_gate(self):
        # Editor cannot publish directly — coerced to in_review
        self._login("editor@test.org", "EditorSecret123")
        headers = self._csrf_headers()
        r = self.client.post("/api/admin/news", headers=headers, json={
            "title": "Draft news",
            "body": "Body text here.",
            "actor": "wing",
            "status": "published",
        })
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.get_json()["item"]["status"], "in_review")

        # District editor scoped to Madurai cannot create Chennai activity
        self._login("madurai@test.org", "DistSecret123")
        headers = self._csrf_headers()
        r = self.client.post("/api/admin/activities", headers=headers, json={
            "title": "Chennai event",
            "event_date": "2026-11-26",
            "actor": "wing",
            "district_tag": "Chennai",
        })
        self.assertEqual(r.status_code, 400)

        # Super admin publishing sub_judice activity without legal_reviewed is blocked
        self._login("super@test.org", "SuperSecret123")
        headers = self._csrf_headers()
        r = self.client.post("/api/admin/activities", headers=headers, json={
            "title": "Pending court matter",
            "event_date": "2026-11-26",
            "actor": "party",
            "sub_judice": True,
            "legal_reviewed": False,
            "status": "published",
        })
        self.assertEqual(r.status_code, 400)

        # With legal_reviewed=True it publishes, and soft-delete -> restore -> withdrawn works
        r = self.client.post("/api/admin/activities", headers=headers, json={
            "title": "Reviewed court matter",
            "event_date": "2026-11-26",
            "actor": "party",
            "sub_judice": True,
            "legal_reviewed": True,
            "status": "published",
        })
        self.assertEqual(r.status_code, 201)
        act_id = r.get_json()["item"]["id"]

        # Trash and restore
        r = self.client.delete(f"/api/admin/activities/{act_id}", headers=headers)
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.get_json()["trashed"])
        r = self.client.post(f"/api/admin/activities/{act_id}/restore", headers=headers)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()["item"]["status"], "draft")

        # Withdrawn news returns neutral withdrawn response instead of 404
        r = self.client.put("/api/admin/news/1", headers=headers, json={"status": "withdrawn"})
        self.assertEqual(r.status_code, 200)
        r = self.client.get("/api/news/1")
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.get_json()["withdrawn"])

    def test_totp_2fa_and_gallery_compliance(self):
        self._login("super@test.org", "SuperSecret123")
        headers = self._csrf_headers()

        # Enable 2FA
        r = self.client.post("/api/admin/2fa/setup", headers=headers)
        self.assertEqual(r.status_code, 200)
        secret = r.get_json()["secret"]
        code = totp_code(secret)
        r = self.client.post("/api/admin/2fa/enable", headers=headers, json={"code": code})
        self.assertEqual(r.status_code, 200)

        # Logout and verify login requires TOTP challenge
        self.client.post("/api/admin/logout", headers=headers)
        r = self._login("super@test.org", "SuperSecret123")
        self.assertEqual(r.status_code, 202)
        self.assertTrue(r.get_json()["requires_totp"])

        # Pending challenge token cannot access /admin/stats
        r = self.client.get("/api/admin/stats")
        self.assertEqual(r.status_code, 401)

        # Complete TOTP verification
        r = self.client.post("/api/admin/login/totp", headers=self._csrf_headers(), json={"totp_code": totp_code(secret)})
        self.assertEqual(r.status_code, 200)
        r = self.client.get("/api/admin/stats")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()["checklist_total"], 25)

        # Gallery courtroom check gate
        headers = self._csrf_headers()
        alb = self.client.post("/api/admin/albums", headers=headers, json={"title": "Conference", "status": "published"}).get_json()["item"]
        # Image without courtroom_check_passed is hidden from public album
        img = self.client.post("/api/admin/images", headers=headers, json={
            "album_id": alb["id"], "image_url": "/uploads/test.jpg", "credit_line": "Wing", "licence_type": "own", "courtroom_check_passed": False,
        }).get_json()["item"]
        pub_alb = self.client.get(f"/api/albums/{alb['id']}").get_json()
        self.assertEqual(len(pub_alb["images"]), 0)

        # Pass courtroom check -> visible; instant takedown -> hidden
        self.client.put(f"/api/admin/images/{img['id']}", headers=headers, json={"courtroom_check_passed": True})
        pub_alb = self.client.get(f"/api/albums/{alb['id']}").get_json()
        self.assertEqual(len(pub_alb["images"]), 1)

        self.client.post(f"/api/admin/images/{img['id']}/takedown", headers=headers, json={"takedown_status": "hidden"})
        pub_alb = self.client.get(f"/api/albums/{alb['id']}").get_json()
        self.assertEqual(len(pub_alb["images"]), 0)

        # Audit logs recorded
        logs = self.client.get("/api/admin/audit").get_json()["items"]
        self.assertGreater(len(logs), 5)


if __name__ == "__main__":
    unittest.main()
