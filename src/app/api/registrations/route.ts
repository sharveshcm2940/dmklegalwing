import { NextResponse } from 'next/server';
import { getRegistrations, createRegistration } from '@/lib/serverDb';

export async function GET() {
  try {
    const list = await getRegistrations();
    return NextResponse.json({ success: true, count: list.length, registrations: list });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
