import { NextResponse } from 'next/server';
import { getRegistrations, getEnquiries } from '@/lib/serverDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tracking ID is required.' },
        { status: 400 }
      );
    }

    // 1. Search in enquiries
    const enquiries = await getEnquiries();
    const enquiry = enquiries.find((e) => e.id.toLowerCase() === id.toLowerCase());

    if (enquiry) {
      let publicStatus: 'New' | 'In progress' | 'Resolved' = 'New';
      if (enquiry.status === 'new') publicStatus = 'New';
      else if (enquiry.status === 'reviewed') publicStatus = 'In progress';
      else if (enquiry.status === 'resolved') publicStatus = 'Resolved';

      // STRICT PRIVACY: Return ONLY the status and tracking ID
      return NextResponse.json({
        success: true,
        found: true,
        trackingId: enquiry.id,
        status: publicStatus,
        type: 'citizen-desk'
      });
    }

    // 2. Search in registrations
    const registrations = await getRegistrations();
    const registration = registrations.find((r) => r.id.toLowerCase() === id.toLowerCase());

    if (registration) {
      let publicStatus: 'New' | 'In progress' | 'Resolved' = 'New';
      if (registration.status === 'pending') publicStatus = 'New';
      else if (registration.status === 'verified') publicStatus = 'In progress';
      else if (registration.status === 'approved' || registration.status === 'rejected') publicStatus = 'Resolved';

      // STRICT PRIVACY: Return ONLY the status and tracking ID
      return NextResponse.json({
        success: true,
        found: true,
        trackingId: registration.id,
        status: publicStatus,
        type: 'enrol'
      });
    }

    // If not found in either
    return NextResponse.json({
      success: true,
      found: false,
      trackingId: id,
      error: 'No active record found matching this Tracking ID.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
