import { NextResponse } from 'next/server';
import { deleteResource } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(request, ['super_admin']);
    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;
    const ok = await deleteResource(id);
    if (!ok) return NextResponse.json({ success: false, error: 'Resource not found.' }, { status: 404 });

    await requireRole(request, ['super_admin'], `Deleted legal resource dossier: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
