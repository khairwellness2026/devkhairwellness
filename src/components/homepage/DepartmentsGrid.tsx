import { AppLocale } from '@/lib/i18n/config';
import { Department } from '@/types';
import { ArrowRight, Leaf, Activity, Heart, Stethoscope, HandHelping } from 'lucide-react';

interface DepartmentsGridProps {
  locale: AppLocale;
  departments: Department[];
}

function ZenStonesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="18" rx="6.5" ry="2.75" />
      <ellipse cx="12" cy="12" rx="4.5" ry="2.25" />
      <ellipse cx="12" cy="7" rx="3" ry="1.75" />
    </svg>
  );
}

export default function DepartmentsGrid({ locale, departments }: DepartmentsGridProps) {
  const getIcon = (iconName: string, slug: string) => {
    switch (slug) {
      case 'ayurveda-treatments':       return <Leaf className="w-5 h-5 text-khair-botanical" />;
      case 'physiotherapy-rehabilitation': return <Activity className="w-5 h-5 text-khair-botanical" />;
      case 'naturopathy-yoga':          return <ZenStonesIcon className="w-5 h-5 text-khair-botanical" />;
      case 'lifestyle-clinic':          return <Heart className="w-5 h-5 text-khair-botanical" />;
      case 'advanced-ano-rectal-clinic': return <Stethoscope className="w-5 h-5 text-khair-botanical" />;
      case 'occupational-therapy':      return <HandHelping className="w-5 h-5 text-khair-botanical" />;
      default:                          return <Leaf className="w-5 h-5 text-khair-botanical" />;
    }
  };

  const displayDepts = departments.slice(0, 5);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-khair-gold" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-khair-deepForest">
              OUR DEPARTMENTS
            </span>
            <span className="w-8 h-[1px] bg-khair-gold" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-khair-deepForest leading-tight">
            Comprehensive Care for Your{' '}
            <span className="italic font-normal text-khair-goldDark font-serif">Complete Wellbeing</span>
          </h2>
        </div>

        {/* Cards — 2 col on mobile, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {displayDepts.map((dept) => (
            <a
              key={dept.id}
              href={`/${locale}/departments/${dept.slug}`}
              className="bg-[#FAF7EF] rounded-[20px] sm:rounded-[24px] border border-khair-softBeige/90 shadow-[0_4px_20px_-4px_rgba(7,61,44,0.07)] flex flex-col overflow-hidden"
            >
              {/* ── IMAGE AREA ── */}
              <div className="relative w-full flex-shrink-0" style={{ height: 'clamp(140px, 30vw, 260px)' }}>
                {dept.featured_image ? (
                  <img
                    src={dept.featured_image}
                    alt={dept.name}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-khair-warmIvory to-khair-softBeige/60 p-4 text-center">
                    <span className="text-[10px] font-semibold text-khair-deepForest/70 uppercase tracking-wider">
                      {dept.name}
                    </span>
                  </div>
                )}
              </div>

              {/* ── TEXT BODY — icon badge overlaps image/card boundary ── */}
              <div className="relative flex flex-col flex-1 px-3 sm:px-5 pb-2 pt-6">
                {/* Icon badge: straddles image/text border */}
                <div className="absolute -top-[18px] left-3 sm:left-4 rtl:left-auto rtl:right-3 sm:rtl:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white shadow-sm border border-khair-gold/40 flex items-center justify-center text-khair-botanical z-10">
                  {getIcon(dept.icon, dept.slug)}
                </div>
                <h3 className="font-serif text-[13px] sm:text-[16px] lg:text-[17px] font-bold text-khair-deepForest leading-snug mb-1">
                  {dept.name}
                </h3>
                <p className="text-[10px] sm:text-[11.5px] text-khair-charcoal/75 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {dept.short_description}
                </p>
              </div>

              {/* ── ARROW BUTTON ── */}
              <div className="px-3 sm:px-5 pb-4 sm:pb-5 pt-2 flex justify-end">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-khair-gold/60 text-khair-goldDark flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 rtl:rotate-180" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

