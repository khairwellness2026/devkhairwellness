'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, CheckCircle2, AlertCircle, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'landscape' | 'square' | 'banner' | 'portrait' | 'auto';
  hint?: string;
  className?: string;
}

export default function ImageDropzone({
  value,
  onChange,
  folder = 'khair/uploads',
  label,
  aspectRatio = 'landscape' as 'landscape' | 'square' | 'banner' | 'portrait' | 'auto',
  hint,
  className = '',
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'banner':
        return 'aspect-[16/9] min-h-[120px]';
      case 'square':
        return 'aspect-square min-h-[120px]';
      case 'portrait':
        return 'aspect-[3/4] min-h-[120px]';
      case 'landscape':
        return 'aspect-[16/10] min-h-[120px]';
      default:
        return 'min-h-[100px]';
    }
  };

  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPEG, PNG, WebP, SVG).');
      return;
    }

    // Validate size (max 12MB)
    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 12MB limit.');
      return;
    }

    setErrorMsg(null);
    setSuccessNotice(null);
    setUploading(true);
    setUploadProgress('Preparing upload...');

    try {
      // 1. Request signature from server API
      setUploadProgress('Signing request...');
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });

      const signData = await signRes.json();

      if (signRes.ok && signData.apiKey && signData.signature) {
        // 2. Direct upload to Cloudinary CDN
        setUploadProgress('Uploading to Cloudinary CDN...');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', signData.apiKey);
        formData.append('timestamp', signData.timestamp.toString());
        formData.append('signature', signData.signature);
        formData.append('folder', signData.folder);

        const uploadEndpoint = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
        const cloudRes = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });

        const cloudData = await cloudRes.json();

        if (cloudRes.ok && cloudData.secure_url) {
          onChange(cloudData.secure_url);
          setSuccessNotice('Uploaded to Cloudinary CDN successfully.');
          
          // Try to record in Supabase media_assets table
          try {
            const supabase = createClient();
            await supabase.from('media_assets').insert({
              name: file.name,
              public_id: cloudData.public_id,
              secure_url: cloudData.secure_url,
              format: cloudData.format,
              bytes: cloudData.bytes,
              width: cloudData.width,
              height: cloudData.height,
              folder: signData.folder,
            });
          } catch {}

          return;
        } else {
          throw new Error(cloudData.error?.message || 'Cloudinary upload failed');
        }
      } else {
        throw new Error(signData.error || 'Cloudinary signing not configured');
      }
    } catch (err: any) {
      console.warn('Cloudinary upload fallback to data URL:', err.message);
      
      // Fallback: Read file as Base64 Data URL for instant preview & development
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onChange(result);
          setSuccessNotice('Image preview loaded (Add Cloudinary credentials to .env.local for CDN hosting).');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      setUploadProgress('');
      setTimeout(() => setSuccessNotice(null), 5000);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMsg(null);
    setSuccessNotice(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-700">{label}</label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] text-khair-botanical hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL input' : 'Paste direct URL'}</span>
          </button>
        </div>
      )}

      {/* Manual URL Input (toggleable) */}
      {showUrlInput && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
          />
        </div>
      )}

      {/* Dropzone Box */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4 text-center ${getAspectClass()} ${
          isDragging
            ? 'border-khair-gold bg-khair-gold/10 scale-[1.01]'
            : value
            ? 'border-gray-200 bg-gray-50 hover:border-khair-botanical/60'
            : 'border-gray-300 bg-gray-50/60 hover:border-khair-gold hover:bg-khair-warmIvory/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Existing Image Preview */}
        {value && !uploading && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-khair-deepForest text-xs font-semibold shadow-md">
                <RefreshCw className="w-3 h-3" />
                <span>Replace Image</span>
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Uploading state */}
        {uploading && (
          <div className="space-y-2 z-10 flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-khair-gold animate-spin" />
            <span className="text-xs font-semibold text-khair-deepForest">{uploadProgress}</span>
          </div>
        )}

        {/* Empty state prompt */}
        {!value && !uploading && (
          <div className="space-y-1.5 z-10">
            <div className="w-9 h-9 rounded-xl bg-khair-warmIvory border border-khair-gold/30 text-khair-botanical flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xs">
              <Upload className="w-4 h-4 text-khair-botanical" />
            </div>
            <div>
              <p className="text-xs font-bold text-khair-deepForest">
                Drag & drop or <span className="text-khair-goldDark underline">browse</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {hint || 'PNG, JPG, WebP up to 12MB'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notices */}
      {successNotice && (
        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

