import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';
import { getDoctorBySlug, getDepartments } from '@/services/contentService';
import AppointmentForm from '@/components/forms/AppointmentForm';
import { ArrowLeft, User, Award, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as AppLocale;
  const doc = await getDoctorBySlug(resolvedParams.slug, locale);

  if (!doc) return { title: 'Doctor Not Found' };

  return {
    title: `${doc.name} — ${doc.specialization} | KHAIR International`,
    description: doc.biography,
  };
}

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  if (!isValidLocale(locale)) notFound();
  const appLocale = locale as AppLocale;

  const [doc, allDepts] = await Promise.all([
    getDoctorBySlug(slug, appLocale),
    getDepartments(appLocale),
  ]);

  if (!doc) notFound();

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <div>
          <a
            href={`/${appLocale}/doctors`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-khair-botanical hover:text-khair-deepForest transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>Back to All Doctors</span>
          </a>
        </div>

        {/* Profile Card & Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Doctor Overview */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl bg-khair-warmIvory/50 border border-khair-softBeige">
              <div className="w-24 h-24 rounded-2xl bg-white border border-khair-gold/40 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                {doc.photo_url && doc.photo_url.includes('/') && !doc.photo_url.includes('emblem') ? (
                  <img src={doc.photo_url} alt={doc.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-khair-botanical" />
                )}
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold tracking-widest uppercase text-khair-goldDark">
                  CLINICAL SPECIALIST
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-khair-deepForest">
                  {doc.name}
                </h1>
                <p className="text-sm font-bold text-khair-botanical">
                  {doc.specialization}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-khair-goldDark" />
                    {doc.qualifications}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-khair-goldDark" />
                    {doc.experience_years}+ Years Experience
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-khair-deepForest">
                Professional Biography & Clinical Experience
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal whitespace-pre-line">
                {doc.biography}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-khair-softBeige shadow-xs space-y-3">
              <h3 className="font-serif text-lg font-bold text-khair-deepForest">
                Clinical Focus Areas
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-khair-botanical flex-shrink-0" />
                  <span>Holistic Clinical Assessment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-khair-botanical flex-shrink-0" />
                  <span>Individualized Care Pathways</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-khair-botanical flex-shrink-0" />
                  <span>Integrated Inpatient Monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-khair-botanical flex-shrink-0" />
                  <span>Evidence-Based Rehabilitation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Consultation Booking Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <AppointmentForm
                locale={appLocale}
                departments={allDepts}
                defaultDepartmentSlug={doc.department_id}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

