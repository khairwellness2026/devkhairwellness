'use client';

import { useState } from 'react';
import { Department, Locale } from '@/types';
import { Plus, Edit3, Trash2, Check, Eye, EyeOff, Building2, Save, X, Globe, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import ImageDropzone from '@/components/admin/ImageDropzone';

interface Props {
  initialEn: Department[];
  initialHi: Department[];
  initialAr: Department[];
}

export default function DepartmentsManagerClient({ initialEn, initialHi, initialAr }: Props) {
  const [departments, setDepartments] = useState<Department[]>(initialEn);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [activeLang, setActiveLang] = useState<Locale>('en');
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    treatmentsStr: '',
    featured_image: '',
    hero_banner_url: '',
    hero_mobile_banner_url: '',
    icon: 'Leaf',
    is_published: true,
  });

  const startEdit = (dept: Department) => {
    setEditingDept(dept);
    setActiveLang('en');
    setModalError(null);
    setForm({
      name: dept.name || '',
      slug: dept.slug || '',
      short_description: dept.short_description || '',
      full_description: dept.full_description || '',
      treatmentsStr: Array.isArray(dept.treatments)
        ? dept.treatments.join('\n')
        : typeof dept.treatments === 'string'
        ? dept.treatments
        : '',
      featured_image: dept.featured_image || '',
      hero_banner_url: dept.hero_banner_url || '',
      hero_mobile_banner_url: dept.hero_mobile_banner_url || '',
      icon: dept.icon || 'Leaf',
      is_published: dept.is_published !== false,
    });
  };

  const switchLanguage = (targetLocale: Locale) => {
    setActiveLang(targetLocale);
    if (!editingDept) return;
    const pool = targetLocale === 'hi' ? initialHi : targetLocale === 'ar' ? initialAr : initialEn;
    const match = pool.find((d) => d.id === editingDept.id || d.slug === editingDept.slug);
    if (match) {
      setForm((prev) => ({
        ...prev,
        name: match.name || prev.name,
        short_description: match.short_description || '',
        full_description: match.full_description || '',
        treatmentsStr: Array.isArray(match.treatments)
          ? match.treatments.join('\n')
          : typeof match.treatments === 'string'
          ? match.treatments
          : '',
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    setSaving(true);
    setSaveNotice(null);
    setErrorNotice(null);
    setModalError(null);

    const updated: Department = {
      ...editingDept,
      name: form.name,
      slug: form.slug,
      short_description: form.short_description,
      full_description: form.full_description,
      treatments: form.treatmentsStr.split('\n').filter((t) => t.trim()),
      featured_image: form.featured_image,
      icon: form.icon,
      is_published: form.is_published,
      hero_banner_url: form.hero_banner_url,
      hero_mobile_banner_url: form.hero_mobile_banner_url,
    };

    try {
      const res = await fetch('/api/admin/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'department',
          payload: {
            id: updated.id,
            slug: updated.slug,
            featured_image: updated.featured_image,
            icon: updated.icon,
            is_published: updated.is_published,
            hero_banner_url: updated.hero_banner_url || null,
            hero_mobile_banner_url: updated.hero_mobile_banner_url || null,
            locale: activeLang,
            name: updated.name,
            short_description: updated.short_description,
            full_description: updated.full_description,
            treatments: updated.treatments,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update department');

      setDepartments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setSaveNotice(`Department "${updated.name}" saved to Supabase.`);
      setEditingDept(null);
    } catch (err: any) {
      setModalError(err.message || 'Error updating department');
      setErrorNotice(err.message || 'Error updating department');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveNotice(null), 5000);
    }
  };

  const togglePublish = (id: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_published: !d.is_published } : d))
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-khair-botanical" />
          <span className="font-serif text-lg font-bold text-khair-deepForest">
            Active Clinical Departments ({departments.length})
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            const newId = `dept-new-${Date.now()}`;
            const newDept: Department = {
              id: newId,
              slug: 'new-department',
              name: 'New Department',
              short_description: 'Department brief description',
              full_description: 'Full clinical department overview and treatment approaches.',
              treatments: ['Sample Therapy Protocol'],
              icon: 'Activity',
              featured_image: '',
              sort_order: departments.length + 1,
              is_published: true,
            };
            setDepartments([...departments, newDept]);
            startEdit(newDept);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
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

      {/* Departments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className={`bg-white rounded-3xl p-6 border shadow-xs transition-all flex flex-col justify-between ${
              dept.is_published ? 'border-gray-200' : 'border-amber-200 bg-amber-50/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {dept.slug}
                </span>
                <button
                  type="button"
                  onClick={() => togglePublish(dept.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer ${
                    dept.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {dept.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{dept.is_published ? 'Published' : 'Draft'}</span>
                </button>
              </div>

              <h3 className="font-serif text-lg font-bold text-khair-deepForest mb-1">
                {dept.name}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                {dept.short_description}
              </p>

              <div className="text-[11px] text-gray-500 space-y-1">
                <span className="font-semibold block text-gray-700">Treatments ({Array.isArray(dept.treatments) ? dept.treatments.length : 0}):</span>
                <p className="truncate text-gray-500">{Array.isArray(dept.treatments) ? dept.treatments.join(', ') : ''}</p>
              </div>

              {(dept.hero_banner_url || dept.hero_mobile_banner_url) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dept.hero_banner_url && (
                    <span className="text-[9px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      🖥 Desktop Banner
                    </span>
                  )}
                  {dept.hero_mobile_banner_url && (
                    <span className="text-[9px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                      📱 Mobile Banner
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => startEdit(dept)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-khair-deepForest bg-khair-warmIvory hover:bg-khair-softBeige rounded-lg border border-khair-gold/30"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit & Localize</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove department "${dept.name}"?`)) {
                    setDepartments(departments.filter((d) => d.id !== dept.id));
                  }
                }}
                className="p-1.5 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-khair-gold/30">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-khair-botanical">
                  DEPARTMENT CMS
                </span>
                <h3 className="font-serif text-xl font-bold text-khair-deepForest">
                  Edit Department: {editingDept.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Globe className="w-4 h-4 text-khair-goldDark" />
              {(['en', 'hi', 'ar'] as Locale[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => switchLanguage(loc)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeLang === loc
                      ? 'bg-khair-deepForest text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {loc === 'en' ? 'English (en)' : loc === 'hi' ? 'हिन्दी (hi)' : 'العربية (ar)'}
                </button>
              ))}
            </div>

            {modalError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Department Name ({activeLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none font-mono"
                  />
                </div>
              </div>

              <div className="bg-khair-warmIvory/30 p-4 rounded-2xl border border-khair-softBeige/80">
                <ImageDropzone
                  value={form.featured_image}
                  onChange={(url) => setForm({ ...form, featured_image: url })}
                  folder="khair/departments"
                  label="Department Photo (Cloudinary Drag & Drop)"
                  aspectRatio="landscape"
                  hint="Drag & drop department facility or clinical therapy photo"
                />
              </div>

              {/* Hero Banner Images — desktop & mobile */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200/60 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-blue-700">Department Page Hero Banners</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">🖥 Desktop Hero Banner</p>
                    <ImageDropzone
                      value={form.hero_banner_url}
                      onChange={(url) => setForm({ ...form, hero_banner_url: url })}
                      folder="khair/departments/banners"
                      label="Desktop Banner"
                      aspectRatio="landscape"
                      hint="Wide landscape image for desktop hero (16:5 or 16:9)"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">📱 Mobile Hero Banner</p>
                    <ImageDropzone
                      value={form.hero_mobile_banner_url}
                      onChange={(url) => setForm({ ...form, hero_mobile_banner_url: url })}
                      folder="khair/departments/banners"
                      label="Mobile Banner"
                      aspectRatio="portrait"
                      hint="Portrait image for mobile hero (3:4 or 1:1)"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-blue-600/80 leading-relaxed">
                  If uploaded, these images replace the deep-green gradient on the department detail page hero banner. Leave empty to use the default branded gradient.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Short Description ({activeLang.toUpperCase()}) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Clinical Description ({activeLang.toUpperCase()}) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.full_description}
                  onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Key Treatments & Therapies (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.treatmentsStr}
                  onChange={(e) => setForm({ ...form, treatmentsStr: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none font-mono"
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
                  Published on public website
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

