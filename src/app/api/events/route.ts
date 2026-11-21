import { NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/serverDb';

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
    const body = await request.json();
    const newRecord = await createEvent(body);
    return NextResponse.json({ success: true, event: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
