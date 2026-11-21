import { NextResponse } from 'next/server';
import { getGallery, createGalleryItem } from '@/lib/serverDb';

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
    const body = await request.json();
    const newRecord = await createGalleryItem(body);
    return NextResponse.json({ success: true, galleryItem: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
