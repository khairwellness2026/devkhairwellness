import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';
import { getDepartments, getSeoMetadata } from '@/services/contentService';
import { ArrowRight, Leaf, Activity, Flower2, Heart, Stethoscope, HandHelping } from 'lucide-react';
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
  const seo = await getSeoMetadata('/departments', locale);

  return {
    title: seo?.title || 'Specialized Healthcare Departments | KHAIR International',
    description: seo?.description || 'Explore our clinical departments: Ayurveda, Physiotherapy, Naturopathy, Lifestyle Clinic, and Ano-Rectal Care.',
  };
}

export default async function DepartmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) notFound();
  const appLocale = locale as AppLocale;

  const departments = await getDepartments(appLocale);

  const getIcon = (slug: string) => {
    switch (slug) {
      case 'ayurveda-treatments':
        return <Leaf className="w-6 h-6 text-khair-botanical" />;
      case 'physiotherapy-rehabilitation':
        return <Activity className="w-6 h-6 text-khair-botanical" />;
      case 'naturopathy-yoga':
        return <Flower2 className="w-6 h-6 text-khair-botanical" />;
      case 'lifestyle-clinic':
        return <Heart className="w-6 h-6 text-khair-botanical" />;
      case 'advanced-ano-rectal-clinic':
        return <Stethoscope className="w-6 h-6 text-khair-botanical" />;
      case 'occupational-therapy':
        return <HandHelping className="w-6 h-6 text-khair-botanical" />;
      default:
        return <Leaf className="w-6 h-6 text-khair-botanical" />;
    }
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-khair-gold" />
            <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
              CLINICAL SPECIALITIES
            </span>
            <span className="w-6 h-[1.5px] bg-khair-gold" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-khair-deepForest">
            Our Clinical Departments
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Integrated healthcare combining time-tested Kottakkal Ayurvedic remedies with evidence-based physical and occupational rehabilitation.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-khair-warmIvory/30 rounded-3xl overflow-hidden border border-khair-softBeige hover:border-khair-gold/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Department Image */}
                {dept.featured_image && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-khair-softBeige/40">
                    <img
                      src={dept.featured_image}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 w-10 h-10 rounded-xl bg-white/95 shadow-md flex items-center justify-center">
                      {getIcon(dept.slug)}
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="font-serif text-xl font-bold text-khair-deepForest group-hover:text-khair-botanical transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {dept.short_description}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 sm:px-7 pb-6 pt-2 border-t border-khair-softBeige/60">
                <a
                  href={`/${appLocale}/departments/${dept.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-khair-deepForest group-hover:text-khair-botanical transition-colors"
                >
                  <span>Explore Department & Treatments</span>
                  <ArrowRight className="w-3.5 h-3.5 text-khair-goldDark rtl:rotate-180" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

