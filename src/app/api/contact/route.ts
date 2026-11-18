import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createContactSubmission, getContactSubmissions } from '@/services/enquiryService';

const contactSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(25).optional(),
  subject: z.string().max(150).optional(),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const validated = contactSchema.parse(json);

    const record = await createContactSubmission(validated);

    return NextResponse.json({
      success: true,
      id: record.id,
      message: 'Thank you. Your message has been received.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (err as any).errors || err.issues }, { status: 400 });
    }
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const submissions = await getContactSubmissions({ status, search });
    return NextResponse.json({ submissions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
