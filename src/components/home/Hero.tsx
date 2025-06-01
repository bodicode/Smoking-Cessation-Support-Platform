"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const cards = [
  { titleKey: "buildYourQuitPlan", icon: "/images/quit-plan.jpg", bg: "bg-[#004F7C]", href: "/plan" },
  { titleKey: "membership", icon: "/images/membership.jpg", bg: "bg-[#00C2A0]", href: "/membership" },
  { titleKey: "reairSocialMedia", icon: "/images/social.png", bg: "bg-[#FFC400]", href: "/community" },
];

const Hero = () => {
  const t = useTranslations("hero");

  return (
    <div className="relative px-4 sm:px-8 lg:px-20 py-10 sm:py-16 lg:py-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
      <div className="w-full lg:max-w-2xl z-10 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-[58px] font-extrabold text-[#001858] leading-tight mb-2 text-nowrap">
          {t("title.line1")}{" "}
          <span className="relative text-[#ff5c00]">
            {t("title.highlight")}
            <span className="absolute left-0 -bottom-1 w-full h-2 bg-[#ff5c00] rounded-full blur-sm opacity-60"></span>
          </span>
          <br />
          {t("title.line2")}
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-[#534BC6] font-medium">
          {t("subtitle")}
        </p>
      </div>

      <div
        className="
          w-full flex flex-nowrap justify-center lg:justify-end gap-4 sm:gap-6
        "
      >
        {cards.map((c, i) => (
          <Link
            key={i}
            href={c.href}
            className={`
              ${c.bg} text-white rounded-2xl p-4 sm:p-6 w-40 sm:w-44 md:w-48 flex flex-col items-center
              transition hover:scale-105 hover:shadow-lg
            `}
          >
            <div className="relative bg-white w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex items-center justify-center mb-3 sm:mb-4">
              <Image
                src={c.icon}
                alt={t(`cards.${c.titleKey}`)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
              />
            </div>
            <p className="text-center font-medium text-xs sm:text-sm md:text-base">
              {t(`cards.${c.titleKey}`)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Hero;
