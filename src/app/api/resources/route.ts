import { NextResponse } from 'next/server';
import { getResources, createResource } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getResources();
    return NextResponse.json({ success: true, count: list.length, resources: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(request, ['super_admin']);
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    const newRecord = await createResource(body);

    await requireRole(request, ['super_admin'], `Uploaded legal resource / compendium: "${body.title?.en || newRecord.id}"`);
    return NextResponse.json({ success: true, resource: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
