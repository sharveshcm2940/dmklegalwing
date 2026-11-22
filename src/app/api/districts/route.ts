import { NextResponse } from 'next/server';
import { getDistricts, updateDistrict } from '@/lib/serverDb';

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
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'District id is required' }, { status: 400 });
    }
    const updated = await updateDistrict(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'District not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, district: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

