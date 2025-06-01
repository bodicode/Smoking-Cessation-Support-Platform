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
    <section className="relative px-6 md:px-20 py-20 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="max-w-2xl z-10 text-center md:text-left">
        <h1 className="text-4xl lg:text-[58px] font-extrabold text-[#001858] leading-tight text-nowrap">
          {t("title.line1")}{" "}
          <span className="relative text-[#ff5c00]">
            {t("title.highlight")}
            <span className="absolute left-0 -bottom-1 w-full h-2 bg-[#ff5c00] rounded-full blur-sm opacity-60" />
          </span>
          <br />
          {t("title.line2")}
        </h1>
        <p className="mt-6 md:text-xl text-[#534BC6] font-medium">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex flex-nowrap justify-center md:justify-end gap-6">
        {cards.map((c, i) => (
          <Link
            key={i}
            href={c.href}
            className={`${c.bg} text-white rounded-lg p-6 w-48 flex flex-col items-center`}
          >
            <div className="relative bg-white w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-4">
              <Image src={c.icon} alt={t(`cards.${c.titleKey}`)} fill className="object-contain" />
            </div>
            <p className="text-center font-medium text-sm">
              {t(`cards.${c.titleKey}`)}
            </p>
          </Link>
        ))}
      </div>

    </section>
  );
};

export default Hero;
