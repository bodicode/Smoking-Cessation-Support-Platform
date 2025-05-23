'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

const Header = () => {
  const t = useTranslations('header');
  const locales = [
    { code: 'en', label: t('english') },
    { code: 'vi', label: t('vietnamese') },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 64 || currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-3 z-50
        flex items-center justify-between
        px-6 py-3
        bg-[#60C3A4] backdrop-blur-md text-white
        rounded-3xl max-w-[85%] min-h-20 mx-auto mt-4 shadow-lg transition-transform duration-300
        ${showHeader ? 'translate-y-0' : '-translate-y-full'}
      `}
      style={{ willChange: 'transform' }}
    >
      <Link href={'/'} className="font-bold text-sm flex items-center space-x-2">Reair</Link>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="text-[#B5D8EB]" size="20px" />
          <a href="tel:0123456789" className="underline font-semibold">
            0123456789
          </a>
        </div>
        <div className="relative inline-block">
          <div className="flex items-center gap-2 px-3 py-1 text-white">
            <Globe className="text-[#B5D8EB]" size={18} />
            <Listbox value={locale} onChange={(value) => router.replace(pathname, { locale: value })}>
              <div className="relative">
                <ListboxButton className="bg-[#60C3A4] py-2 rounded text-white cursor-pointer">
                  {locales.find(l => l.code === locale)?.label}
                </ListboxButton>
                <ListboxOptions className="absolute mt-2 bg-white rounded shadow-lg z-10">
                  {locales.map(l => (
                    <ListboxOption
                      key={l.code}
                      value={l.code}
                      className="px-4 py-3 text-black hover:bg-[#e0f2f1] cursor-pointer text-nowrap"
                    >
                      {l.label}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>
        </div>
        <Link href={`/${locale}/login`} className="bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-4 py-2 rounded-full shadow-2xl cursor-pointer">
          {t('login')}
        </Link>
        <Link href={`/${locale}/profile`} className="bg-[#03256C] hover:bg-[#041E42] text-white font-bold px-4 py-2 rounded-full shadow-2xl cursor-pointer">
          {t('profile')}
        </Link>
        <button className="text-2xl">
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
