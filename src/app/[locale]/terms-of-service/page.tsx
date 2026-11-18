import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  if (!isValidLocale(locale)) notFound();

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 border-b border-khair-softBeige pb-6">
          <span className="text-xs font-bold tracking-widest uppercase text-khair-botanical">
            LEGAL INFORMATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-khair-deepForest">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-500">Effective Date: October 2026</p>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-khair-deepForest">1. Website Purpose</h2>
            <p>
              This website provides general institutional information regarding the clinical services, departments, and rehabilitation programs of KHAIR International. The information provided does not constitute direct medical advice or a formal diagnosis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-khair-deepForest">2. Consultation Enquiries</h2>
            <p>
              Submitting an appointment enquiry through this website represents an initial request for evaluation. Appointments are formally confirmed solely after consultation with our patient coordination desk.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-khair-deepForest">3. Intellectual Property</h2>
            <p>
              The official KHAIR emblem, branding, typography, brochure content, and photographs are proprietary assets of KHAIR International and protected by applicable copyright laws.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

