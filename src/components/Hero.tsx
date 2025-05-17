"use client";

import Image from "next/image";
import React, { useEffect } from "react";

const Hero = () => {
  useEffect(() => {
    const container = document.querySelector(".smoke-container");

    const createSmoke = () => {
      if (!container) return;
      const smoke = document.createElement("div");
      smoke.className = "smoke";
      smoke.style.left = `${Math.random() * 10}px`;
      container.appendChild(smoke);
      setTimeout(() => smoke.remove(), 5000);
    };

    const interval = setInterval(createSmoke, 300);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative bg-[#fefcf6] px-48 py-20 overflow-hidden flex flex-col md:flex-row items-center justify-between">
      {/* Left: Text */}
      <div className="max-w-xl z-10">
        <h1 className="text-7xl font-extrabold text-[#001858] leading-tight text-nowrap">
          Từ Bỏ{" "}
          <span className="text-[#ff5c00] relative">
            Thuốc Lá
            <span className="absolute left-0 -bottom-2 w-full h-2 bg-[#ff5c00] rounded-full blur-sm opacity-80"></span>
          </span>
          <br />
          Ngay Bây Giờ
        </h1>
        <p className="mt-6 text-lg text-[#534BC6] font-medium">
          Tham gia với chúng tôi ngay
        </p>
      </div>

      <div className="relative mt-12 md:mt-0 w-full max-w-lg h-[300px]">
        <div className="absolute left-[190px] top-[170px] w-12 h-full pointer-events-none">
          <div className="smoke-container" />
        </div>

        <Image
          src="/images/hero.png"
          alt="Main Hero"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </section>
  );
};

export default Hero;
