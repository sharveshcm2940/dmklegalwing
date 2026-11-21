import { NextResponse } from 'next/server';
import { deleteEvent } from '@/lib/serverDb';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ok = await deleteEvent(id);
    if (!ok) return NextResponse.json({ success: false, error: 'Event not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
