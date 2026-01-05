'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check localStorage for saved preference
    let locale = localStorage.getItem('NEXT_LOCALE');
    
    // 2. If no saved preference, check browser language
    if (!locale) {
      locale = navigator.language.startsWith('zh') ? 'zh' : 'en';
    }
    
    // 3. Redirect to the determined locale
    router.replace(`/${locale}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
