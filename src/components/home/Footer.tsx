import {
    FaFacebookF,
    FaXTwitter,
    FaInstagram,
    FaPinterestP,
    FaLinkedinIn,
    FaYoutube,
} from 'react-icons/fa6';
import FixedMap from './FixedMap';
import Link from 'next/link';
import Logo from '../common/Logo';
import { motion } from 'framer-motion';

const socialIcons = [
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaXTwitter />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaPinterestP />, href: "#" },
    { icon: <FaLinkedinIn />, href: "#" },
    { icon: <FaYoutube />, href: "#" },
];

const Footer = () => {
    return (
        <motion.footer
            className="bg-[#60C3A4] text-white py-10 px-4 sm:px-8 md:px-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, type: "tween" }}
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                <div className="min-w-0">
                    <Logo />
                    <form className="flex bg-white rounded overflow-hidden w-full max-w-xs mt-4">
                        <input
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="text-black px-3 py-2 w-full focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-[#B5D8EB] hover:bg-[#95cce9] text-white px-4 font-bold cursor-pointer"
                        >
                            →
                        </button>
                    </form>
                    <div className="flex space-x-2 sm:space-x-4 mt-4 text-white text-lg">
                        {socialIcons.map((icon, i) => (
                            <motion.a
                                key={i}
                                href={icon.href}
                                whileHover={{
                                    scale: 1.15,
                                    filter: "drop-shadow(0 0 8px #b5d8eb)",
                                    color: "#B5D8EB",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                                className="transition-all duration-150"
                            >
                                {icon.icon}
                            </motion.a>
                        ))}
                    </div>
                    <p className="text-sm mt-6">
                        Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM
                        <br />
                        Email: info@example.com
                    </p>
                </div>

                <div className="min-w-0 md:mx-0">
                    <h4 className="text-2xl font-bold mb-2 text-nowrap text-accent uppercase">
                        Liên kết
                    </h4>
                    <hr className="mb-4 border-white/30" />
                    <ul className="space-y-1">
                        {[
                            { href: "/about-us", label: "Về chúng tôi" },
                            { href: "/contact-us", label: "Liên hệ" },
                            { href: "/how-to-quit", label: "Cách bỏ thuốc" },
                            { href: "/blog", label: "Bài viết" },
                            { href: "/community", label: "Cộng đồng" },
                        ].map((item, idx) => (
                            <li key={idx}>
                                <Link
                                    href={item.href}
                                    className="group relative inline-block transition"
                                >
                                    <span className="pb-1">
                                        {item.label}
                                        <span
                                            className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all group-hover:w-full duration-300"
                                            style={{ content: '' }}
                                        ></span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="min-w-0">
                    <FixedMap />
                </div>
            </div>
            <div className="mt-4 text-center py-3 text-sm">
                Bản quyền © 2025. Tất cả quyền được bảo lưu.
            </div>
        </motion.footer>
    );
};

export default Footer;
