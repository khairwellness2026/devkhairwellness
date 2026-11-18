'use client';

import { useState } from 'react';
import { AppLocale } from '@/lib/i18n/config';
import { getUITranslations } from '@/lib/i18n/translations';
import { Department, SiteSettings, SocialLink } from '@/types';
import { Phone, Mail, MapPin, ChevronDown } from 'lucide-react';

interface FooterProps {
  locale: AppLocale;
  departments: Department[];
  settings?: SiteSettings | null;
  socialLinks?: SocialLink[];
}

export default function Footer({ locale, departments, settings, socialLinks }: FooterProps) {
  const t = getUITranslations(locale);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const phonePrimary = settings?.phone_primary || '+91 94473 60670';
  const phoneSecondary = settings?.phone_secondary || '+91 90204 69647';
  const email = settings?.email || 'info@khair.in';
  const address = settings?.address_line || 'Kondotty / Kottakkal, Malappuram, Kerala, India';
  const footerText = settings?.footer_text || '© 2026 KHAIR Healthcare Centre. All Rights Reserved.';

  return (
    <footer className="bg-khair-deepForest text-white pt-10 sm:pt-16 pb-6 sm:pb-8 border-t-4 border-khair-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 sm:gap-2.5">
              {settings?.emblem_url && (
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0">
                  <img
                    src={settings.emblem_url}
                    alt={settings?.site_name || "KHAIR International Emblem"}
                    className="w-full h-full object-contain brightness-110"
                  />
                </div>
              )}
              {settings?.logo_url ? (
                <div className="relative h-9 sm:h-10 md:h-12 flex items-center flex-shrink-0">
                  <img
                    src={settings.logo_url}
                    alt={settings?.site_name || "KHAIR International"}
                    className="h-full w-auto object-contain brightness-0 invert"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">
                    {settings?.site_name || 'KHAIR International'}
                  </span>
                  <span className="text-[10px] sm:text-xs text-khair-goldLight font-medium tracking-wider uppercase mt-1">
                    Ayurveda • Physiotherapy • Wellbeing
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-khair-warmIvory/80 leading-relaxed max-w-sm">
              {settings?.sub_tagline || 'Kottakkal Heritage Ayurveda and Integrated Rehabilitation — where traditional healing meets modern medical science.'}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-khair-goldLight block mb-2">
                {t.followUs}
              </span>
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-khair-gold hover:text-khair-deepForest flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-khair-gold hover:text-khair-deepForest flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-khair-gold hover:text-khair-deepForest flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-khair-gold hover:text-khair-deepForest flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ── MOBILE ACCORDION (Arrow dropdowns to keep footer short on mobile) ── */}
          <div className="sm:hidden space-y-2 border-t border-white/10 pt-4">
            
            {/* Quick Links Accordion */}
            <div className="border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => toggleSection('quickLinks')}
                className="w-full flex items-center justify-between py-2 text-left font-serif text-base font-semibold text-khair-goldLight"
              >
                <span>{t.quickLinks}</span>
                <ChevronDown
                  className={`w-4 h-4 text-khair-gold transition-transform duration-300 ${
                    openSection === 'quickLinks' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'quickLinks' && (
                <ul className="py-2 space-y-2 text-xs text-khair-warmIvory/80 pl-2">
                  <li><a href={`/${locale}`} className="hover:text-khair-gold transition-colors">{t.home}</a></li>
                  <li><a href={`/${locale}/about`} className="hover:text-khair-gold transition-colors">{t.aboutUs}</a></li>
                  <li><a href={`/${locale}/departments`} className="hover:text-khair-gold transition-colors">{t.departments}</a></li>
                  <li><a href={`/${locale}/doctors`} className="hover:text-khair-gold transition-colors">{t.doctors}</a></li>
                  <li><a href={`/${locale}/gallery`} className="hover:text-khair-gold transition-colors">{t.gallery}</a></li>
                  <li><a href={`/${locale}/contact`} className="hover:text-khair-gold transition-colors">{t.contact}</a></li>
                </ul>
              )}
            </div>

            {/* Departments Accordion */}
            <div className="border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => toggleSection('departments')}
                className="w-full flex items-center justify-between py-2 text-left font-serif text-base font-semibold text-khair-goldLight"
              >
                <span>{t.ourDepartments}</span>
                <ChevronDown
                  className={`w-4 h-4 text-khair-gold transition-transform duration-300 ${
                    openSection === 'departments' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'departments' && (
                <ul className="py-2 space-y-2 text-xs text-khair-warmIvory/80 pl-2">
                  {departments.slice(0, 6).map((dept) => (
                    <li key={dept.id}>
                      <a
                        href={`/${locale}/departments/${dept.slug}`}
                        className="hover:text-khair-gold transition-colors flex items-center gap-1.5"
                      >
                        <span>•</span>
                        <span>{dept.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contact Accordion */}
            <div className="border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => toggleSection('contact')}
                className="w-full flex items-center justify-between py-2 text-left font-serif text-base font-semibold text-khair-goldLight"
              >
                <span>{t.getInTouch}</span>
                <ChevronDown
                  className={`w-4 h-4 text-khair-gold transition-transform duration-300 ${
                    openSection === 'contact' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'contact' && (
                <div className="py-2 space-y-2.5 text-xs text-khair-warmIvory/90 pl-2">
                  <a href={`tel:${phonePrimary.replace(/\s+/g, '')}`} className="flex items-center gap-2.5 hover:text-khair-gold">
                    <Phone className="w-3.5 h-3.5 text-khair-gold flex-shrink-0" />
                    <span>{phonePrimary}</span>
                  </a>
                  {phoneSecondary && (
                    <a href={`tel:${phoneSecondary.replace(/\s+/g, '')}`} className="flex items-center gap-2.5 hover:text-khair-gold">
                      <Phone className="w-3.5 h-3.5 text-khair-gold flex-shrink-0" />
                      <span>{phoneSecondary}</span>
                    </a>
                  )}
                  <a href={`mailto:${email}`} className="flex items-center gap-2.5 hover:text-khair-gold">
                    <Mail className="w-3.5 h-3.5 text-khair-gold flex-shrink-0" />
                    <span>{email}</span>
                  </a>
                  <div className="flex items-start gap-2.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-khair-gold flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{address}</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ── DESKTOP GRID COLUMNS (Always open on tablets & desktop) ── */}
          {/* Quick Links Col */}
          <div className="hidden sm:block">
            <h4 className="font-serif text-lg font-semibold text-khair-goldLight mb-4">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-khair-warmIvory/80">
              <li><a href={`/${locale}`} className="hover:text-khair-gold transition-colors">{t.home}</a></li>
              <li><a href={`/${locale}/about`} className="hover:text-khair-gold transition-colors">{t.aboutUs}</a></li>
              <li><a href={`/${locale}/departments`} className="hover:text-khair-gold transition-colors">{t.departments}</a></li>
              <li><a href={`/${locale}/doctors`} className="hover:text-khair-gold transition-colors">{t.doctors}</a></li>
              <li><a href={`/${locale}/gallery`} className="hover:text-khair-gold transition-colors">{t.gallery}</a></li>
              <li><a href={`/${locale}/contact`} className="hover:text-khair-gold transition-colors">{t.contact}</a></li>
            </ul>
          </div>

          {/* Departments Col */}
          <div className="hidden sm:block">
            <h4 className="font-serif text-lg font-semibold text-khair-goldLight mb-4">
              {t.ourDepartments}
            </h4>
            <ul className="space-y-2 text-xs text-khair-warmIvory/80">
              {departments.slice(0, 6).map((dept) => (
                <li key={dept.id}>
                  <a
                    href={`/${locale}/departments/${dept.slug}`}
                    className="hover:text-khair-gold transition-colors flex items-center gap-1.5"
                  >
                    <span>•</span>
                    <span>{dept.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch Col */}
          <div className="hidden sm:block space-y-3">
            <h4 className="font-serif text-lg font-semibold text-khair-goldLight mb-4">
              {t.getInTouch}
            </h4>
            <div className="space-y-2.5 text-xs text-khair-warmIvory/90">
              <a
                href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
                className="flex items-center gap-3 hover:text-khair-gold transition-colors"
              >
                <Phone className="w-4 h-4 text-khair-gold flex-shrink-0" />
                <span>{phonePrimary}</span>
              </a>
              {phoneSecondary && (
                <a
                  href={`tel:${phoneSecondary.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 hover:text-khair-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-khair-gold flex-shrink-0" />
                  <span>{phoneSecondary}</span>
                </a>
              )}
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 hover:text-khair-gold transition-colors"
              >
                <Mail className="w-4 h-4 text-khair-gold flex-shrink-0" />
                <span>{email}</span>
              </a>
              <div className="flex items-start gap-3 pt-1">
                <MapPin className="w-4 h-4 text-khair-gold flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-khair-warmIvory/60 gap-3 sm:gap-4 text-center sm:text-left">
          <p>{footerText}</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href={`/${locale}/privacy-policy`} className="hover:text-khair-gold transition-colors">
              {t.privacyPolicy}
            </a>
            <span>•</span>
            <a href={`/${locale}/terms-of-service`} className="hover:text-khair-gold transition-colors">
              {t.termsOfService}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
