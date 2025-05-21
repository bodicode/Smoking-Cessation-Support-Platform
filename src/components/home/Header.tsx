'use client';

import { useState } from 'react';
import { Phone, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

const Header = () => {
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-5 z-50 flex items-center justify-between px-6 py-3 bg-[#60C3A4] text-white rounded-full max-w-[85%] min-h-20 mx-auto mt-4 shadow-lg">
      <div className="font-bold text-sm flex items-center space-x-2">Reair</div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="text-[#B5D8EB]" size="20px" />
          <a href="tel:0123456789" className="underline font-semibold">
            0123456789
          </a>
        </div>

        <div className="relative inline-block">
          <div className="flex items-center gap-2 px-3 py-1 text-white">
            <Globe className="text-[#4A90E2]" size={18} />
            <select
              value={locale}
              onChange={handleLocaleChange}
              className="appearance-none bg-transparent outline-none text-sm font-semibold cursor-pointer"
            >
              <option value="en" className="bg-[#60C3A4] text-white cursor-pointer">
                {t('english')}
              </option>
              <option value="vi" className="bg-[#60C3A4] text-white cursor-pointer">
                {t('vietnamese')}
              </option>
            </select>
          </div>
        </div>

        <button className="bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-4 py-2 rounded-full shadow-2xl cursor-pointer">
          {t('login')}
        </button>

        <button className="text-2xl">
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
