import { NextResponse } from 'next/server';
import { updateEnquiryStatus, deleteEnquiry } from '@/lib/serverDb';
import { PublicEnquiry } from '@/types';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body as { status: PublicEnquiry['status'] };

    if (!status || !['new', 'reviewed', 'resolved'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid enquiry status.' }, { status: 400 });
    }

    const updated = await updateEnquiryStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Enquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
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
    const deleted = await deleteEnquiry(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Enquiry not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
