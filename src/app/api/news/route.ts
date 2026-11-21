import { NextResponse } from 'next/server';
import { getNews, createNews } from '@/lib/serverDb';

export async function GET() {
  try {
    const list = await getNews();
    return NextResponse.json({ success: true, count: list.length, news: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.title.en) {
      return NextResponse.json({ success: false, error: 'News headline is required.' }, { status: 400 });
    }
    const newRecord = await createNews(body);
    return NextResponse.json({ success: true, news: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
