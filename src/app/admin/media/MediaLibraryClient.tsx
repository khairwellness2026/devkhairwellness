'use client';

import { useState, useEffect } from 'react';
import { MediaAsset } from '@/types';
import { Upload, Folder, Copy, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function MediaLibraryClient() {
  const folders = [
    'khair/branding',
    'khair/homepage',
    'khair/departments',
    'khair/doctors',
    'khair/gallery',
    'khair/pages',
    'khair/banners',
  ];

  const [selectedFolder, setSelectedFolder] = useState('khair/gallery');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real assets from Supabase
  useEffect(() => {
    async function loadAssets() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('media_assets')
          .select('*')
          .eq('folder', selectedFolder)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setAssets(data as MediaAsset[]);
        } else {
          setAssets([]);
        }
      } catch (err) {
        console.error('Failed to load media assets:', err);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, [selectedFolder]);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get server upload signature
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: selectedFolder }),
      });
      const signData = await signRes.json();

      if (!signRes.ok) {
        throw new Error(signData.error || 'Signing failed');
      }

      // 2. Upload directly to Cloudinary using signed params
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp.toString());
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
      const cloudRes = await fetch(uploadUrl, { method: 'POST', body: formData });
      const cloudData = await cloudRes.json();

      if (!cloudRes.ok) {
        throw new Error(cloudData.error?.message || 'Cloudinary upload failed');
      }

      // 3. Save to Supabase media_assets table
      const supabase = createClient();
      const newRecord = {
        name: file.name,
        public_id: cloudData.public_id,
        secure_url: cloudData.secure_url,
        format: cloudData.format,
        bytes: cloudData.bytes,
        width: cloudData.width,
        height: cloudData.height,
        folder: selectedFolder,
        alt_text: file.name.split('.')[0],
      };

      const { data: savedRecord } = await supabase
        .from('media_assets')
        .insert([newRecord])
        .select()
        .single();

      if (savedRecord) {
        setAssets([savedRecord as MediaAsset, ...assets]);
      }
    } catch (err: any) {
      alert(`Upload notification: ${err.message}. Configure Cloudinary keys in .env.local.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm(`Delete image "${asset.name}"?`)) return;

    try {
      await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: asset.public_id }),
      });

      const supabase = createClient();
      await supabase.from('media_assets').delete().eq('id', asset.id);

      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {folders.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedFolder === f
                  ? 'bg-khair-deepForest text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{f.replace('khair/', '')}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-xs transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Signing & Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-400">Loading media assets...</div>
      ) : assets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={asset.secure_url}
                    alt={asset.alt_text || asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {asset.width && asset.height && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
                      {asset.width}x{asset.height}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <p className="text-xs font-bold text-gray-800 truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="text-[10px] font-mono text-gray-400 truncate">
                    {asset.public_id}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => copyUrl(asset.secure_url, asset.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-khair-deepForest bg-khair-warmIvory rounded-lg hover:bg-khair-softBeige transition-colors"
                >
                  {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(asset)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-200 p-8 space-y-2">
          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-xs text-gray-500">
            No media assets found in folder &quot;{selectedFolder}&quot;. Upload images above or execute the database seed.
          </p>
        </div>
      )}

    </div>
  );
}
