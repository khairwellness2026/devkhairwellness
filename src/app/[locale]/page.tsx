import { notFound } from 'next/navigation';
import { LOCALES, isValidLocale, AppLocale } from '@/lib/i18n/config';
import {
  getHomepageSections,
  getDepartments,
  getDoctors,
  getGalleryImages,
  getSiteSettings,
  getSeoMetadata,
} from '@/services/contentService';
import HeroSection from '@/components/homepage/HeroSection';
import DepartmentsGrid from '@/components/homepage/DepartmentsGrid';
import WhyChooseSection from '@/components/homepage/WhyChooseSection';
import DoctorsSection from '@/components/homepage/DoctorsSection';
import GalleryPreviewSection from '@/components/homepage/GalleryPreviewSection';
import AppointmentCtaSection from '@/components/homepage/AppointmentCtaSection';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as AppLocale;
  const seo = await getSeoMetadata('/', locale);

  return {
    title: seo?.title || 'KHAIR International — Ayurveda, Physiotherapy & Holistic Wellbeing',
    description:
      seo?.description ||
      'A modern centre for Ayurveda, Physiotherapy and Holistic Rehabilitation in Kottakkal, Kerala.',
    openGraph: {
      title: seo?.og_title || 'KHAIR International',
      description: seo?.og_description || 'Your Journey Back to Wellbeing',
      images: seo?.og_image ? [{ url: seo.og_image }] : [],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;

  const [sections, departments, doctors, galleryImages, settings] = await Promise.all([
    getHomepageSections(appLocale),
    getDepartments(appLocale),
    getDoctors(appLocale),
    getGalleryImages(appLocale),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection locale={appLocale} section={sections['hero']} />

      {/* 2. Departments Grid */}
      <DepartmentsGrid locale={appLocale} departments={departments} />

      {/* 4. Why Choose KHAIR */}
      <WhyChooseSection locale={appLocale} section={sections['why_choose']} />

      {/* 5. Doctors / Meet Our Experts */}
      <DoctorsSection locale={appLocale} doctors={doctors} />

      {/* 6. Gallery Preview */}
      <GalleryPreviewSection locale={appLocale} images={galleryImages} />

      {/* 7. Appointment CTA Banner */}
      <AppointmentCtaSection
        locale={appLocale}
        section={sections['appointment_cta']}
        settings={settings}
      />
    </div>
  );
}
