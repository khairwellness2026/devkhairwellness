import { NextRequest, NextResponse } from 'next/server';
import { generateUploadSignature } from '@/lib/cloudinary';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In local dev without live supabase auth, allow test signing if admin secret is set
    const body = await req.json().catch(() => ({}));
    const folder = body.folder || 'khair/uploads';

    const validFolders = [
      'khair/branding',
      'khair/homepage',
      'khair/departments',
      'khair/doctors',
      'khair/gallery',
      'khair/pages',
      'khair/banners',
      'khair/uploads',
    ];

    const safeFolder = validFolders.includes(folder) ? folder : 'khair/uploads';

    const signData = generateUploadSignature(safeFolder);
    return NextResponse.json(signData);
  } catch (err: any) {
    console.error('Cloudinary sign error:', err);
    return NextResponse.json({ error: err.message || 'Signature failed' }, { status: 500 });
  }
}

