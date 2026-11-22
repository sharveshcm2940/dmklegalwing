import { NextResponse } from 'next/server';
import { deleteGalleryItem } from '@/lib/serverDb';
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
    const ok = await deleteGalleryItem(id);
    if (!ok) return NextResponse.json({ success: false, error: 'Gallery item not found.' }, { status: 404 });

    await requireRole(request, ['editorial'], `Deleted press gallery photo: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
