import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';
import { getSiteSettings, getDepartments, getPageContent, getSeoMetadata } from '@/services/contentService';
import AppointmentForm from '@/components/forms/AppointmentForm';
import ContactForm from '@/components/forms/ContactForm';
import { Phone, Mail, MapPin, Clock, MessageCircle, Navigation } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as AppLocale;
  const seo = await getSeoMetadata('/contact', locale);

  return {
    title: seo?.title || 'Contact & Location | KHAIR International, Kerala',
    description: seo?.description || 'Get in touch with KHAIR International in Kottakkal, Kerala. Book appointments and consultations.',
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) notFound();
  const appLocale = locale as AppLocale;

  const [settings, departments, page] = await Promise.all([
    getSiteSettings(),
    getDepartments(appLocale),
    getPageContent('contact', appLocale),
  ]);

  const phonePrimary = settings?.phone_primary || '+91 94473 60670';
  const phoneSecondary = settings?.phone_secondary || '+91 90204 69647';
  const whatsappNumber = settings?.whatsapp_number || '+91 94473 60670';
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');
  const email = settings?.email || 'info@khair.in';
  const address = settings?.address_line || 'Kondotty / Kottakkal, Malappuram, Kerala, India';
  const locationDetails =
    settings?.location_details ||
    'Close to Calicut International Airport — Accessible by all means of transport with a calm and quiet environment for recovery and rest.';

  const workingHours =
    page?.content?.working_hours ||
    'Monday – Saturday: 8:00 AM – 7:00 PM | Sunday: Inpatient & Emergency Care';

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-khair-gold" />
            <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
              CONNECT WITH US
            </span>
            <span className="w-6 h-[1.5px] bg-khair-gold" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-khair-deepForest">
            Contact & Consultation
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            {page?.subtitle || 'We are here to assist your healing journey — from clinical appointments to residential rehabilitation planning.'}
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Phone */}
          <div className="p-6 rounded-3xl bg-khair-warmIvory/50 border border-khair-softBeige space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-khair-deepForest text-white flex items-center justify-center">
              <Phone className="w-5 h-5 text-khair-goldLight" />
            </div>
            <h3 className="font-serif text-base font-bold text-khair-deepForest">Phone Enquiries</h3>
            <div className="space-y-1 text-xs text-gray-700 font-medium">
              <a href={`tel:${phonePrimary.replace(/\s+/g, '')}`} className="block hover:text-khair-botanical">
                {phonePrimary}
              </a>
              {phoneSecondary && (
                <a href={`tel:${phoneSecondary.replace(/\s+/g, '')}`} className="block hover:text-khair-botanical">
                  {phoneSecondary}
                </a>
              )}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="p-6 rounded-3xl bg-khair-warmIvory/50 border border-khair-softBeige space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-khair-deepForest">WhatsApp Desk</h3>
            <p className="text-xs text-gray-600">Quick consultations and international patient assistance.</p>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs font-bold text-emerald-700 hover:underline"
            >
              Chat on {whatsappNumber} →
            </a>
          </div>

          {/* Email */}
          <div className="p-6 rounded-3xl bg-khair-warmIvory/50 border border-khair-softBeige space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-khair-botanical text-white flex items-center justify-center">
              <Mail className="w-5 h-5 text-khair-goldLight" />
            </div>
            <h3 className="font-serif text-base font-bold text-khair-deepForest">Official Email</h3>
            <p className="text-xs text-gray-600">For reports, queries and general correspondences.</p>
            <a href={`mailto:${email}`} className="text-xs font-bold text-khair-deepForest hover:underline">
              {email}
            </a>
          </div>

          {/* Timings */}
          <div className="p-6 rounded-3xl bg-khair-warmIvory/50 border border-khair-softBeige space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-khair-goldDark text-white flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-khair-deepForest">Working Hours</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {workingHours}
            </p>
          </div>

        </div>

        {/* Location & Interactive Forms Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Appointment Booking (Primary Conversion) */}
          <div className="lg:col-span-7 space-y-8" id="book-appointment">
            <AppointmentForm locale={appLocale} departments={departments} />
          </div>

          {/* Right Column: Contact Message & Location Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contact Form */}
            <ContactForm locale={appLocale} />

            {/* Location Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-khair-deepForest text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-khair-goldLight flex-shrink-0" />
                <h3 className="font-serif text-lg font-bold">Hospital Location</h3>
              </div>
              <p className="text-xs text-khair-warmIvory/90 leading-relaxed font-normal">
                {address}
              </p>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-xs text-khair-warmIvory/80 leading-relaxed">
                <p className="font-semibold text-khair-goldLight mb-1">Accessibility Highlights:</p>
                <p>{locationDetails}</p>
              </div>
              <a
                href={settings?.google_maps_url || 'https://maps.google.com/?q=Kottakkal+Malappuram+Kerala'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-khair-goldLight hover:underline"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

