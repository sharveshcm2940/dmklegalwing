import { NextResponse } from 'next/server';
import { getRegistrations, createRegistration } from '@/lib/serverDb';
import { requireRole } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Requires Legal Desk or Super Admin to view advocate registration dossiers
    const auth = await requireRole(request, ['legal_desk']);
    if (!auth.authorized) {
      return auth.response;
    }

    const list = await getRegistrations();
    return NextResponse.json({ success: true, count: list.length, registrations: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // PUBLIC INGESTION ENDPOINT: Advocates submit their own enrolment via /enrol
    const body = await request.json();
    const { 
      fullName, 
      barCouncilNumber, 
      mobileNumber, 
      emailAddress, 
      district,
      courtOfPractice,
      yearOfEnrollment,
      address,
      areasOfSpecialization 
    } = body;

    // Validate required fields
    if (!fullName || !barCouncilNumber || !mobileNumber || !emailAddress || !district) {
      return NextResponse.json(
        { success: false, error: 'Full name, Bar Council Number, mobile number, email, and district are required.' },
        { status: 400 }
      );
    }

    const newRecord = await createRegistration({
      fullName: String(fullName).trim(),
      barCouncilNumber: String(barCouncilNumber).trim(),
      mobileNumber: String(mobileNumber).trim(),
      emailAddress: String(emailAddress).trim(),
      district: String(district).trim(),
      courtOfPractice: courtOfPractice ? String(courtOfPractice).trim() : 'District & Sessions Court',
      yearOfEnrollment: yearOfEnrollment ? String(yearOfEnrollment).trim() : new Date().getFullYear().toString(),
      address: address ? String(address).trim() : '',
      areasOfSpecialization: Array.isArray(areasOfSpecialization) ? areasOfSpecialization : ['Constitutional Law']
    });

    return NextResponse.json({ success: true, registration: newRecord }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
