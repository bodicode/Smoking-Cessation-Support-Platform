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
import Logo from '../Logo';
import Notification from './Notification';
import { motion } from "framer-motion";

const Header = () => {
  const t = useTranslations('header');
  const [isPhoneHover, setPhoneIsHover] = useState(false);
  const [isGlobeHover, setIsGlobeHover] = useState(false);
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
        sticky top-2 z-50
        flex flex-wrap items-center justify-between
        px-2 sm:px-4 md:px-6 py-2 md:py-3
        bg-[#60C3A4] backdrop-blur-md text-white
        rounded-xl sm:rounded-3xl max-w-full sm:max-w-[95%] min-h-16 sm:min-h-20 mx-auto shadow-lg transition-transform duration-300
        ${showHeader ? 'translate-y-0' : '-translate-y-[120px]'}
      `}
      style={{ willChange: 'transform' }}
    >
      <Link
        href={'/'}
        className='ml-4'
      >
        <Logo />
      </Link>

      <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:gap-5 text-xs sm:text-sm">
        <motion.div
          className="flex items-center gap-1 sm:gap-2"
          onHoverStart={() => setPhoneIsHover(true)}
          onHoverEnd={() => setPhoneIsHover(false)}
        >
          <motion.div 
            animate={isPhoneHover ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0] } : { rotate: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Phone className="text-[#B5D8EB]" size={18} />
          </motion.div>
          <a
            href="tel:0123456789"
            className="underline font-semibold text-xs sm:text-sm ml-2"
          >
            0123456789
          </a>
        </motion.div>
        <div className="relative">
          <motion.div
            className="flex items-center gap-1 sm:gap-2 px-1 sm:px-3 py-1 text-white"
            onHoverStart={() => setIsGlobeHover(true)}
            onHoverEnd={() => setIsGlobeHover(false)}
          >
            <motion.span
              animate={isGlobeHover ? { rotateZ: 360 } : { rotateZ: 0 }}
              transition={{ duration: 0.7, ease: "linear" }}
              style={{ display: "inline-block" }}
            >
              <Globe className="text-[#B5D8EB]" size={16} />
            </motion.span>
            <Listbox value={locale} onChange={(value) => router.replace(pathname, { locale: value })}>
              <div className="relative">
                <ListboxButton className="bg-[#60C3A4] py-1 px-2 sm:py-2 rounded text-white cursor-pointer text-xs sm:text-sm">
                  {locales.find(l => l.code === locale)?.label}
                </ListboxButton>
                <ListboxOptions className="absolute mt-2 bg-white rounded shadow-lg z-10 min-w-[120px]">
                  {locales.map(l => (
                    <ListboxOption
                      key={l.code}
                      value={l.code}
                      className="px-3 py-2 text-black hover:bg-[#e0f2f1] cursor-pointer text-xs sm:text-sm text-nowrap"
                    >
                      {l.label}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </motion.div>
        </div>

        <div>
          <Notification />
        </div>

        {!user?.accessToken ? (
          <motion.div
            whileHover={{
              scale: 1.09,
              boxShadow: "0px 4px 18px #B5D8EB99"
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 15 }}
            className="inline-block"
          >
            <Link
              href={`/${locale}/login`}
              className="
      bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-3 py-1 sm:px-4 sm:py-2 
      rounded-full shadow-2xl cursor-pointer text-xs sm:text-sm whitespace-nowrap 
      transition-all duration-200"
            >
              {t('login')}
            </Link>
          </motion.div>
        ) : (
          <div className="relative group">
            <div
              className="bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-2xl cursor-pointer flex items-center gap-1 sm:gap-2 select-none text-xs sm:text-sm"
            >
              {user?.name || user?.email || "User"}
              <ChevronDown size={16} className="ml-1" />
            </div>
            <div className='absolute bg-transparent w-full h-full' />
            <div
              className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg z-20 py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all"
            >
              <Link
                href={`/${locale}/profile`}
                className="block px-4 py-2 text-xs sm:text-sm text-gray-900 hover:bg-[#e0f2f1] hover:text-[#03256C]"
              >
                {t('profile')}
              </Link>
              <button
                className="cursor-pointer block w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50"
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
