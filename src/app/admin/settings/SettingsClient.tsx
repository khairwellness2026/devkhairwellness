'use client';

import { useState } from 'react';
import { SiteSettings } from '@/types';
import { Save, CheckCircle2 } from 'lucide-react';

export default function SettingsClient({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const [form, setForm] = useState({
    site_name: initialSettings?.site_name || 'KHAIR International',
    tagline: initialSettings?.tagline || 'Your Journey Back to Wellbeing',
    sub_tagline: initialSettings?.sub_tagline || 'Kottakkal Heritage Ayurveda and Integrated Rehabilitation',
    phone_primary: initialSettings?.phone_primary || '+91 94473 60670',
    phone_secondary: initialSettings?.phone_secondary || '+91 90204 69647',
    whatsapp_number: initialSettings?.whatsapp_number || '+91 94473 60670',
    email: initialSettings?.email || 'info@khair.in',
    address_line: initialSettings?.address_line || 'Kondotty / Kottakkal, Malappuram, Kerala, India',
    location_details: initialSettings?.location_details || 'Close to Calicut International Airport',
    google_maps_url: initialSettings?.google_maps_url || 'https://maps.google.com/?q=Kottakkal+Malappuram+Kerala',
    footer_text: initialSettings?.footer_text || '© 2026 KHAIR Healthcare Centre. All Rights Reserved.',
    logo_url: initialSettings?.logo_url || '',
    emblem_url: initialSettings?.emblem_url || '',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Website settings updated successfully.</span>
        </div>
      )}

      {/* Identity & Taglines */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-bold text-khair-deepForest border-b border-gray-100 pb-2">
          Brand Identity & Titles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Site Title *
            </label>
            <input
              type="text"
              required
              value={form.site_name}
              onChange={(e) => setForm({ ...form, site_name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Institutional Sub-Tagline
          </label>
          <input
            type="text"
            value={form.sub_tagline}
            onChange={(e) => setForm({ ...form, sub_tagline: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
          />
        </div>
      </div>

      {/* Official Contacts & Numbers */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-bold text-khair-deepForest border-b border-gray-100 pb-2">
          Verified Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Primary Phone *
            </label>
            <input
              type="text"
              required
              value={form.phone_primary}
              onChange={(e) => setForm({ ...form, phone_primary: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Secondary Phone
            </label>
            <input
              type="text"
              value={form.phone_secondary}
              onChange={(e) => setForm({ ...form, phone_secondary: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              WhatsApp Desk Number *
            </label>
            <input
              type="text"
              required
              value={form.whatsapp_number}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Google Maps Location Link
            </label>
            <input
              type="text"
              value={form.google_maps_url}
              onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Physical Hospital Address *
          </label>
          <input
            type="text"
            required
            value={form.address_line}
            onChange={(e) => setForm({ ...form, address_line: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Location & Accessibility Details
          </label>
          <textarea
            rows={2}
            value={form.location_details}
            onChange={(e) => setForm({ ...form, location_details: e.target.value })}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-khair-gold outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

    </form>
  );
}

