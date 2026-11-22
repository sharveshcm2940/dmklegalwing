import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = getSession(request);
    if (!session) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: session.user,
      role: session.role
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
