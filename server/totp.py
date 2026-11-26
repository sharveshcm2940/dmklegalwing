"""Pure-Python RFC 6238 TOTP (HMAC-SHA1) helper for admin two-factor authentication."""
import base64
import hashlib
import hmac
import secrets
import struct
import time
from urllib.parse import quote


def generate_secret(num_bytes: int = 20) -> str:
    """Return a Base32-encoded TOTP shared secret."""
    return base64.b32encode(secrets.token_bytes(num_bytes)).decode("ascii").rstrip("=")


def _normalize_secret(secret: str) -> bytes:
    cleaned = "".join((secret or "").strip().upper().split())
    pad = (-len(cleaned)) % 8
    return base64.b32decode(cleaned + ("=" * pad), casefold=True)


def totp_code(secret: str, for_time: int | None = None, interval: int = 30, digits: int = 6) -> str:
    """Compute a 6-digit TOTP token for the given Unix timestamp."""
    ts = int(time.time() if for_time is None else for_time)
    counter = ts // interval
    key = _normalize_secret(secret)
    msg = struct.pack(">Q", counter)
    digest = hmac.new(key, msg, hashlib.sha1).digest()
    offset = digest[-1] & 0x0F
    code_int = struct.unpack(">I", digest[offset:offset + 4])[0] & 0x7FFFFFFF
    return str(code_int % (10 ** digits)).zfill(digits)


def verify_totp(secret: str, token: str, window: int = 1, for_time: int | None = None) -> bool:
    """Verify a user-supplied TOTP code allowing +/- `window` 30-second steps."""
    if not secret or not token:
        return False
    cleaned = "".join(c for c in str(token) if c.isdigit())
    if len(cleaned) != 6:
        return False
    ts = int(time.time() if for_time is None else for_time)
    try:
        for step in range(-window, window + 1):
            expected = totp_code(secret, for_time=ts + (step * 30))
            if hmac.compare_digest(expected, cleaned):
                return True
    except Exception:
        return False
    return False


def provisioning_uri(secret: str, email: str, issuer: str = "DMK Legal Wing CMS") -> str:
    """Build a standard otpauth:// URI for authenticator apps."""
    label = quote(f"{issuer}:{email}")
    iss = quote(issuer)
    return f"otpauth://totp/{label}?secret={secret}&issuer={iss}&algorithm=SHA1&digits=6&period=30"
