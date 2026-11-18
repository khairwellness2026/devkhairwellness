import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAppointment, getAppointments } from '@/services/appointmentService';

const appointmentSchema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(7, 'Please provide a valid phone number').max(25),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  department_id: z.string().uuid().optional().or(z.literal('')),
  preferred_date: z.string().min(1, 'Please select a preferred date'),
  preferred_time: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = appointmentSchema.parse(json);

    // Extract client IP if available
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    const record = await createAppointment({
      patient_name: validated.patient_name,
      phone: validated.phone,
      email: validated.email || undefined,
      department_id: validated.department_id || undefined,
      preferred_date: validated.preferred_date,
      preferred_time: validated.preferred_time || undefined,
      message: validated.message || undefined,
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      reference_no: record.reference_no,
      message: 'Consultation request received successfully.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (err as any).errors || err.issues }, { status: 400 });
    }
    console.error('Appointment submission error:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || undefined;
    const department_id = url.searchParams.get('department_id') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const date = url.searchParams.get('date') || undefined;

    const appointments = await getAppointments({ status, department_id, search, date });
    return NextResponse.json({ appointments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
