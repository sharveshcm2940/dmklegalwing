import { NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getEvents();
    return NextResponse.json({ success: true, count: list.length, events: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(request, ['editorial'], 'Added new court docket / legal event');
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    const newRecord = await createEvent(body);
    return NextResponse.json({ success: true, event: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
