'use client';

import { useState } from 'react';
import { AppLocale } from '@/lib/i18n/config';
import { getUITranslations } from '@/lib/i18n/translations';
import { Department } from '@/types';
import { Calendar, Clock, User, Phone, Mail, Building, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface AppointmentFormProps {
  locale: AppLocale;
  departments: Department[];
  defaultDepartmentSlug?: string;
}

export default function AppointmentForm({
  locale,
  departments,
  defaultDepartmentSlug,
}: AppointmentFormProps) {
  const t = getUITranslations(locale);

  const defaultDept = departments.find((d) => d.slug === defaultDepartmentSlug);

  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    email: '',
    department_id: defaultDept?.id || '',
    preferred_date: '',
    preferred_time: 'Morning (09:00 AM - 01:00 PM)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit appointment enquiry');
      }

      setSuccessRef(data.reference_no);
      setFormData({
        patient_name: '',
        phone: '',
        email: '',
        department_id: '',
        preferred_date: '',
        preferred_time: 'Morning (09:00 AM - 01:00 PM)',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || t.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-khair-softBeige shadow-xl relative overflow-hidden">
      
      {/* Subtle Golden Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-khair-deepForest via-khair-gold to-khair-deepForest" />

      {successRef ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-khair-deepForest">
            {t.successTitle}
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            {t.successMessage}
            <span className="font-mono font-bold text-khair-deepForest bg-khair-warmIvory px-2 py-0.5 rounded border border-khair-gold/40">
              {successRef}
            </span>
          </p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {t.successFollowup}
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setSuccessRef(null)}
              className="px-6 py-2.5 text-xs font-semibold text-khair-deepForest bg-khair-warmIvory hover:bg-khair-softBeige rounded-full border border-khair-gold/40 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-khair-botanical">
              Consultation Booking
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-khair-deepForest">
              {t.consultationCTA}
            </h3>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-semibold text-khair-charcoal mb-1.5">
                {t.fullName} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none transition-all pl-10 rtl:pl-4 rtl:pr-10"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-khair-charcoal mb-1.5">
                {t.phoneNumber} *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 94473 60670"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none transition-all pl-10 rtl:pl-4 rtl:pr-10"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5" />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-khair-charcoal mb-1.5">
                {t.emailAddress}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none transition-all pl-10 rtl:pl-4 rtl:pr-10"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5" />
              </div>
            </div>

            {/* Department Selector */}
            <div>
              <label className="block text-xs font-semibold text-khair-charcoal mb-1.5">
                {t.selectDepartment}
              </label>
              <div className="relative">
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none bg-white transition-all pl-10 rtl:pl-4 rtl:pr-10"
                >
                  <option value="">General Consultation</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <Building className="w-4 h-4 text-gray-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5" />
              </div>
            </div>

            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-semibold text-khair-charcoal mb-1.5">
                {t.preferredDate} *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={minDate}
                  value={formData.preferred_date}
                  onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none transition-all pl-10 rtl:pl-4 rtl:pr-10"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5" />
              </div>
            </div>

            {/* Preferred Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-khair-charcoal mb-1.5">
                {t.preferredTime}
              </label>
              <div className="relative">
                <select
                  value={formData.preferred_time}
                  onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none bg-white transition-all pl-10 rtl:pl-4 rtl:pr-10"
                >
                  <option value="Morning (09:00 AM - 01:00 PM)">Morning (09:00 AM - 01:00 PM)</option>
                  <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                  <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
                </select>
                <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Message / Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-khair-charcoal mb-1.5">
              {t.notesOrMessage}
            </label>
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Briefly mention your health condition, symptoms, or requested therapies..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-sm font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? <span>{t.submitting}</span> : <span>{t.submitAppointment}</span>}
          </button>
        </form>
      )}
    </div>
  );
}

