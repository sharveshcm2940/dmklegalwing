import { NextResponse } from 'next/server';
import { deleteEvent } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(request, ['editorial']);
    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;
    const ok = await deleteEvent(id);
    if (!ok) return NextResponse.json({ success: false, error: 'Event not found.' }, { status: 404 });

    await requireRole(request, ['editorial'], `Deleted event/hearing: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
