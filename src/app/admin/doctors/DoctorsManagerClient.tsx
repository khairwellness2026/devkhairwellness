'use client';

import { useState } from 'react';
import { Doctor, Department, Locale } from '@/types';
import { Plus, Edit3, Trash2, Eye, EyeOff, User, Save, X, Globe, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import ImageDropzone from '@/components/admin/ImageDropzone';

interface Props {
  initialDoctors: Doctor[];
  departments: Department[];
}

export default function DoctorsManagerClient({ initialDoctors, departments }: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [editingDoc, setEditingDoc] = useState<Doctor | null>(null);
  const [activeLang, setActiveLang] = useState<Locale>('en');
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    specialization: '',
    qualifications: '',
    experience_years: 5,
    department_id: '',
    photo_url: '',
    biography: '',
    is_published: true,
  });

  const startEdit = (doc: Doctor) => {
    setEditingDoc(doc);
    setForm({
      name: doc.name,
      slug: doc.slug,
      specialization: doc.specialization,
      qualifications: doc.qualifications,
      experience_years: doc.experience_years,
      department_id: doc.department_id || '',
      photo_url: doc.photo_url || '',
      biography: doc.biography,
      is_published: doc.is_published,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    setSaving(true);
    setSaveNotice(null);
    setErrorNotice(null);

    const dept = departments.find((d) => d.id === form.department_id);

    const updated: Doctor = {
      ...editingDoc,
      name: form.name,
      slug: form.slug,
      specialization: form.specialization,
      qualifications: form.qualifications,
      experience_years: Number(form.experience_years),
      department_id: form.department_id,
      department_name: dept?.name || '',
      photo_url: form.photo_url,
      biography: form.biography,
      is_published: form.is_published,
    };

    try {
      const res = await fetch('/api/admin/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'doctor',
          payload: {
            id: updated.id,
            slug: updated.slug,
            photo_url: updated.photo_url,
            experience_years: updated.experience_years,
            department_id: updated.department_id,
            is_published: updated.is_published,
            locale: activeLang,
            name: updated.name,
            specialization: updated.specialization,
            qualifications: updated.qualifications,
            biography: updated.biography,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update doctor profile');

      setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setSaveNotice(`Doctor profile "${updated.name}" saved to Supabase.`);
      setEditingDoc(null);
    } catch (err: any) {
      setErrorNotice(err.message || 'Error saving doctor profile');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveNotice(null), 5000);
    }
  };

  const togglePublish = (id: string) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_published: !d.is_published } : d))
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-khair-botanical" />
          <span className="font-serif text-lg font-bold text-khair-deepForest">
            Medical Consultants ({doctors.length})
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            const newId = `doc-new-${Date.now()}`;
            const newDoc: Doctor = {
              id: newId,
              slug: 'dr-new-consultant',
              name: 'Dr. New Consultant',
              specialization: 'Ayurveda Specialist',
              qualifications: 'BAMS, MD',
              experience_years: 5,
              biography: 'Experienced medical consultant specializing in personalized patient care.',
              photo_url: '',
              sort_order: doctors.length + 1,
              is_published: true,
            };
            setDoctors([...doctors, newDoc]);
            startEdit(newDoc);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Doctor</span>
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

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className={`bg-white rounded-3xl p-6 border shadow-xs transition-all flex flex-col justify-between ${
              doc.is_published ? 'border-gray-200' : 'border-amber-200 bg-amber-50/20'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {doc.slug}
                </span>
                <button
                  type="button"
                  onClick={() => togglePublish(doc.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer ${
                    doc.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {doc.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{doc.is_published ? 'Active' : 'Hidden'}</span>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-khair-warmIvory border border-khair-gold/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <User className="w-7 h-7 text-khair-botanical" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-khair-deepForest">{doc.name}</h3>
                  <p className="text-xs font-bold text-khair-goldDark">{doc.specialization}</p>
                  <p className="text-[11px] text-gray-500">{doc.qualifications}</p>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                {doc.biography}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => startEdit(doc)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-khair-deepForest bg-khair-warmIvory hover:bg-khair-softBeige rounded-lg border border-khair-gold/30"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove doctor "${doc.name}"?`)) {
                    setDoctors(doctors.filter((d) => d.id !== doc.id));
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

      {/* Edit Doctor Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-khair-gold/30">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-khair-botanical">
                  DOCTOR CMS
                </span>
                <h3 className="font-serif text-xl font-bold text-khair-deepForest">
                  Edit Doctor Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Doctor Photo Drag & Drop */}
              <div className="bg-khair-warmIvory/30 p-4 rounded-2xl border border-khair-softBeige/80">
                <ImageDropzone
                  value={form.photo_url}
                  onChange={(url) => setForm({ ...form, photo_url: url })}
                  folder="khair/doctors"
                  label="Doctor Portrait Photo (Cloudinary Drag & Drop)"
                  aspectRatio="square"
                  hint="Drag & drop doctor portrait or headshot • Cloudinary signed upload"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Doctor Name *
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Qualifications *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.qualifications}
                    onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    value={form.department_id}
                    onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white focus:border-khair-gold outline-none"
                  >
                    <option value="">General Clinic</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Biography & Background *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.biography}
                  onChange={(e) => setForm({ ...form, biography: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="doc-pub"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded text-khair-deepForest focus:ring-khair-gold"
                />
                <label htmlFor="doc-pub" className="text-xs font-semibold text-gray-700">
                  Visible on public doctors listing
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

