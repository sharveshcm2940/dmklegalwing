import { NextResponse } from 'next/server';
import { getDistricts, updateDistrict } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getDistricts();
    return NextResponse.json({ success: true, count: list.length, districts: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Only Super Admin can modify district units and phone privacy
    const auth = await requireRole(request, ['super_admin']);
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'District id is required' }, { status: 400 });
    }
    const updated = await updateDistrict(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'District not found' }, { status: 404 });
    }

    await requireRole(request, ['super_admin'], `Updated district record: ${id} (${Object.keys(updates).join(', ')})`);
    return NextResponse.json({ success: true, district: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
