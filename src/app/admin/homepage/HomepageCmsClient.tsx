'use client';

import { useState } from 'react';
import { HomepageSection, Locale } from '@/types';
import { Save, Globe, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import ImageDropzone from '@/components/admin/ImageDropzone';

interface Props {
  initialSections: Record<string, HomepageSection>;
}

export default function HomepageCmsClient({ initialSections }: Props) {
  const [sections, setSections] = useState<Record<string, HomepageSection>>(initialSections);
  const [activeLang, setActiveLang] = useState<Locale>('en');
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const rawHero = sections['hero'];
  const hero = {
    id: rawHero?.id || 'hero',
    section_key: 'hero',
    is_visible: rawHero?.is_visible !== false,
    sort_order: rawHero?.sort_order || 1,
    title: rawHero?.title || 'Your Journey Back to Wellbeing',
    subtitle: rawHero?.subtitle || 'INTEGRATIVE HEALTHCARE',
    description: rawHero?.description || '',
    cta_label: rawHero?.cta_label || 'Book Appointment',
    cta_link: rawHero?.cta_link || '/contact#book-appointment',
    image_url: rawHero?.image_url || '',
    mobile_image_url: rawHero?.mobile_image_url || rawHero?.metadata?.mobile_image_url || '',
  };

  const handleHeroChange = (field: string, val: any) => {
    setSections((prev) => ({
      ...prev,
      hero: {
        ...(prev['hero'] || hero),
        [field]: val,
      },
    }));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorNotice(null);
    setSavedNotice(null);

    try {
      const res = await fetch('/api/admin/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'homepage_section',
          payload: {
            section_key: 'hero',
            image_url: hero.image_url,
            mobile_image_url: hero.mobile_image_url,
            is_visible: hero.is_visible !== false,
            locale: activeLang,
            title: hero.title,
            subtitle: hero.subtitle,
            description: hero.description,
            cta_label: hero.cta_label,
            cta_link: hero.cta_link,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setSavedNotice('Homepage hero section & banner saved to Supabase successfully.');
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setSavedNotice(null), 5000);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-khair-goldDark" />
          <span className="text-xs font-bold text-gray-700">Content Language:</span>
          {(['en', 'hi', 'ar'] as Locale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setActiveLang(loc)}
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

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Hero Section Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-khair-botanical">
              SECTION 01
            </span>
            <h3 className="font-serif text-xl font-bold text-khair-deepForest">
              Hero Banner & Integrative Healthcare Showcase
            </h3>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">
            Visible
          </span>
        </div>

        <div className="space-y-6">
          {/* Desktop + Mobile Hero Banners — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Desktop */}
            <div className="bg-khair-warmIvory/30 p-4 rounded-2xl border border-khair-softBeige/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-khair-deepForest/10 text-khair-deepForest rounded-full uppercase tracking-wider">Desktop</span>
                <span className="text-[10px] text-gray-400">≥ 768px</span>
              </div>
              <ImageDropzone
                value={hero.image_url || ''}
                onChange={(url) => handleHeroChange('image_url', url)}
                folder="khair/homepage"
                label="Hero Banner — Desktop"
                aspectRatio="landscape"
                hint="1920×1080px landscape recommended"
                className="[&_.aspect-\\[16\\/10\\]]:min-h-[120px]"
              />
            </div>

            {/* Mobile */}
            <div className="bg-khair-warmIvory/30 p-4 rounded-2xl border border-khair-softBeige/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-khair-botanical/15 text-khair-botanical rounded-full uppercase tracking-wider">Mobile</span>
                <span className="text-[10px] text-gray-400">&lt; 768px • falls back to desktop</span>
              </div>
              <ImageDropzone
                value={hero.mobile_image_url || ''}
                onChange={(url) => handleHeroChange('mobile_image_url', url)}
                folder="khair/homepage"
                label="Hero Banner — Mobile"
                aspectRatio="square"
                hint="768×900px portrait recommended"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hero Tagline / Subtitle ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={hero.subtitle || ''}
                onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hero Main Headline ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={hero.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none font-serif text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Hero Supporting Description ({activeLang.toUpperCase()})
            </label>
            <textarea
              rows={3}
              value={hero.description || ''}
              onChange={(e) => handleHeroChange('description', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={hero.cta_label || ''}
                onChange={(e) => handleHeroChange('cta_label', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Primary CTA Link
              </label>
              <input
                type="text"
                value={hero.cta_link || ''}
                onChange={(e) => handleHeroChange('cta_link', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>

    </form>
  );
}
