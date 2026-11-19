import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';
import { getDepartmentBySlug, getDepartments } from '@/services/contentService';
import AppointmentForm from '@/components/forms/AppointmentForm';
import {
  CheckCircle2, ArrowRight, ChevronRight,
  Leaf, Activity, Heart, Stethoscope, HandHelping, Sparkles, Shield, Award,
  Phone, Calendar, Clock, MapPin, Check
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

      {/* ── 1. PRESTIGIOUS CLINICAL HERO BANNER ─────────────────────────────────────────────── */}
      <section className={`relative w-full overflow-hidden text-white py-16 sm:py-24 border-b border-khair-gold/30 ${(dept.hero_banner_url || dept.hero_mobile_banner_url) ? 'bg-[#03231A]' : 'bg-gradient-to-br from-[#03231A] via-[#073D2C] to-[#0A4B37]'}`}>

        {/* Custom banner images */}
        {(dept.hero_banner_url || dept.hero_mobile_banner_url) ? (
          <>
            {/* Desktop banner */}
            {dept.hero_banner_url ? (
              <img
                src={dept.hero_banner_url}
                alt={dept.name}
                className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />
            ) : null}

            {/* Mobile banner — prefers mobile image, falls back to desktop image */}
            {(dept.hero_mobile_banner_url || dept.hero_banner_url) ? (
              <img
                src={dept.hero_mobile_banner_url || dept.hero_banner_url}
                alt={dept.name}
                className="block sm:hidden absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />
            ) : null}

            {/* Transparent readability overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/15 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
          </>
        ) : (
          /* Default gradient ambiance (only when no custom banner is set) */
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-khair-gold/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-khair-botanical/25 blur-3xl pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-khair-gold/15 blur-3xl pointer-events-none" />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/25 backdrop-blur-md border border-white/15 text-white/75 text-xs font-medium mb-6">
            <a href={`/${appLocale}`} className="hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <a href={`/${appLocale}/departments`} className="hover:text-white transition-colors">Departments</a>
            <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            <span className="text-khair-goldLight font-semibold">{dept.name}</span>
          </nav>

          <div className="max-w-3xl space-y-6">
            
            {/* Clinical Specialty Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-khair-gold animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-khair-goldLight">
                CLINICAL SPECIALTY &amp; REHABILITATION
              </span>
            </div>

            {/* Department Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-[1.12] drop-shadow-md">
              {dept.name}
            </h1>

            {/* Short Tagline Description */}
            <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal max-w-2xl drop-shadow-sm">
              {dept.short_description}
            </p>

            {/* Clinical Highlights Pills */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-white">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/20 backdrop-blur-md shadow-xs">
                <Shield className="w-3.5 h-3.5 text-khair-gold" />
                Evidence-Based Protocols
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/20 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-khair-gold" />
                Kottakkal Heritage Ayurveda
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/30 border border-white/20 backdrop-blur-md shadow-xs">
                <Award className="w-3.5 h-3.5 text-khair-gold" />
                Certified Specialists
              </span>
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#book-consultation"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-bold text-khair-deepForest bg-gradient-to-r from-khair-gold via-khair-goldLight to-khair-gold hover:opacity-95 rounded-full shadow-lg shadow-black/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </a>
              <a
                href="#treatments"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-full transition-all backdrop-blur-md cursor-pointer"
              >
                <span>Explore Therapies</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ── 2. DEPARTMENT OVERVIEW & PHILOSOPHY (Full-Width Editorial Layout) ───────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* LEFT: Featured Department Image Showcase (Full Uncropped Image) */}
            {dept.featured_image ? (
              <div className="lg:col-span-6">
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-khair-gold/30 shadow-[0_12px_36px_-10px_rgba(7,61,44,0.12)] bg-[#FAF7EF] p-2.5 sm:p-3 transition-all">
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-white/80">
                    <img
                      src={dept.featured_image}
                      alt={`${dept.name} - KHAIR Clinical Care`}
                      className="w-full h-auto object-contain block rounded-xl sm:rounded-2xl"
                    />
                  </div>
                  {/* Clean caption strip placed below the photo so 100% of the image is unobstructed */}
                  <div className="px-3 pt-3 pb-1 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-khair-botanical/10 text-khair-botanical flex items-center justify-center flex-shrink-0">
                        <DeptIcon slug={dept.slug} />
                      </div>
                      <span className="font-semibold text-khair-deepForest">{dept.name}</span>
                    </div>
                    <span className="text-[11px] text-khair-goldDark font-medium">Centre of Clinical Excellence</span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* RIGHT: Clinical Approach & Narrative */}
            <div className={dept.featured_image ? "lg:col-span-6 space-y-6" : "lg:col-span-10 lg:mx-auto space-y-6"}>
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2.5">
                  <span className="w-6 h-[2px] bg-khair-gold" />
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-khair-botanical">
                    CLINICAL CARE OVERVIEW
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-khair-deepForest leading-tight">
                  Holistic Philosophy Meets Precision Healthcare
                </h2>
              </div>

              {/* Callout Quote */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FBF9F3] border-l-4 border-khair-gold shadow-xs">
                <p className="font-serif text-sm sm:text-base text-khair-deepForest leading-relaxed italic">
                  "{dept.short_description}"
                </p>
              </div>

              {/* In-Depth Description */}
              {dept.full_description && (
                <div className="text-gray-700 leading-relaxed text-sm sm:text-[15px] space-y-4">
                  <p className="whitespace-pre-line leading-7 text-gray-700">
                    {dept.full_description}
                  </p>
                </div>
              )}

              {/* Clinical Highlights Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Personalized Patient Evaluation',
                  'Kottakkal Herbal Pharmacopeia',
                  'Multidisciplinary Team Reviews',
                  'Continuity of Post-Care Rehabilitation',
                ].map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-khair-deepForest">
                    <div className="w-5 h-5 rounded-full bg-khair-botanical/15 text-khair-botanical flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ── 3. SPECIALISED TREATMENT PROTOCOLS ────────────────────────────────────────────── */}
      {dept.treatments && dept.treatments.length > 0 && (
        <section id="treatments" className="py-16 sm:py-24 bg-[#FAF7EF] border-y border-khair-gold/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center justify-center gap-2.5">
                <span className="w-6 h-[1.5px] bg-khair-gold" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-khair-goldDark">
                  TREATMENT PROTOCOLS
                </span>
                <span className="w-6 h-[1.5px] bg-khair-gold" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-khair-deepForest">
                Specialised Therapies &amp; Clinical Protocols
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Evidence-based regimens customized by senior medical consultants to address your symptoms, root causes, and sustained wellbeing.
              </p>
            </div>

            {/* Treatments Grid — clean, spacious 2 or 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {dept.treatments.map((treatment, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-khair-softBeige/90 hover:border-khair-gold/60 shadow-xs hover:shadow-lg transition-all duration-300 flex items-start gap-4 group cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-khair-deepForest group-hover:text-white transition-colors duration-300 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-mono font-bold text-khair-goldDark uppercase tracking-wider block">
                      Protocol #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-khair-deepForest group-hover:text-khair-botanical transition-colors leading-snug">
                      {treatment}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Treatment Guarantee Callout */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-khair-gold/30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-khair-goldDark flex-shrink-0 hidden sm:block" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-khair-deepForest">
                    Individualized Treatment Plans Designed Per Patient
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Each protocol is tailored to your unique Prakriti (constitution), clinical stage, and functional mobility goals.
                  </p>
                </div>
              </div>
              <a
                href="#book-consultation"
                className="px-5 py-2.5 text-xs font-bold text-khair-deepForest bg-khair-warmIvory hover:bg-khair-softBeige rounded-full border border-khair-gold/50 shadow-xs transition-colors flex-shrink-0"
              >
                Inquire About Therapy
              </a>
            </div>

          </div>
        </section>
      )}

      {/* ── 4. WHY CHOOSE THIS CLINICAL DEPARTMENT ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-khair-botanical">
              STANDARDS OF EXCELLENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-khair-deepForest">
              Why Patients Choose KHAIR {dept.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Shield,
                title: 'Evidence-Based Rigor',
                desc: 'Integrated modern diagnostic assessments combined with precise classical therapeutic measures.',
              },
              {
                icon: Leaf,
                title: 'Kottakkal Heritage',
                desc: 'Authentic botanical formulations, oils, and decoctions sourced directly from historic origins.',
              },
              {
                icon: Award,
                title: 'Certified Specialists',
                desc: 'Experienced senior physicians, licensed therapists, and empathetic healthcare facilitators.',
              },
              {
                icon: Activity,
                title: 'Holistic Continuum',
                desc: 'Comprehensive lifestyle adjustments, dietary counseling, and dedicated follow-up reviews.',
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-2xl border-t-2 border-t-khair-gold border border-khair-softBeige bg-[#FBF9F3]/70 p-6 space-y-3 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-khair-gold/40 flex items-center justify-center text-khair-botanical shadow-xs">
                  <pillar.icon className="w-5 h-5 text-khair-goldDark" />
                </div>
                <h3 className="font-serif text-base font-bold text-khair-deepForest">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. DEDICATED CONSULTATION BOOKING SECTION (Center-Stage Luxury Layout) ───────────── */}
      <section id="book-consultation" className="py-16 sm:py-24 bg-[#05261C] text-white relative overflow-hidden">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-khair-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-khair-botanical/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Direct Consultation Perks & Help Desk */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-khair-gold/40 text-[10px] font-bold tracking-[0.2em] uppercase text-khair-goldLight">
                  <Calendar className="w-3 h-3 text-khair-gold" />
                  <span>CONSULTATION INTAKE</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  Schedule a Consultation with our {dept.name} Team
                </h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Take the first step toward lasting vitality. Our clinical specialists will review your health history and recommend an individualized recovery pathway.
                </p>
              </div>

              {/* Clinical Assurance Items */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <Clock className="w-5 h-5 text-khair-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">Same-Day Appointment Confirmation</p>
                    <p className="text-white/70 text-xs mt-0.5">
                      Our patient care coordinator will call to confirm your preferred timing within business hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <Phone className="w-5 h-5 text-khair-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">Need Direct Clinical Guidance?</p>
                    <p className="text-white/70 text-xs mt-0.5">
                      Call our Kottakkal intake desk at <a href="tel:+919447360670" className="text-khair-goldLight font-bold underline">+91 94473 60670</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <MapPin className="w-5 h-5 text-khair-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white text-sm">KHAIR International Healthcare Centre</p>
                    <p className="text-white/70 text-xs mt-0.5">
                      Kottakkal, Malappuram, Kerala 676503, India
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Full-Framed Clean Form (Not Sticky, Dedicated Position) */}
            <div className="lg:col-span-7">
              <div className="shadow-2xl rounded-3xl overflow-hidden border border-khair-gold/40">
                <AppointmentForm
                  locale={appLocale}
                  departments={allDepts}
                  defaultDepartmentSlug={dept.slug}
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 6. EXPLORE OTHER CLINICAL DEPARTMENTS ────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-khair-botanical">
                  COMPREHENSIVE WELLBEING
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-khair-deepForest mt-1">
                  Explore Other Clinical Departments
                </h3>
              </div>
              <a
                href={`/${appLocale}/departments`}
                className="text-xs font-bold text-khair-goldDark hover:underline inline-flex items-center gap-1 flex-shrink-0"
              >
                <span>View All Departments</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </a>
            </div>

            {/* Horizontal slider on mobile, 3-column grid on tablet/desktop */}
            <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
              {related.map((rel) => (
                <a
                  key={rel.id}
                  href={`/${appLocale}/departments/${rel.slug}`}
                  className="group flex-shrink-0 w-[260px] xs:w-[280px] sm:w-auto snap-start flex flex-col justify-between p-6 rounded-2xl bg-[#FAF7EF] border border-khair-softBeige/90 hover:border-khair-gold/70 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <div className="space-y-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-khair-gold/40 flex items-center justify-center text-khair-botanical shadow-xs group-hover:bg-khair-deepForest group-hover:text-white transition-colors duration-300">
                      <DeptIcon slug={rel.slug} />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-khair-deepForest group-hover:text-khair-botanical transition-colors leading-snug">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {rel.short_description}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-khair-goldDark flex items-center gap-1 mt-5 pt-3.5 border-t border-khair-softBeige/60">
                    <span>Explore Department</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
                  </span>
                </a>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
