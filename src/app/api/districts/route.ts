import { NextResponse } from 'next/server';
import { getDistricts } from '@/lib/serverDb';

export async function GET() {
  try {
    const list = await getDistricts();
    return NextResponse.json({ success: true, count: list.length, districts: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
