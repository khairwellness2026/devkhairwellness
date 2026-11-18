import { AppLocale } from '@/lib/i18n/config';
import { HomepageSection, SiteSettings } from '@/types';
import { ArrowRight, MessageCircle } from 'lucide-react';

interface AppointmentCtaProps {
  locale: AppLocale;
  section?: HomepageSection;
  settings?: SiteSettings | null;
}

export default function AppointmentCtaSection({ locale, section, settings }: AppointmentCtaProps) {
  const subtitle = section?.subtitle || 'START YOUR HEALING JOURNEY';
  const title = section?.title || 'Book a Consultation Today';
  const description =
    section?.description ||
    'Take the first step towards healing, recovery and lasting wellbeing.';
  
  const whatsappNumber = settings?.whatsapp_number || '+91 94473 60670';
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-khair-darkGreen via-khair-deepForest to-khair-darkGreen rounded-[2.5rem] p-8 sm:p-12 lg:p-14 shadow-2xl border border-khair-gold/30">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-khair-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text Block */}
          <div className="space-y-3 text-center lg:text-left rtl:lg:text-right max-w-2xl">
            <span className="text-xs font-bold tracking-widest uppercase text-khair-goldLight block">
              {subtitle}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-khair-warmIvory/80 leading-relaxed font-light">
              {description}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0 w-full sm:w-auto">
            {/* Book Appointment Gold Button */}
            <a
              href={`/${locale}/contact#book-appointment`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm font-bold text-khair-deepForest bg-gradient-to-r from-khair-goldLight via-khair-gold to-khair-goldDark hover:brightness-105 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>

            {/* WhatsApp Green Pill */}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello KHAIR International, I would like to enquire about consultation.')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

