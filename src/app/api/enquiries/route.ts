import { NextResponse } from 'next/server';
import { getEnquiries, createEnquiry } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Requires Legal Desk or Super Admin to view confidential citizen legal grievances
    const auth = await requireRole(request, ['legal_desk']);
    if (!auth.authorized) {
      return auth.response;
    }

    const list = await getEnquiries();
    return NextResponse.json({ success: true, count: list.length, enquiries: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // PUBLIC INGESTION ENDPOINT: Citizens file pro-bono aid / custody grievances via /citizen-desk
    const body = await request.json();
    const { name, phone, email, district, subject, message, category } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, and inquiry message are required.' },
        { status: 400 }
      );
    }

    const newRecord = await createEnquiry({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : '',
      district: district ? String(district).trim() : 'Chennai',
      subject: subject ? String(subject).trim() : 'Legal Query',
      message: String(message).trim(),
      category: category || 'Legal Aid'
    });

    return NextResponse.json({ success: true, enquiry: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
