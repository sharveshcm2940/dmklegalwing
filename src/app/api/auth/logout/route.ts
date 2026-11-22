import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, getSession } from '@/lib/auth';
import { addAuditLog } from '@/lib/serverDb';

export async function POST(request: Request) {
  try {
    const session = getSession(request);
    if (session) {
      try {
        await addAuditLog({
          who: session.user,
          role: session.role,
          what: `Admin session terminated (logged out)`,
          when: new Date().toISOString()
        });
      } catch {}
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
