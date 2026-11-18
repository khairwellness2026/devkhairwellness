// KHAIR Hero Section — Mobile-first responsive
import { AppLocale } from '@/lib/i18n/config';
import { getUITranslations } from '@/lib/i18n/translations';
import { HomepageSection } from '@/types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  locale: AppLocale;
  section?: HomepageSection;
}

export default function HeroSection({ locale, section }: HeroProps) {
  const t = getUITranslations(locale);

  if (!section) {
    return (
      <section className="py-20 text-center bg-khair-warmIvory/30 border-b border-khair-softBeige">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-khair-softBeige shadow-xs space-y-2">
          <p className="font-serif text-lg font-bold text-khair-deepForest">Hero Section</p>
          <p className="text-xs text-gray-500">
            No homepage hero record found. Please configure via the Admin CMS.
          </p>
        </div>
      </section>
    );
  }

  const title = section.title || '';
  const subtitle = section.subtitle || '';
  const description = section.description || '';
  const ctaLabel = section.cta_label || t.bookAppointment;
  const ctaLink = section.cta_link || `/${locale}/contact#book-appointment`;
  const secondaryLabel = section.content?.secondary_cta_label || t.ourServices;
  const secondaryLink = section.content?.secondary_cta_link || `/${locale}/departments`;
  const heroImage = section.image_url;
  const mobileImage = section.mobile_image_url || section.metadata?.mobile_image_url || heroImage;

  const parts = title.split('Wellbeing');
  const hasWellbeing = title.includes('Wellbeing');

  return (
    <section
      className="relative w-full overflow-hidden flex items-start sm:items-center bg-khair-warmIvory"
      style={{ minHeight: '480px' }}
    >
      {/* Background images */}
      {(heroImage || mobileImage) ? (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          {mobileImage && (
            <img
              src={mobileImage}
              alt={title || 'KHAIR Integrative Healthcare'}
              className="block md:hidden w-full h-full object-cover object-center"
            />
          )}
          {heroImage && (
            <img
              src={heroImage}
              alt={title || 'KHAIR Integrative Healthcare'}
              className={`${mobileImage ? 'hidden md:block' : 'block'} w-full h-full object-cover object-right rtl:object-left`}
            />
          )}
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-khair-warmIvory" />
      )}



      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-14 sm:py-16 lg:py-20">
        <div className="w-full max-w-[280px] xs:max-w-xs sm:max-w-lg lg:max-w-xl space-y-4 sm:space-y-6">

          {/* Subtitle badge */}
          {subtitle && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-khair-gold/40 shadow-xs">
              <span className="w-4 h-[1.5px] bg-khair-gold flex-shrink-0" />
              <span className="text-[9px] sm:text-[11px] font-bold tracking-widest uppercase text-khair-botanical whitespace-nowrap">
                {subtitle}
              </span>
              <span className="w-4 h-[1.5px] bg-khair-gold flex-shrink-0" />
            </div>
          )}

          {/* Main heading — 2-line layout on mobile, single line on desktop */}
          {title && (
            <h1 className="font-serif text-[28px] xs:text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-khair-deepForest leading-[1.25] sm:leading-[1.12]">
              {hasWellbeing ? (
                <>
                  {/* Mobile: "Your Journey" on line 1, "Back to Wellbeing" on line 2 */}
                  {/* Desktop: all flows inline */}
                  <span className="block sm:inline">{parts[0].trim().split(' ').slice(0, 2).join(' ')}</span>
                  <span className="block sm:inline sm:before:content-['_']">
                    {parts[0].trim().split(' ').slice(2).join(' ')}{parts[0].trim().split(' ').slice(2).length > 0 ? ' ' : ''}
                    <span className="italic font-normal text-khair-botanical underline decoration-khair-gold/40 underline-offset-4 sm:underline-offset-8">
                      Wellbeing
                    </span>
                    {parts[1]}
                  </span>
                </>
              ) : (
                title
              )}
            </h1>
          )}

          {/* Description — hidden on small phones */}
          {description && (
            <p className="hidden sm:block text-sm sm:text-base text-khair-charcoal/85 leading-relaxed">
              {description}
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={ctaLink}
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-full shadow-lg transition-all"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-khair-goldLight rtl:rotate-180 flex-shrink-0" />
            </a>

            {secondaryLabel && (
              <a
                href={secondaryLink}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-khair-deepForest bg-white/90 hover:bg-white rounded-full border border-khair-gold/50 shadow-sm transition-all"
              >
                <span>{secondaryLabel}</span>
              </a>
            )}
          </div>

          {/* Trust accent — desktop only */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-khair-deepForest/85 font-medium">
            <Sparkles className="w-4 h-4 text-khair-goldDark flex-shrink-0" />
            <span>Kottakkal Heritage Ayurveda • Evidence-Based Modern Rehabilitation</span>
          </div>

        </div>
      </div>
    </section>
  );
}
