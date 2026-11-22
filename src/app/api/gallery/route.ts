import { NextResponse } from 'next/server';
import { getGallery, createGalleryItem } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function GET() {
  try {
    const list = await getGallery();
    return NextResponse.json({ success: true, count: list.length, gallery: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(request, ['editorial'], 'Added new press gallery photo');
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    const newRecord = await createGalleryItem(body);
    return NextResponse.json({ success: true, galleryItem: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
