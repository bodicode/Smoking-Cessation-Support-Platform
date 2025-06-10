"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCessationPlans } from "@/services/cessationPlanService";

const cards = [
  {
    titleKey: "buildYourQuitPlan",
    icon: "/images/quit-plan.jpg",
    bg: "bg-[#004F7C]",
    href: "/plan"
  },
  {
    titleKey: "membership",
    icon: "/images/membership.jpg",
    bg: "bg-[#00C2A0]",
    href: "/membership"
  },
  {
    titleKey: "reairSocialMedia",
    icon: "/images/social.png",
    bg: "bg-[#FFC400]",
    href: "/community"
  },
];

const container = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.17,
      delayChildren: 0.15,
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" } }
};

const Hero = () => {
  const t = useTranslations("hero");
  const router = useRouter();
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [checkingPlan, setCheckingPlan] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setCheckingPlan(true);
      try {
        const plans = await getCessationPlans();
        if (!isMounted) return;
        setHasPlan(!!plans?.length);
      } catch {
        if (isMounted) setHasPlan(false);
      } finally {
        if (isMounted) setCheckingPlan(false);
      }
    })();
    return () => { isMounted = false };
  }, []);

  const handleFirstCardClick = () => {
    if (hasPlan) {
      router.push("/plan/my-plan");
    } else {
      router.push("/template");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="relative px-4 sm:px-8 lg:px-20 py-10 sm:py-16 lg:py-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12"
    >
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full lg:max-w-2xl z-10 text-center lg:text-left"
      >
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
      </motion.div>

      <motion.div
        className="w-full flex flex-nowrap justify-center lg:justify-end gap-4 sm:gap-6"
        variants={container}
      >
        {cards.map((c, i) => (
          <motion.div
            key={i}
            variants={cardVariant}
            whileHover={{
              scale: 1.09,
              y: -8,
              boxShadow: "0px 8px 24px rgba(0,0,0,0.08)"
            }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            {i === 0 ? (
              <button
                onClick={handleFirstCardClick}
                disabled={checkingPlan || hasPlan === null}
                className={`
                  ${c.bg} text-white rounded-2xl p-4 sm:p-6 w-40 sm:w-44 md:w-48 flex flex-col items-center
                  transition hover:scale-105 hover:shadow-lg cursor-pointer border-none outline-none relative
                  ${checkingPlan || hasPlan === null ? "opacity-60 pointer-events-none" : ""}
                `}
                type="button"
                style={{ appearance: "none" }}
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
                <p className="text-center font-semibold text-xs sm:text-sm md:text-base">
                  {hasPlan
                    ? "Bản kế hoạch của bạn"
                    : t(`cards.${c.titleKey}`)}
                </p>
                {checkingPlan && (
                  <span className="absolute top-1 right-2 text-xs text-white animate-pulse">
                    ...
                  </span>
                )}
              </button>
            ) : (
              <Link
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
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Hero;
