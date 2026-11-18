'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LOCALES, LOCALE_LABELS, AppLocale } from '@/lib/i18n/config';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: AppLocale }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: AppLocale) => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;

    // Replace the first locale segment in pathname
    const segments = pathname.split('/');
    if (segments.length > 1 && LOCALES.includes(segments[1] as AppLocale)) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-khair-deepForest bg-khair-warmIvory/80 hover:bg-khair-warmIvory border border-khair-gold/40 rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-khair-gold"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-khair-goldDark" />
        <span>{LOCALE_LABELS[currentLocale]?.nativeName || currentLocale.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 bg-white border border-khair-softBeige rounded-xl shadow-lg py-1.5 z-50">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full text-left rtl:text-right px-4 py-2 text-xs flex items-center justify-between hover:bg-khair-warmIvory transition-colors ${
                loc === currentLocale ? 'font-bold text-khair-deepForest bg-khair-warmIvory/50' : 'text-khair-charcoal'
              }`}
            >
              <span>{LOCALE_LABELS[loc].nativeName}</span>
              <span className="text-[10px] text-gray-400 uppercase">{loc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

