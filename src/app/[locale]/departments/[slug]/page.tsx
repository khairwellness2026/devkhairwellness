import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';
import { getDepartmentBySlug, getDepartments } from '@/services/contentService';
import AppointmentForm from '@/components/forms/AppointmentForm';
import {
  CheckCircle2, ArrowRight, ChevronRight,
  Leaf, Activity, Heart, Stethoscope, HandHelping, Sparkles, Shield, Award
} from 'lucide-react';
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
  const dept = await getDepartmentBySlug(resolvedParams.slug, locale);
  if (!dept) return { title: 'Department Not Found' };
  return {
    title: dept.meta_title || `${dept.name} | KHAIR International`,
    description: dept.meta_description || dept.short_description,
  };
}

function DeptIcon({ slug }: { slug: string }) {
  const cls = 'w-6 h-6';
  switch (slug) {
    case 'ayurveda-treatments':          return <Leaf className={cls} />;
    case 'physiotherapy-rehabilitation': return <Activity className={cls} />;
    case 'lifestyle-clinic':             return <Heart className={cls} />;
    case 'advanced-ano-rectal-clinic':   return <Stethoscope className={cls} />;
    case 'occupational-therapy':         return <HandHelping className={cls} />;
    default:                             return <Leaf className={cls} />;
  }
}

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  if (!isValidLocale(locale)) notFound();
  const appLocale = locale as AppLocale;

  const [dept, allDepts] = await Promise.all([
    getDepartmentBySlug(slug, appLocale),
    getDepartments(appLocale),
  ]);

  if (!dept) notFound();

  const related = allDepts.filter((d) => d.slug !== slug).slice(0, 3);

  return (
    <div className="bg-white min-h-screen">

      {/* ── PRESTIGIOUS CLINICAL HERO BANNER ─────────────────────────────────────────────── */}
      <section className="relative w-full bg-gradient-to-br from-[#03231A] via-[#073D2C] to-[#0A4B37] text-white overflow-hidden py-14 sm:py-20 border-b border-khair-gold/20">
        
        {/* Subtle ambient luxury background glows & pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-khair-gold/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-khair-botanical/20 blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-khair-gold/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-white/60 text-xs font-medium mb-6">
            <a href={`/${appLocale}`} className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <a href={`/${appLocale}/departments`} className="hover:text-white transition-colors">Departments</a>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-khair-gold font-semibold">{dept.name}</span>
          </nav>

          <div className="max-w-3xl space-y-5">
            
            {/* Clinical Specialty Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-khair-gold/40 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-khair-gold animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-khair-goldLight">
                CLINICAL SPECIALTY & REHABILITATION
              </span>
            </div>

            {/* Department Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              {dept.name}
            </h1>

            {/* Short Tagline Description */}
            <p className="text-base sm:text-lg text-white/85 leading-relaxed font-normal max-w-2xl">
              {dept.short_description}
            </p>

            {/* Clinical Highlights Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-white/90">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs">
                <Shield className="w-3.5 h-3.5 text-khair-gold" />
                Evidence-Based Protocols
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-khair-gold" />
                Kottakkal Heritage Ayurveda
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xs">
                <Award className="w-3.5 h-3.5 text-khair-gold" />
                Certified Specialists
              </span>
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#book"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 text-xs sm:text-sm font-bold text-khair-deepForest bg-khair-gold hover:bg-khair-goldLight rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
              <a
                href="#treatments"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all backdrop-blur-xs"
              >
                <span>Explore Therapies</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* LEFT: Featured Image Showcase + Description + Treatments + Related */}
          <div className="lg:col-span-7 space-y-10 sm:space-y-12">

            {/* Department Photo Showcase Card (Proper aspect ratio & sharp display) */}
            {dept.featured_image && (
              <div className="relative rounded-3xl overflow-hidden border border-khair-softBeige shadow-lg bg-khair-warmIvory/30 aspect-[16/10] sm:aspect-[16/9] group">
                <img
                  src={dept.featured_image}
                  alt={`${dept.name} Clinical Care Facility`}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                
                {/* Elegant bottom gradient badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-khair-deepForest/85 via-khair-deepForest/20 to-transparent flex items-end p-5 sm:p-7">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-sm border border-khair-gold/50 flex items-center justify-center text-khair-botanical shadow-sm">
                      <DeptIcon slug={dept.slug} />
                    </div>
                    <div>
                      <p className="text-white font-serif text-base sm:text-lg font-bold leading-tight">
                        {dept.name}
                      </p>
                      <p className="text-[11px] text-khair-goldLight font-medium">
                        Dedicated Clinical Facility &amp; Holistic Care Suite
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Section */}
            {dept.full_description && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-khair-gold" />
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-khair-botanical">
                    ABOUT THIS DEPARTMENT
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-khair-deepForest leading-snug">
                  Clinical Approach &amp; Care Philosophy
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line text-sm sm:text-[15px] leading-7">
                    {dept.full_description}
                  </p>
                </div>
              </div>
            )}

            {/* Key Clinical Treatments / Therapies */}
            {dept.treatments && dept.treatments.length > 0 && (
              <div id="treatments" className="bg-khair-warmIvory/60 rounded-3xl p-6 sm:p-8 border border-khair-gold/25 space-y-5">
                <div>
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-khair-goldDark">
                    TREATMENT PROTOCOLS
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-khair-deepForest mt-1">
                    Specialised Therapies &amp; Care Procedures
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {dept.treatments.map((treatment, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 bg-white rounded-xl px-4 py-3 border border-khair-softBeige shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-khair-botanical flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
                        {treatment}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose This Department — clinical metric cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Certified Physicians', value: '15+' },
                { label: 'Specialised Protocols', value: `${dept.treatments?.length ?? 10}+` },
                { label: 'Healing Heritage', value: '12+ Yrs' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-khair-softBeige bg-white p-4 sm:p-5 text-center shadow-xs"
                >
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-khair-deepForest">{stat.value}</p>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Related Departments */}
            {related.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-khair-softBeige">
                <h3 className="font-serif text-xl font-bold text-khair-deepForest">
                  Explore Other Clinical Departments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {related.map((rel) => (
                    <a
                      key={rel.id}
                      href={`/${appLocale}/departments/${rel.slug}`}
                      className="group flex flex-col gap-2 p-4 sm:p-5 rounded-2xl bg-khair-warmIvory/50 border border-khair-softBeige hover:border-khair-gold/60 hover:shadow-md transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-khair-gold/30 flex items-center justify-center text-khair-botanical">
                        <DeptIcon slug={rel.slug} />
                      </div>
                      <h4 className="font-serif text-sm font-bold text-khair-deepForest group-hover:text-khair-botanical leading-snug">
                        {rel.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-khair-goldDark flex items-center gap-1 mt-auto">
                        Learn more <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Consultation Appointment Form */}
          <div className="lg:col-span-5" id="book">
            <div className="sticky top-28">
              <AppointmentForm
                locale={appLocale}
                departments={allDepts}
                defaultDepartmentSlug={dept.slug}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
