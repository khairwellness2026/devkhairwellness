import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';
import { getGalleryCategories, getGalleryImages, getSeoMetadata } from '@/services/contentService';
import GalleryClient from './GalleryClient';
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
  const seo = await getSeoMetadata('/gallery', locale);

  return {
    title: seo?.title || 'Facilities & Treatment Gallery | KHAIR International',
    description: seo?.description || 'Explore the healing environment, therapy rooms and gardens at KHAIR International in Kottakkal, Kerala.',
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) notFound();
  const appLocale = locale as AppLocale;

  const [categories, images] = await Promise.all([
    getGalleryCategories(appLocale),
    getGalleryImages(appLocale),
  ]);

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[1.5px] bg-khair-gold" />
            <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
              VISUAL GLIMPSE
            </span>
            <span className="w-6 h-[1.5px] bg-khair-gold" />
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-khair-deepForest">
            Centre & Facilities Gallery
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Immerse yourself in our tranquil healing sanctuary — from specialized therapy chambers and rehabilitation gymnasiums to serene botanical walking grounds.
          </p>
        </div>

        {/* Interactive Filterable Gallery Client Component */}
        <GalleryClient
          locale={appLocale}
          categories={categories}
          images={images}
        />

      </div>
    </div>
  );
}

