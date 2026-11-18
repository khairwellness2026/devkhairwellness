import { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://khair.in';

  const coreRoutes = ['', '/about', '/departments', '/doctors', '/gallery', '/contact', '/privacy-policy', '/terms-of-service'];
  const departmentSlugs = [
    'ayurveda-treatments',
    'physiotherapy-rehabilitation',
    'naturopathy-yoga',
    'lifestyle-clinic',
    'advanced-ano-rectal-clinic',
    'occupational-therapy',
  ];

  const doctorSlugs = ['dr-ahmed-k', 'dr-nisha-p', 'dr-farhan-m'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of coreRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }

    for (const slug of departmentSlugs) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/departments/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }

    for (const slug of doctorSlugs) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/doctors/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return sitemapEntries;
}

