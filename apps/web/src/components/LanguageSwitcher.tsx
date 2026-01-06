'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname, routing } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLanguageChange = (newLocale: string) => {
    localStorage.setItem('NEXT_LOCALE', newLocale);
    // @ts-expect-error - next-intl navigation types might have issues with dynamic paths in some versions
    router.replace({ pathname, params }, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg border border-gray-700/50 shadow-lg">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            locale === loc
              ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          {loc === 'zh' ? '中文' : 'EN'}
        </button>
      ))}
    </div>
  );
}
