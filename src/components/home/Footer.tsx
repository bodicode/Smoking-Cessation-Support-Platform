'use client';

import {
    FaFacebookF,
    FaXTwitter,
    FaInstagram,
    FaPinterestP,
    FaLinkedinIn,
    FaYoutube,
} from 'react-icons/fa6';
import FixedMap from './FixedMap';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Footer = () => {
    const t = useTranslations('footer');

    return (
        <footer className="bg-[#60C3A4] text-white py-10 px-4 sm:px-8 md:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                <div className="min-w-0">
                    <h4 className="text-2xl font-bold mb-2 text-nowrap text-accent uppercase">
                        {t('brand')}
                    </h4>
                    <hr className="mb-4 border-white/30 md:hidden" />

                    <p className="text-yellow-400 font-semibold mb-2">
                        {t('subscribe')}
                    </p>
                    <form className="flex bg-white rounded overflow-hidden w-full max-w-xs">
                        <input
                            type="email"
                            placeholder={t('placeholderEmail')}
                            className="text-black px-3 py-2 w-full focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-yellow-400 px-4 text-black font-bold"
                        >
                            →
                        </button>
                    </form>

                    <div className="flex space-x-2 sm:space-x-4 mt-4 text-white text-lg">
                        <FaFacebookF />
                        <FaXTwitter />
                        <FaInstagram />
                        <FaPinterestP />
                        <FaLinkedinIn />
                        <FaYoutube />
                    </div>

                    <p className="text-sm mt-6">
                        {t('addressLine1')}
                        <br />
                        {t('addressLine2')}
                    </p>
                </div>

                <div className="min-w-0 md:mx-0">
                    <h4 className="text-2xl font-bold mb-2 text-nowrap text-accent uppercase ">
                        {t('quickLinks')}
                    </h4>
                    <hr className="mb-4 border-white/30" />
                    <ul className="space-y-1">
                        <li>
                            <Link href="/about-us" className="hover:underline">
                                {t('aboutUs')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact-us" className="hover:underline">
                                {t('contactUs')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/how-to-quit" className="hover:underline">
                                {t('howToQuit')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="hover:underline">
                                {t('news')}
                            </Link>
                        </li>
                        <li>
                            <Link href="/community" className="hover:underline">
                                {t('community')}
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:underline">
                                {t('helpOthers')}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="min-w-0">
                    <FixedMap />
                </div>
            </div>

            <div className="mt-4 text-center py-3 text-sm">
                {t('copyright')}
            </div>
        </footer>
    );
};

export default Footer;
