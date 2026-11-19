import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';
import { getPageContent, getSiteSettings, getSeoMetadata } from '@/services/contentService';
import { Sparkles, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
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
  const seo = await getSeoMetadata('/about', locale);

  return {
    title: seo?.title || 'About Us | KHAIR International — Ayurvedic Rehabilitation Hospital',
    description: seo?.description || 'Learn about KHAIR International, Kottakkal heritage Ayurveda, and integrated medical rehabilitation.',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) notFound();
  const appLocale = locale as AppLocale;

  const [page, settings] = await Promise.all([
    getPageContent('about', appLocale),
    getSiteSettings(),
  ]);

  if (!page) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-khair-softBeige shadow-xs space-y-2">
          <p className="font-serif text-lg font-bold text-khair-deepForest">About Page</p>
          <p className="text-xs text-gray-500">
            About page content has not been published yet. Run the Supabase seed script or configure via the Admin CMS.
          </p>
        </div>
      </div>
    );
  }

  const content = page.content || {};
  const values = Array.isArray(content.values) ? content.values : [];
  const facilities = Array.isArray(content.facilities) ? content.facilities : [];

  return (
    <div className="bg-white">
      
      {/* Editorial Page Header */}
      <section className="relative py-20 bg-gradient-to-b from-khair-warmIvory/60 via-white to-white border-b border-khair-softBeige/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-khair-gold" />
            <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
              ABOUT OUR CENTRE
            </span>
            <span className="w-6 h-[1.5px] bg-khair-gold" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-khair-deepForest">
            {page.title}
          </h1>

          {page.subtitle && (
            <p className="font-serif italic text-lg sm:text-xl text-khair-goldDark">
              {page.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Brand Story & Philosophy */}
      {content.story && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Facility & Heritage Showcase Image */}
            <div className="lg:col-span-6 relative">
              {page.featured_image ? (
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-khair-gold/30 bg-[#FAF7EF] p-2 sm:p-2.5">
                  <div className="relative rounded-2xl overflow-hidden bg-white">
                    <img
                      src={page.featured_image}
                      alt={page.title || "KHAIR International Hospital"}
                      className="w-full h-auto object-contain block rounded-2xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-khair-gold/20 aspect-[16/9] bg-khair-warmIvory/60 flex items-center justify-center p-8 text-center">
                  <div className="space-y-2">
                    <p className="font-serif text-2xl font-bold text-khair-deepForest">{page.title}</p>
                    <p className="text-xs text-gray-500">Ayurveda, Physiotherapy &amp; Rehabilitation</p>
                  </div>
                </div>
              )}
              
              {/* Overlay Emblem Badge */}
              {settings?.emblem_url && (
                <div className="hidden sm:flex absolute -bottom-5 -right-5 rtl:-right-auto rtl:-left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-khair-gold/40 items-center gap-3">
                  <img
                    src={settings.emblem_url}
                    alt={settings.site_name || "KHAIR Emblem"}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <span className="block text-xs font-bold text-khair-deepForest">Kottakkal, Kerala</span>
                    <span className="block text-[10px] text-gray-500">Ayurvedic Rehabilitation Hospital</span>
                  </div>
                </div>
              )}
            </div>

            {/* Story Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-khair-deepForest leading-tight">
                Where Ancient Heritage Converges with Modern Science
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                {content.story}
              </p>
              {content.philosophy && (
                <div className="p-5 rounded-2xl bg-khair-warmIvory/60 border border-khair-gold/30 space-y-2">
                  <span className="text-xs font-bold text-khair-botanical uppercase tracking-wider block">
                    Healthcare Philosophy
                  </span>
                  <p className="text-xs sm:text-sm text-khair-charcoal leading-relaxed italic">
                    “{content.philosophy}”
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* Mission & Vision Cards */}
      {(content.mission || content.vision) && (
        <section className="py-16 bg-khair-warmIvory/40 border-t border-b border-khair-softBeige/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {content.mission && (
                <div className="bg-white rounded-3xl p-8 border border-khair-softBeige shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-khair-deepForest text-white flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-khair-goldLight" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-khair-deepForest">Our Mission</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {content.mission}
                  </p>
                </div>
              )}

              {content.vision && (
                <div className="bg-white rounded-3xl p-8 border border-khair-softBeige shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-khair-botanical text-white flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-khair-goldLight" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-khair-deepForest">Our Vision</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {content.vision}
                  </p>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      {values.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
              FOUNDATIONAL PILLARS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-khair-deepForest">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val: any, idx: number) => (
              <div
                key={idx}
                className="bg-khair-warmIvory/30 rounded-3xl p-6 border border-khair-softBeige hover:border-khair-gold/60 transition-all space-y-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-khair-gold/20 flex items-center justify-center text-khair-goldDark font-bold text-xs">
                  0{idx + 1}
                </div>
                <h4 className="font-serif text-lg font-bold text-khair-deepForest">{val.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Healthcare Facilities Checklist */}
      {facilities.length > 0 && (
        <section className="py-16 bg-khair-deepForest text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold tracking-widest uppercase text-khair-goldLight">
                  CLINICAL INFRASTRUCTURE
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  State-of-the-Art Healing Facilities
                </h2>
                <p className="text-xs sm:text-sm text-khair-warmIvory/80 leading-relaxed">
                  Every facility at KHAIR is purposefully engineered to provide a soothing, sanitized, and therapeutic environment for residential and outpatient care.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facilities.map((fac: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-khair-goldLight flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-khair-warmIvory">{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Consultation CTA */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-khair-deepForest">
          Begin Your Consultation with Our Medical Specialists
        </h2>
        <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Whether seeking neurological stroke recovery, pain management, authentic Ayurvedic panchakarma, or ano-rectal care, our clinical team is ready to evaluate your needs.
        </p>
        <div className="pt-2">
          <a
            href={`/${appLocale}/contact#book-appointment`}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-full shadow-lg transition-all"
          >
            <span>Book a Consultation Today</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180 text-khair-goldLight" />
          </a>
        </div>
      </section>

    </div>
  );
}
