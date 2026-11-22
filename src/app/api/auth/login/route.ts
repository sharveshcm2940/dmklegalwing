import { NextResponse } from 'next/server';
import { createSessionToken, AdminRole, SESSION_COOKIE_NAME } from '@/lib/auth';
import { addAuditLog } from '@/lib/serverDb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, role, username } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required.' },
        { status: 400 }
      );
    }

    let determinedRole: AdminRole | null = null;
    const pwd = String(password).trim();

    // Direct password mapping
    if (pwd === 'superadmin') {
      determinedRole = 'super_admin';
    } else if (pwd === 'editorial1971' || pwd === 'editorial') {
      determinedRole = 'editorial';
    } else if (pwd === 'legal1971' || pwd === 'legaldesk') {
      determinedRole = 'legal_desk';
    } else if (pwd === 'dmk1971' || pwd === 'admin') {
      // Master secretariat password: role can be specified or defaults to super_admin
      if (role && ['super_admin', 'editorial', 'legal_desk'].includes(role)) {
        determinedRole = role as AdminRole;
      } else {
        determinedRole = 'super_admin';
      }
    }

    if (!determinedRole) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication credentials.' },
        { status: 401 }
      );
    }

    const userName = username ? String(username).trim() : `${determinedRole}-officer`;
    const token = createSessionToken(userName, determinedRole);

    // Audit log
    try {
      await addAuditLog({
        who: userName,
        role: determinedRole,
        what: `Admin session authenticated as ${determinedRole.replace('_', ' ')}`,
        when: new Date().toISOString()
      });
    } catch {}

    const response = NextResponse.json({
      success: true,
      user: userName,
      role: determinedRole,
      token
    });

    // Set HTTP-only session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
