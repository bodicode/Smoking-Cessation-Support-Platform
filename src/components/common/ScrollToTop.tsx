'use client';

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setVisible(window.scrollY > 200); // hiện nút nếu cuộn xuống quá 200px
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <button
            aria-label="Scroll to top"
            onClick={scrollToTop}
            className="
        cursor-pointer fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#1cb178] shadow-lg
        hover:bg-[#01613B] transition-colors
        flex items-center justify-center
      "
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.16)' }}
        >
            <ChevronUp className="w-6 h-6 text-white" />
        </button>
    );
}
