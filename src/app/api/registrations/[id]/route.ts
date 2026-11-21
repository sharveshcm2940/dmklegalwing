import { NextResponse } from 'next/server';
import { updateRegistrationStatus, deleteRegistration } from '@/lib/serverDb';
import { AdvocateRegistration } from '@/types';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body as { status: AdvocateRegistration['status'] };

    if (!status || !['pending', 'verified', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid registration status.' }, { status: 400 });
    }

    const updated = await updateRegistrationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Registration not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, registration: updated });
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
    const deleted = await deleteRegistration(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Registration not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
