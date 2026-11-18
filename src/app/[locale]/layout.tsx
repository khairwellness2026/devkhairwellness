import { notFound } from 'next/navigation';
import { LOCALES, isValidLocale, getLocaleDir, AppLocale } from '@/lib/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getDepartments, getSiteSettings, getSocialLinks } from '@/services/contentService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const appLocale = locale as AppLocale;
  const dir = getLocaleDir(appLocale);

  const [settings, departments, socialLinks] = await Promise.all([
    getSiteSettings(),
    getDepartments(appLocale),
    getSocialLinks(),
  ]);

  return (
    <div dir={dir} className="flex flex-col min-h-screen">
      <Header locale={appLocale} departments={departments} settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer locale={appLocale} departments={departments} settings={settings} socialLinks={socialLinks} />
    </div>
  );
}
