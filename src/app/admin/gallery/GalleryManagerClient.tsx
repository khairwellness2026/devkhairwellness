'use client';

import { useState } from 'react';
import { GalleryImage, GalleryCategory } from '@/types';
import { Plus, Edit3, Trash2, Eye, EyeOff, Image as ImageIcon, Save, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import ImageDropzone from '@/components/admin/ImageDropzone';

interface Props {
  initialImages: GalleryImage[];
  categories: GalleryCategory[];
}

export default function GalleryManagerClient({ initialImages, categories }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    caption: '',
    alt_text: '',
    category_id: '',
    image_url: '',
    is_published: true,
  });

  const startEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setForm({
      title: img.title,
      caption: img.caption || '',
      alt_text: img.alt_text,
      category_id: img.category_id || '',
      image_url: img.image_url,
      is_published: img.is_published,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    if (!form.image_url) {
      setErrorNotice('Please upload or provide an image for the gallery item.');
      return;
    }

    setSaving(true);
    setSaveNotice(null);
    setErrorNotice(null);

    const cat = categories.find((c) => c.id === form.category_id);

    const updated: GalleryImage = {
      ...editingImage,
      title: form.title,
      caption: form.caption,
      alt_text: form.alt_text,
      category_id: form.category_id,
      category_name: cat?.name,
      image_url: form.image_url,
      is_published: form.is_published,
    };

    try {
      const res = await fetch('/api/admin/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'gallery_image',
          payload: {
            id: updated.id,
            category_id: updated.category_id,
            image_url: updated.image_url,
            sort_order: updated.sort_order,
            is_published: updated.is_published,
            locale: 'en',
            title: updated.title,
            caption: updated.caption,
            alt_text: updated.alt_text,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save gallery item');

      setImages(images.map((i) => (i.id === updated.id ? updated : i)));
      setSaveNotice(`Gallery photo "${updated.title}" saved to Supabase.`);
      setEditingImage(null);
    } catch (err: any) {
      setErrorNotice(err.message || 'Error saving gallery image');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveNotice(null), 5000);
    }
  };

  const togglePublish = (id: string) => {
    setImages(images.map((i) => (i.id === id ? { ...i, is_published: !i.is_published } : i)));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-khair-botanical" />
          <span className="font-serif text-lg font-bold text-khair-deepForest">
            Active Gallery Items ({images.length})
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            const newId = `gal-${Date.now()}`;
            const newImg: GalleryImage = {
              id: newId,
              title: 'New Centre Photo',
              caption: 'Therapeutic and healing space at KHAIR.',
              alt_text: 'KHAIR Centre Photo',
              image_url: '',
              sort_order: images.length + 1,
              is_published: true,
            };
            setImages([newImg, ...images]);
            startEdit(newImg);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Image</span>
        </button>
      </div>

      {saveNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
              {img.image_url ? (
                <img
                  src={img.image_url}
                  alt={img.alt_text}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon className="w-10 h-10" />
                </div>
              )}
              {img.category_name && (
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-full bg-black/60 text-white backdrop-blur-xs">
                  {img.category_name}
                </span>
              )}
            </div>

            <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-serif text-base font-bold text-khair-deepForest leading-snug line-clamp-1">
                  {img.title}
                </h4>
                {img.caption && (
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{img.caption}</p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => togglePublish(img.id)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                    img.is_published ? 'text-emerald-600' : 'text-gray-400'
                  }`}
                >
                  {img.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{img.is_published ? 'Published' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(img)}
                    className="p-1.5 text-gray-400 hover:text-khair-deepForest hover:bg-gray-100 rounded-lg"
                    title="Edit & replace image"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove "${img.title}"?`)) {
                        setImages(images.filter((i) => i.id !== img.id));
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Gallery Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-khair-gold/30">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-khair-botanical">
                  GALLERY CMS
                </span>
                <h3 className="font-serif text-xl font-bold text-khair-deepForest">
                  Upload & Edit Gallery Image
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Drag and drop gallery image */}
              <div className="bg-khair-warmIvory/30 p-4 rounded-2xl border border-khair-softBeige/80">
                <ImageDropzone
                  value={form.image_url}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  folder="khair/gallery"
                  label="Gallery Photo (Cloudinary Drag & Drop) *"
                  aspectRatio="landscape"
                  hint="Drag & drop high-res facility, treatment or activity photo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white focus:border-khair-gold outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Alt Text (SEO) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.alt_text}
                    onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Caption (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub-check"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded text-khair-deepForest focus:ring-khair-gold"
                />
                <label htmlFor="pub-check" className="text-xs font-semibold text-gray-700">
                  Published in public gallery
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen disabled:opacity-50 rounded-xl shadow-xs"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saving ? 'Saving...' : 'Save Gallery Photo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
