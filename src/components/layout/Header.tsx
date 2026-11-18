'use client';

import Link from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { AppLocale } from '@/lib/i18n/config';
import { getUITranslations } from '@/lib/i18n/translations';
import LanguageSwitcher from './LanguageSwitcher';
import { Phone, ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import { Department, SiteSettings } from '@/types';

interface HeaderProps {
  locale: AppLocale;
  departments: Department[];
  settings?: SiteSettings | null;
}

export default function Header({ locale, departments, settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const t = getUITranslations(locale);

  const phonePrimary = settings?.phone_primary || '+91 94473 60670';
  const cleanPhone = phonePrimary.replace(/\s+/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-khair-softBeige/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <a href={`/${locale}`} className="flex items-center gap-2 sm:gap-2.5 group -ml-1 sm:-ml-2 md:-ml-3">
            {settings?.emblem_url && (
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0">
                <img
                  src={settings.emblem_url}
                  alt={settings?.site_name || "KHAIR International Emblem"}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            {settings?.logo_url ? (
              <div className="relative h-9 sm:h-10 md:h-12 flex items-center flex-shrink-0">
                <img
                  src={settings.logo_url}
                  alt={settings?.site_name || "KHAIR International"}
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col justify-center">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-khair-deepForest leading-none">
                  {settings?.site_name || 'KHAIR International'}
                </span>
                <span className="text-[10px] sm:text-xs text-khair-goldDark font-medium tracking-wider uppercase mt-1">
                  Ayurveda • Physiotherapy • Wellbeing
                </span>
              </div>
            )}
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-khair-charcoal">
            <a
              href={`/${locale}`}
              className="hover:text-khair-botanical transition-colors hover:underline underline-offset-8"
            >
              {t.home}
            </a>

            <a
              href={`/${locale}/about`}
              className="hover:text-khair-botanical transition-colors hover:underline underline-offset-8"
            >
              {t.aboutUs}
            </a>

            {/* Departments Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDeptDropdownOpen(true)}
              onMouseLeave={() => setDeptDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-khair-botanical transition-colors py-2 focus:outline-none"
              >
                <span>{t.departments}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-khair-botanical transition-transform" />
              </button>

              {deptDropdownOpen && (
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 w-64 bg-white border border-khair-softBeige rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-khair-softBeige/40">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-khair-goldDark">
                      {t.ourDepartments}
                    </span>
                  </div>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <a
                        key={dept.id}
                        href={`/${locale}/departments/${dept.slug}`}
                        className="block px-4 py-2.5 text-xs text-khair-charcoal hover:bg-khair-warmIvory hover:text-khair-deepForest transition-colors"
                      >
                        {dept.name}
                      </a>
                    ))
                  ) : (
                    <a
                      href={`/${locale}/departments`}
                      className="block px-4 py-2 text-xs text-gray-500"
                    >
                      {t.viewAllDepartments}
                    </a>
                  )}
                  <div className="pt-2 mt-1 border-t border-khair-softBeige/40 px-4 pb-1">
                    <a
                      href={`/${locale}/departments`}
                      className="text-xs font-semibold text-khair-botanical hover:underline flex items-center justify-between"
                    >
                      <span>{t.viewAllDepartments}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href={`/${locale}/doctors`}
              className="hover:text-khair-botanical transition-colors hover:underline underline-offset-8"
            >
              {t.doctors}
            </a>

            <a
              href={`/${locale}/gallery`}
              className="hover:text-khair-botanical transition-colors hover:underline underline-offset-8"
            >
              {t.gallery}
            </a>

            <a
              href={`/${locale}/contact`}
              className="hover:text-khair-botanical transition-colors hover:underline underline-offset-8"
            >
              {t.contact}
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />

            <a
              href={`tel:${cleanPhone}`}
              className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-khair-deepForest bg-khair-warmIvory rounded-full border border-khair-gold/30 hover:border-khair-gold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-khair-goldDark" />
              <span>{phonePrimary}</span>
            </a>

            <a
              href={`/${locale}/contact#book-appointment`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <span>{t.bookAppointment}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-khair-goldLight" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-khair-deepForest hover:bg-khair-warmIvory rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-khair-softBeige px-4 pt-3 pb-6 shadow-lg">
          <nav className="flex flex-col gap-3 text-sm font-medium text-khair-charcoal">
            <a
              href={`/${locale}`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 hover:text-khair-botanical"
            >
              {t.home}
            </a>
            <a
              href={`/${locale}/about`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 hover:text-khair-botanical"
            >
              {t.aboutUs}
            </a>
            <a
              href={`/${locale}/departments`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 hover:text-khair-botanical"
            >
              {t.departments}
            </a>
            <a
              href={`/${locale}/doctors`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 hover:text-khair-botanical"
            >
              {t.doctors}
            </a>
            <a
              href={`/${locale}/gallery`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 hover:text-khair-botanical"
            >
              {t.gallery}
            </a>
            <a
              href={`/${locale}/contact`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-gray-100 hover:text-khair-botanical"
            >
              {t.contact}
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-khair-deepForest bg-khair-warmIvory rounded-xl border border-khair-gold/30"
              >
                <Phone className="w-4 h-4 text-khair-goldDark" />
                <span>{phonePrimary}</span>
              </a>
              <a
                href={`/${locale}/contact#book-appointment`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-khair-deepForest rounded-xl shadow-sm"
              >
                <span>{t.bookAppointment}</span>
                <ArrowUpRight className="w-4 h-4 text-khair-goldLight" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

