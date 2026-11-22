import { NextResponse } from 'next/server';
import { getNews, createNews } from '@/lib/serverDb';
import { requireRole, getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const list = await getNews();
    const session = getSession(request);
    const { searchParams } = new URL(request.url);
    const isAdminQuery = searchParams.get('admin') === 'true';

    // If caller is an authenticated admin querying for admin console, return all stories
    if (session && isAdminQuery) {
      return NextResponse.json({ success: true, count: list.length, news: list });
    }

    // Public pages: Show ONLY Published stories whose date has arrived
    const now = new Date();
    const publicStories = list.filter((item) => {
      // If status is present, it must be Published
      if (item.status) {
        const s = item.status.toLowerCase();
        if (s !== 'published') return false;
      }

      // Check scheduled publish date & time
      if (item.publishDate) {
        const dateTimeStr = item.publishTime ? `${item.publishDate}T${item.publishTime}` : item.publishDate;
        const targetDate = new Date(dateTimeStr);
        if (!isNaN(targetDate.getTime()) && targetDate > now) {
          return false; // Scheduled in the future
        }
      } else if (item.date) {
        const targetDate = new Date(item.date);
        // Only filter out if future date
        if (!isNaN(targetDate.getTime()) && targetDate > now) {
          return false;
        }
      }

      return true;
    });

    return NextResponse.json({ success: true, count: publicStories.length, news: publicStories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Requires Editorial or Super Admin
    const auth = await requireRole(request, ['editorial']);
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    if (!body.title || !body.title.en) {
      return NextResponse.json({ success: false, error: 'News headline is required.' }, { status: 400 });
    }

    const newRecord = await createNews(body);

    // Audit log
    await requireRole(
      request, 
      ['editorial'], 
      `Created news story: "${body.title.en}" (${newRecord.status || 'Published'})`
    );

    return NextResponse.json({ success: true, news: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
