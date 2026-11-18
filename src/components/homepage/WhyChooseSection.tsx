import { AppLocale } from '@/lib/i18n/config';
import { HomepageSection } from '@/types';
import { ShieldCheck, Users, HeartHandshake, Building2 } from 'lucide-react';

interface WhyChooseProps {
  locale: AppLocale;
  section?: HomepageSection;
}

export default function WhyChooseSection({ locale, section }: WhyChooseProps) {
  if (!section || !section.is_visible) {
    return null;
  }

  const badge = section.subtitle;
  const heading = section.title;
  const rawPillars = Array.isArray(section.content) ? section.content : [];

  const getPillarIcon = (iconName?: string, idx: number = 0) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-khair-goldLight" />;
      case 'Users':
        return <Users className="w-5 h-5 text-khair-goldLight" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-khair-goldLight" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-khair-goldLight" />;
      default:
        const icons = [
          <ShieldCheck key="1" className="w-5 h-5 text-khair-goldLight" />,
          <Users key="2" className="w-5 h-5 text-khair-goldLight" />,
          <HeartHandshake key="3" className="w-5 h-5 text-khair-goldLight" />,
          <Building2 key="4" className="w-5 h-5 text-khair-goldLight" />,
        ];
        return icons[idx % 4];
    }
  };

  if (rawPillars.length === 0 && !heading) {
    return null;
  }

  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-khair-darkGreen via-khair-deepForest to-khair-darkGreen rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-khair-gold/20">
        
        {/* Subtle Decorative botanical curves */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-khair-botanical/10 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Title Column */}
          <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-white/15 pb-5 lg:pb-0 lg:pr-8 rtl:lg:pr-0 rtl:lg:pl-8">
            {badge && (
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-khair-goldLight">
                {badge}
              </span>
            )}
            {heading && (
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                {heading}
              </h2>
            )}
            {section.description && (
              <p className="text-xs text-khair-warmIvory/80 leading-relaxed font-light">
                {section.description}
              </p>
            )}
          </div>

          {/* Right Pillars Grid — 2 columns on mobile, 4 columns on desktop */}
          <div className="lg:col-span-8">
            {rawPillars.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {rawPillars.map((pillar: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-start space-y-1.5 sm:space-y-2 bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-white/5 sm:border-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                      {getPillarIcon(pillar.icon, idx)}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide leading-tight">
                      {pillar.title}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-khair-warmIvory/70 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-khair-warmIvory/60 text-center">
                Pillars content can be configured from the admin dashboard.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
