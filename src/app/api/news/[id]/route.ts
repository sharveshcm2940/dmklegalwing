import { NextResponse } from 'next/server';
import { setLeadStory, deleteNews } from '@/lib/serverDb';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    if (body.action === 'setLeadStory') {
      const ok = await setLeadStory(id);
      if (!ok) return NextResponse.json({ success: false, error: 'News item not found.' }, { status: 404 });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Unsupported action.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ok = await deleteNews(id);
    if (!ok) return NextResponse.json({ success: false, error: 'News item not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
