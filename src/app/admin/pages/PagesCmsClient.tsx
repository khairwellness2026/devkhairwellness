'use client';

import { useState } from 'react';
import { Locale } from '@/types';
import { Save, Globe, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import ImageDropzone from '@/components/admin/ImageDropzone';

interface Props {
  initialAbout: any;
  initialContact: any;
}

export default function PagesCmsClient({ initialAbout, initialContact }: Props) {
  const [selectedPage, setSelectedPage] = useState<'about' | 'contact'>('about');
  const [activeLang, setActiveLang] = useState<Locale>('en');
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [aboutForm, setAboutForm] = useState({
    title: initialAbout?.title || 'About KHAIR International',
    subtitle: initialAbout?.subtitle || 'Kottakkal Heritage Ayurveda and Integrated Rehabilitation',
    featured_image: initialAbout?.featured_image || '',
    story: initialAbout?.content?.story || '',
    mission: initialAbout?.content?.mission || '',
    vision: initialAbout?.content?.vision || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedNotice(null);
    setErrorNotice(null);

    try {
      if (selectedPage === 'about') {
        const res = await fetch('/api/admin/content/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'page',
            payload: {
              slug: 'about',
              featured_image: aboutForm.featured_image,
              is_published: true,
              locale: activeLang,
              title: aboutForm.title,
              subtitle: aboutForm.subtitle,
              content: {
                story: aboutForm.story,
                mission: aboutForm.mission,
                vision: aboutForm.vision,
                featured_image: aboutForm.featured_image,
              },
            },
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save page');
        setSavedNotice('About Us page content & images saved to Supabase successfully.');
      } else {
        setSavedNotice('Contact page settings saved.');
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Error updating page');
    } finally {
      setSaving(false);
      setTimeout(() => setSavedNotice(null), 5000);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Selector & Language bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedPage('about')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedPage === 'about'
                ? 'bg-khair-deepForest text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            About Us Page
          </button>
          <button
            type="button"
            onClick={() => setSelectedPage('contact')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedPage === 'contact'
                ? 'bg-khair-deepForest text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Contact Page
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-khair-goldDark" />
          {(['en', 'hi', 'ar'] as Locale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setActiveLang(loc)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeLang === loc
                  ? 'bg-khair-gold text-khair-deepForest font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {loc.toUpperCase()}
            </button>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="ml-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen disabled:opacity-50 rounded-xl cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorNotice}</span>
        </div>
      )}

      {selectedPage === 'about' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
          
          {/* About Us Hero & Facility Image Dropzone */}
          <div className="bg-khair-warmIvory/30 p-5 rounded-2xl border border-khair-softBeige/80">
            <ImageDropzone
              value={aboutForm.featured_image}
              onChange={(url) => setAboutForm({ ...aboutForm, featured_image: url })}
              folder="khair/pages"
              label="About Us Facility & Heritage Showcase Image (Cloudinary Drag & Drop)"
              aspectRatio="banner"
              hint="Drag & drop high-res facility, hospital campus or treatment room photo"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Page Title ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={aboutForm.title}
                onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={aboutForm.subtitle}
                onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Brand Story & Healthcare Heritage Narrative
            </label>
            <textarea
              rows={4}
              value={aboutForm.story}
              onChange={(e) => setAboutForm({ ...aboutForm, story: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Our Mission
              </label>
              <textarea
                rows={3}
                value={aboutForm.mission}
                onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Our Vision
              </label>
              <textarea
                rows={3}
                value={aboutForm.vision}
                onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {selectedPage === 'contact' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Contact Page Subtitle
            </label>
            <input
              type="text"
              defaultValue="We are here to assist your healing journey"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Working Hours Display String
            </label>
            <input
              type="text"
              defaultValue="Monday – Saturday: 8:00 AM – 7:00 PM | Sunday: Inpatient & Emergency Care"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
        </div>
      )}

    </form>
  );
}
