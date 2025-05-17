"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#60C3A4] text-white rounded-full max-w-[85%] min-h-20 mx-auto mt-4 shadow-lg">
      <div className="font-bold text-sm flex items-center space-x-2">Reair</div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Phone className="text-[#B5D8EB]" size="20px" />
          <a href="tel:0123456789" className="underline font-semibold">
            0123456789
          </a>
        </div>
        <button className="bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-4 py-2 rounded-full shadow-2xl cursor-pointer">
          Đăng nhập
        </button>
        <button className="text-2xl">☰</button>
      </div>
    </header>
  );
};

export default Header;
