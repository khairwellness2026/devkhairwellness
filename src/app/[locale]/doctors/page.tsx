import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';
import { getDoctors, getDepartments, getSeoMetadata } from '@/services/contentService';
import { User, ArrowRight, Award, GraduationCap, Calendar } from 'lucide-react';
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
  const seo = await getSeoMetadata('/doctors', locale);

  return {
    title: seo?.title || 'Medical Experts & Specialists | KHAIR International',
    description: seo?.description || 'Meet our qualified clinical team of Ayurveda physicians and rehabilitation consultants.',
  };
}

export default async function DoctorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) notFound();
  const appLocale = locale as AppLocale;

  const doctors = await getDoctors(appLocale);

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-khair-gold" />
            <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
              CLINICAL TEAM
            </span>
            <span className="w-6 h-[1.5px] bg-khair-gold" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-khair-deepForest">
            Meet Our Medical Experts
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Senior Ayurveda physicians, neurological rehabilitation consultants, and physiotherapists dedicated to personalized patient recovery.
          </p>
        </div>

        {/* Doctors Grid */}
        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-khair-warmIvory/30 rounded-3xl p-7 border border-khair-softBeige hover:border-khair-gold/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-khair-gold/40 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner group-hover:border-khair-deepForest transition-colors">
                      {doc.photo_url && doc.photo_url.includes('/') && !doc.photo_url.includes('emblem') ? (
                        <img src={doc.photo_url} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-khair-botanical" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-khair-deepForest group-hover:text-khair-botanical transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-bold text-khair-goldDark">
                        {doc.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span>{doc.qualifications}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{doc.experience_years}+ Years Clinical Practice</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-6">
                    {doc.biography}
                  </p>
                </div>

                <div className="pt-4 border-t border-khair-softBeige/60 flex items-center justify-between">
                  <a
                    href={`/${appLocale}/doctors/${doc.slug}`}
                    className="text-xs font-bold text-khair-deepForest group-hover:text-khair-botanical flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-khair-goldDark rtl:rotate-180" />
                  </a>

                  <a
                    href={`/${appLocale}/contact#book-appointment`}
                    className="text-[11px] font-semibold px-3 py-1.5 bg-khair-deepForest text-white hover:bg-khair-darkGreen rounded-full shadow-xs"
                  >
                    Consult
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-khair-warmIvory/40 rounded-3xl border border-khair-softBeige p-8 max-w-xl mx-auto space-y-3">
            <User className="w-10 h-10 text-khair-botanical mx-auto" />
            <h3 className="font-serif text-lg font-bold text-khair-deepForest">Doctor Profiles</h3>
            <p className="text-xs text-gray-500">
              Verified clinical consultant profiles are being updated through the administrative directory.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

