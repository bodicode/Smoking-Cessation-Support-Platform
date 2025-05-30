'use client';

import { useEffect, useRef, useState } from 'react';
import { Phone, Globe, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/store/userSlice';

const Header = () => {
  const t = useTranslations('header');
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
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
        rounded-3xl max-w-[85%] min-h-20 mx-auto shadow-lg transition-transform duration-300
        ${showHeader ? 'translate-y-0' : '-translate-y-[100px]'}
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
        {!user?.accessToken ? (
          <Link
            href={`/${locale}/login`}
            className="bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-4 py-2 rounded-full shadow-2xl cursor-pointer"
          >
            {t('login')}
          </Link>
        ) : (
          <div className="relative group">
            <div
              className="bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-4 py-2 rounded-full shadow-2xl cursor-pointer flex items-center gap-2 select-none"
            >
              {user?.name || user?.email || "User"}
              <ChevronDown size={18} className="ml-1" />
            </div>
            <div className='absolute bg-transparent w-full h-full ' />
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
            >
              <Link
                href={`/${locale}/profile`}
                className="block px-4 py-2 text-sm text-gray-900 hover:bg-[#e0f2f1] hover:text-[#03256C]"
              >
                {t('profile')}
              </Link>
              <button
                className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  dispatch(clearUser());
                  localStorage.removeItem('access_token');
                  router.push(`/login`);
                }}
              >
                {t('logout') || 'Đăng xuất'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
