import { NextResponse } from 'next/server';
import { setLeadStory, deleteNews, updateNews } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(request, ['editorial']);
    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;
    const body = await request.json();

    if (body.action === 'setLeadStory') {
      const ok = await setLeadStory(id);
      if (!ok) return NextResponse.json({ success: false, error: 'News item not found.' }, { status: 404 });
      
      await requireRole(request, ['editorial'], `Promoted news story to Lead Story: ${id}`);
      return NextResponse.json({ success: true });
    }

    // Direct update of news story fields (status, title, crop, etc.)
    const updated = await updateNews(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'News item not found.' }, { status: 404 });
    }

    await requireRole(request, ['editorial'], `Updated news story fields: ${id}`);
    return NextResponse.json({ success: true, news: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

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
    const ok = await deleteNews(id);
    if (!ok) return NextResponse.json({ success: false, error: 'News item not found.' }, { status: 404 });

    await requireRole(request, ['editorial'], `Deleted news story: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
