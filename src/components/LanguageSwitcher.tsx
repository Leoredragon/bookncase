'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'tr', label: 'TR', name: 'Türkçe' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'nl', label: 'NL', name: 'Nederlands' },
] as const;

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="inline-flex items-center gap-0.5 bg-[#FAF8F5]/80 border border-stone-200/80 p-1 rounded-full shadow-xs">
      <Globe className="w-3.5 h-3.5 ml-1.5 mr-0.5 text-amber-900/60" />
      {languages.map((lang) => {
        const isActive = currentLocale === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isPending}
            title={lang.name}
            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#1C1B1A] text-[#FAF8F5] font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
