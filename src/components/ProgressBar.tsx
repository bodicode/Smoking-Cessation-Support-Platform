'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Đã đổi sang Framer Motion

export default function ProgressBar() {
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        const updateScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight ? scrollTop / docHeight : 0;
            setScroll(progress);
        };

        window.addEventListener("scroll", updateScroll, { passive: true });
        updateScroll();

        return () => window.removeEventListener("scroll", updateScroll);
    }, []);

    return (
        <motion.div
            className="fixed left-0 bottom-0 h-2 bg-gradient-to-r from-[#4FC3F7] via-[#7AE582] to-[#A685E2] z-[9999] rounded-md"
            animate={{ width: `${scroll * 100}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}  // Framer Motion: 'ease' thay vì 'easing'
            style={{
                width: "0%",
                borderRadius: "0.5rem",
            }}
        />
    );
}
