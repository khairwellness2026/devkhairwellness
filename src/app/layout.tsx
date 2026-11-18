import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Amiri } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  adjustFontFallback: false,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false,
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-amiri',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'KHAIR International — Ayurveda, Physiotherapy & Holistic Wellbeing',
  description:
    'A modern centre for Ayurveda, Physiotherapy and Holistic Rehabilitation in Kottakkal, Kerala. Time-honoured Kottakkal heritage meets evidence-based modern rehabilitation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${inter.variable} ${amiri.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-white text-khair-charcoal selection:bg-khair-gold/20 selection:text-khair-deepForest min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
