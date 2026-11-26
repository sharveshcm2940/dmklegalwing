"""Immutable audit logging and role/workflow enforcement helpers."""
import json
from flask import request

from extensions import db
from models import AuditLog


ROLE_RANK = {
    "district_editor": 1,
    "editor": 2,
    "publisher": 3,
    "super_admin": 4,
}


def client_ip() -> str:
    fwd = request.headers.get("X-Forwarded-For", "")
    if fwd:
        return fwd.split(",")[0].strip()[:64]
    return (request.remote_addr or "")[:64]


def log_audit(actor, action: str, resource: str, resource_id=None, before=None, after=None):
    """Append an immutable audit entry to the current transaction."""
    entry = AuditLog(
        actor_id=getattr(actor, "id", None),
        actor_email=getattr(actor, "email", "") or "system",
        actor_role=getattr(actor, "role", "") or "",
        action=action[:40],
        resource=resource[:60],
        resource_id=str(resource_id)[:64] if resource_id is not None else "",
        ip_address=client_ip(),
        before_json=json.dumps(before, ensure_ascii=False, default=str) if before is not None else "",
        after_json=json.dumps(after, ensure_ascii=False, default=str) if after is not None else "",
    )
    db.session.add(entry)


def has_role(admin, minimum_role: str) -> bool:
    if not admin or not admin.is_active:
        return False
    return ROLE_RANK.get(admin.role, 0) >= ROLE_RANK.get(minimum_role, 99)
