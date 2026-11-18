import { AppLocale } from '@/lib/i18n/config';
import { GalleryImage } from '@/types';
import { ArrowRight, Building2, Stethoscope, Flower2, Trees, Image as ImageIcon } from 'lucide-react';

interface GalleryPreviewProps {
  locale: AppLocale;
  images: GalleryImage[];
}

export default function GalleryPreviewSection({ locale, images }: GalleryPreviewProps) {
  const displayImages = images.slice(0, 4);

  const getPillIcon = (name: string = '') => {
    if (name.includes('Facilit')) return <Building2 className="w-3.5 h-3.5 text-khair-botanical" />;
    if (name.includes('Treat')) return <Stethoscope className="w-3.5 h-3.5 text-khair-botanical" />;
    if (name.includes('Activ')) return <Flower2 className="w-3.5 h-3.5 text-khair-botanical" />;
    return <Trees className="w-3.5 h-3.5 text-khair-botanical" />;
  };

  return (
    <section className="py-20 bg-khair-warmIvory/30 border-t border-b border-khair-softBeige/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="space-y-1.5 sm:space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-khair-gold" />
              <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
                GALLERY PREVIEW
              </span>
              <span className="w-6 h-[1.5px] bg-khair-gold" />
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-khair-deepForest">
              A Glimpse of Our Centre
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Explore our facilities, treatments and the care experience at KHAIR.
            </p>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <span className="sm:hidden text-[11px] text-khair-goldDark font-medium tracking-wide">
              Swipe to explore →
            </span>
            <a
              href={`/${locale}/gallery`}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold text-khair-deepForest bg-white hover:bg-khair-warmIvory border border-khair-gold/40 rounded-full shadow-xs transition-all group"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5 text-khair-goldDark group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform" />
            </a>
          </div>
        </div>

        {/* Real Database Image Cards — Horizontal slide in X axis on mobile, 4-col grid on desktop */}
        {displayImages.length > 0 ? (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
            {displayImages.map((img) => (
              <a
                key={img.id}
                href={`/${locale}/gallery`}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] bg-khair-softBeige/40 border border-khair-softBeige w-[76vw] xs:w-[68vw] sm:w-auto flex-shrink-0 snap-center"
              >
                {img.image_url ? (
                  <img
                    src={img.image_url}
                    alt={img.alt_text || img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-khair-softBeige/40">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Subtle Bottom Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Bottom Pill Badge */}
                <div className="absolute bottom-3.5 sm:bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-khair-softBeige shadow-md flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                  {getPillIcon(img.category_name || img.title)}
                  <span className="text-[11px] sm:text-xs font-bold text-khair-deepForest">
                    {img.category_name || img.title}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-khair-softBeige p-8 space-y-2">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-xs text-gray-500">
              No gallery images published yet. Upload images via the admin dashboard or run the seed script.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
