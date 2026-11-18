'use client';

import { useState } from 'react';
import { AppLocale } from '@/lib/i18n/config';
import { getUITranslations } from '@/lib/i18n/translations';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactFormProps {
  locale: AppLocale;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const t = getUITranslations(locale);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message');
      }

      setSubmitted(true);
      setFormData({ full_name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-khair-softBeige shadow-lg">
      {submitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-khair-deepForest">
            Message Sent Successfully
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Thank you for reaching out to KHAIR International. Our coordinators will review your enquiry and respond promptly.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 px-5 py-2 text-xs font-semibold text-khair-deepForest bg-khair-warmIvory rounded-full border border-khair-gold/40"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-khair-deepForest">
            Send Us an Enquiry
          </h3>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-khair-charcoal mb-1">
              {t.fullName} *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-khair-charcoal mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-khair-charcoal mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-khair-charcoal mb-1">
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Treatment Inquiry, International Patient Stay"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-khair-charcoal mb-1">
              Your Message *
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{loading ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      )}
    </div>
  );
}

