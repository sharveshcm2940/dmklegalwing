import { NextResponse } from 'next/server';
import { updateEnquiryStatus, deleteEnquiry } from '@/lib/serverDb';
import { PublicEnquiry } from '@/types';
import { requireRole } from '@/lib/auth';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(request, ['legal_desk']);
    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;
    const body = await request.json();
    const { status, notes } = body as { status: PublicEnquiry['status']; notes?: string };

    if (!status || !['new', 'reviewed', 'resolved'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid enquiry status.' }, { status: 400 });
    }

    const updated = await updateEnquiryStatus(id, status, notes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Enquiry not found.' }, { status: 404 });
    }

    await requireRole(request, ['legal_desk'], `Updated citizen enquiry ${id} status to '${status}'`);
    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireRole(request, ['legal_desk']);
    if (!auth.authorized) {
      return auth.response;
    }

    const { id } = await context.params;
    const deleted = await deleteEnquiry(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Enquiry not found.' }, { status: 404 });
    }

    await requireRole(request, ['legal_desk'], `Deleted citizen enquiry: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
