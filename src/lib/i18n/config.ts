export const LOCALES = ['en', 'hi', 'ar'] as const;
export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'en';

export const LOCALE_LABELS: Record<AppLocale, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  en: {
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
  },
};

export function isValidLocale(locale: string): locale is AppLocale {
  return LOCALES.includes(locale as AppLocale);
}

export function getLocaleDir(locale: AppLocale): 'ltr' | 'rtl' {
  return LOCALE_LABELS[locale]?.dir || 'ltr';
}

