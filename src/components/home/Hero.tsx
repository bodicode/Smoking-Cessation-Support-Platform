"use client";

import { useTranslations } from "next-intl";
import React from "react";

const Hero = () => {
  const t = useTranslations('hero');

  return (
    <section className="relative bg-[#fefcf6] px-6 md:px-20 py-20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="max-w-2xl z-10 text-center md:text-left">
        <h1 className="text-4xl lg:text-[58px] font-extrabold text-[#001858] leading-tight">
          {t("title.line1")}{" "}
          <span className="relative text-[#ff5c00]">
            {t("title.highlight")}
            <span className="absolute left-0 -bottom-1 w-full h-2 bg-[#ff5c00] rounded-full blur-sm opacity-60"></span>
          </span>
          <br />
          {t("title.line2")}
        </h1>
        <p className="mt-6 md:text-xl text-[#534BC6] font-medium">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/jOjkdjujXk0?autoplay=1&mute=1&loop=1&playlist=jOjkdjujXk0&controls=0"
          title="Don't Smoke! NO SMOKING (short 2D animation video)"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
        <div
          className="absolute inset-0"
          onContextMenu={(e) => e.preventDefault()}
        ></div>
      </div>
    </section>
  );
};

export default Hero;
