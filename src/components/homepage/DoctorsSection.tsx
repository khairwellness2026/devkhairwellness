import { AppLocale } from '@/lib/i18n/config';
import { Doctor } from '@/types';
import { ArrowRight, User } from 'lucide-react';

interface DoctorsSectionProps {
  locale: AppLocale;
  doctors: Doctor[];
}

export default function DoctorsSection({ locale, doctors }: DoctorsSectionProps) {
  const displayDoctors = doctors.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-khair-gold" />
              <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
                OUR DOCTORS
              </span>
              <span className="w-6 h-[1.5px] bg-khair-gold" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-khair-deepForest">
              Meet Our Experts
            </h2>
          </div>

          <a
            href={`/${locale}/doctors`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-khair-deepForest bg-khair-warmIvory hover:bg-khair-softBeige/60 border border-khair-gold/40 rounded-full transition-all group"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-3.5 h-3.5 text-khair-goldDark group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180 transition-transform" />
          </a>
        </div>

        {/* Doctor Cards */}
        {displayDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayDoctors.map((doc) => (
              <a
                key={doc.id}
                href={`/${locale}/doctors/${doc.slug}`}
                className="group bg-khair-warmIvory/40 hover:bg-white rounded-3xl p-6 border border-khair-softBeige hover:border-khair-gold/60 shadow-xs hover:shadow-xl transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* Doctor Avatar / Icon Frame */}
                  <div className="w-14 h-14 rounded-full bg-white border border-khair-gold/40 flex items-center justify-center text-khair-botanical overflow-hidden flex-shrink-0 shadow-inner group-hover:border-khair-deepForest transition-colors">
                    {doc.photo_url && doc.photo_url.includes('/') && !doc.photo_url.includes('emblem') ? (
                      <img src={doc.photo_url} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-khair-botanical" />
                    )}
                  </div>

                  {/* Doctor Details */}
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-khair-deepForest group-hover:text-khair-botanical transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-khair-goldDark mb-0.5">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {doc.qualifications}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {doc.experience_years}+ Years Experience
                    </p>
                  </div>
                </div>

                {/* Arrow Pill */}
                <div className="w-8 h-8 rounded-full bg-khair-gold/15 group-hover:bg-khair-deepForest text-khair-goldDark group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-khair-warmIvory/30 rounded-3xl border border-khair-softBeige p-8 space-y-2">
            <User className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-xs text-gray-500">
              No doctors published yet. Add doctor profiles from the admin dashboard or run the seed script.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
