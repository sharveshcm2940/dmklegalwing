import { NextResponse } from 'next/server';
import { deleteResource, updateResource } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(request, ['super_admin']);
    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;
    const body = await request.json();

    const updated = await updateResource(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Resource not found.' }, { status: 404 });
    }

    await requireRole(request, ['super_admin'], `Updated legal resource: ${id}`);
    return NextResponse.json({ success: true, resource: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

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
