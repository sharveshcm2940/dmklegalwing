import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { addAuditLog } from './serverDb';

export type AdminRole = 'super_admin' | 'editorial' | 'legal_desk';

export interface AuthSession {
  user: string;
  role: AdminRole;
  issuedAt: number;
  expiresAt: number;
}

const AUTH_SECRET = process.env.AUTH_SECRET || 'dmk-legal-wing-apex-secret-key-1971';
const SESSION_COOKIE_NAME = 'dmk_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Create a signed session token
export function createSessionToken(user: string, role: AdminRole): string {
  const session: AuthSession = {
    user,
    role,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS
  };
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

// Verify a signed session token
export function verifySessionToken(token: string): AuthSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const session: AuthSession = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (Date.now() > session.expiresAt) {
      return null; // Expired
    }
    return session;
  } catch {
    return null;
  }
}

// Extract session from cookies or Authorization header
export function getSession(request: Request): AuthSession | null {
  // 1. Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim();
    const session = verifySessionToken(token);
    if (session) return session;
  }

  // 2. Check Cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader
      .split(';')
      .map((c) => c.trim().split('='))
      .filter(([k]) => Boolean(k))
      .map(([k, ...v]) => [k, decodeURIComponent(v.join('='))])
  );

  const sessionCookie = cookies[SESSION_COOKIE_NAME];
  if (sessionCookie) {
    const session = verifySessionToken(sessionCookie);
    if (session) return session;
  }

  return null;
}

// Enforce role authorization
export async function requireRole(
  request: Request,
  allowedRoles: AdminRole[],
  actionDescription?: string
): Promise<
  | { authorized: true; session: AuthSession }
  | { authorized: false; response: NextResponse }
> {
  const session = getSession(request);

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in.' },
        { status: 401 }
      )
    };
  }

  // Super Admin can do everything
  const isSuperAdmin = session.role === 'super_admin';
  const hasAllowedRole = allowedRoles.includes(session.role);

  if (!isSuperAdmin && !hasAllowedRole) {
    return {
      authorized: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: `Forbidden: Insufficient privileges for role '${session.role}'. Required: ${allowedRoles.join(', ')}.` 
        },
        { status: 403 }
      )
    };
  }

  // Log activity if action description provided
  if (actionDescription) {
    try {
      await addAuditLog({
        who: session.user,
        role: session.role,
        what: actionDescription,
        when: new Date().toISOString()
      });
    } catch (logErr) {
      console.error('Audit log failed:', logErr);
    }
  }

  return { authorized: true, session };
}

export { SESSION_COOKIE_NAME };
