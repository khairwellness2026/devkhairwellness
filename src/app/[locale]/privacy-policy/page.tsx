import { notFound } from 'next/navigation';
import { isValidLocale, AppLocale } from '@/lib/i18n/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PrivacyPolicyPage({
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
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500">Effective Date: October 2026</p>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-khair-deepForest">1. Overview</h2>
            <p>
              At KHAIR International (Kottakkal Heritage Ayurveda and Integrated Rehabilitation), we hold patient confidentiality and personal privacy in the utmost regard. This Privacy Policy details how we handle information gathered through this website and our clinical consultation enquiry channels.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-khair-deepForest">2. Information Collected</h2>
            <p>
              When you submit a consultation booking or contact enquiry, we may collect your name, contact phone number, email address, preferred clinical department, and brief health details provided voluntarily to facilitate care coordination.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-khair-deepForest">3. Use of Personal Information</h2>
            <p>
              Your information is exclusively utilized by our authorized healthcare coordinators and clinical staff to schedule appointments, respond to enquiries, and prepare personalized treatment protocols. We never sell or share patient records with third-party advertisers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-khair-deepForest">4. Data Security & Storage</h2>
            <p>
              Patient enquiries are stored in a secure database protected by Supabase Row Level Security and encrypted transmissions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

