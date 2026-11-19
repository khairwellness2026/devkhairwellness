import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateAppointmentStatus } from '@/services/appointmentService';
import { AppointmentStatus } from '@/types';

const patchSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing appointment id' }, { status: 400 });
    }

    const json = await req.json();
    const { status } = patchSchema.parse(json);

    const updated = await updateAppointmentStatus(id, status as AppointmentStatus);
    return NextResponse.json({ success: true, appointment: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid status value', details: err.issues }, { status: 400 });
    }
    console.error('Appointment status update error:', err);
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}

