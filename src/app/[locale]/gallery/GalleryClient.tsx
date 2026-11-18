'use client';

import { useState } from 'react';
import { AppLocale } from '@/lib/i18n/config';
import { GalleryCategory, GalleryImage } from '@/types';
import { X, ZoomIn, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface GalleryClientProps {
  locale: AppLocale;
  categories: GalleryCategory[];
  images: GalleryImage[];
}

export default function GalleryClient({ locale, categories, images }: GalleryClientProps) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    selectedCat === 'all'
      ? images
      : images.filter((img) => img.category_slug === selectedCat);

  const activeImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  const handleNext = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else {
      setLightboxIndex(0);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else {
      setLightboxIndex(filteredImages.length - 1);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCat('all')}
          className={`px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            selectedCat === 'all'
              ? 'bg-khair-deepForest text-white shadow-md'
              : 'bg-khair-warmIvory text-khair-charcoal hover:bg-khair-softBeige border border-khair-softBeige'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCat(cat.slug)}
            className={`px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              selectedCat === cat.slug
                ? 'bg-khair-deepForest text-white shadow-md'
                : 'bg-khair-warmIvory text-khair-charcoal hover:bg-khair-softBeige border border-khair-softBeige'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-khair-softBeige/30 border border-khair-softBeige shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={img.image_url}
                alt={img.alt_text}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold">{img.title}</h4>
                  {img.caption && <p className="text-[10px] text-gray-200 line-clamp-1">{img.caption}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-khair-warmIvory/30 rounded-3xl border border-khair-softBeige p-8">
          <p className="text-xs text-gray-500">No images published in this category yet.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={activeImage.image_url}
              alt={activeImage.alt_text}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <h3 className="font-serif text-lg font-bold">{activeImage.title}</h3>
              {activeImage.caption && (
                <p className="text-xs text-gray-300 max-w-lg">{activeImage.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

