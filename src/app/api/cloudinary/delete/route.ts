import { NextRequest, NextResponse } from 'next/server';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const { publicId } = await req.json();
    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required' }, { status: 400 });
    }

    const result = await deleteCloudinaryAsset(publicId);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error('Delete asset error:', err);
    return NextResponse.json({ error: err.message || 'Deletion failed' }, { status: 500 });
  }
}

