import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Any authenticated admin role can view the audit logs
    const auth = await requireRole(request, ['super_admin', 'editorial', 'legal_desk']);
    if (!auth.authorized) {
      return auth.response;
    }

    const logs = await getAuditLogs();
    return NextResponse.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
