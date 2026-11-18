import { v2 as cloudinary } from 'cloudinary';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { MediaAsset } from '@/types';

// Configure server-side Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export { cloudinary };

export function generateUploadSignature(folder: string = 'khair/media') {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    throw new Error('Cloudinary environment credentials not configured.');
  }

  // Params to sign
  const paramsToSign: Record<string, any> = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  };
}

export async function deleteCloudinaryAsset(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
  
  // Also remove or update supabase media_assets
  const client = getServiceRoleClient();
  if (client) {
    await client.from('media_assets').delete().eq('public_id', publicId);
  }

  return result;
}

export async function syncMediaAssetRecord(asset: {
  name: string;
  public_id: string;
  secure_url: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  folder: string;
  alt_text?: string;
}): Promise<MediaAsset | null> {
  const client = getServiceRoleClient();
  if (!client) return null;

  const { data, error } = await client
    .from('media_assets')
    .upsert(
      {
        name: asset.name,
        public_id: asset.public_id,
        secure_url: asset.secure_url,
        format: asset.format,
        bytes: asset.bytes,
        width: asset.width,
        height: asset.height,
        folder: asset.folder,
        alt_text: asset.alt_text,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'public_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving media asset to database:', error);
    return null;
  }

  return data as MediaAsset;
}

