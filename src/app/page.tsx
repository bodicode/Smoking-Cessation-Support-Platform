'use client'

import Achieveboard from "@/components/home/AchieveBoard";
import BlogSection from "@/components/home/BlogSection";
import Hero from "@/components/home/Hero";
import SmokeFreeStats from "@/components/home/smokeStats";
import SuccessStories from "@/components/home/SuccessStories";
import SupportTips from "@/components/home/SupportTips";
import { useCustomStages } from "@/hooks/useCustomStage";
import { useProgressRecords } from "@/hooks/useProcessRecord";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const {
    plans,
    loading: loadingPlans,
  } = user?.accessToken ? useCustomStages() : { plans: [], loading: false };

  const plan =
    plans.find((p) => p.status === "ACTIVE") ||
    plans[0] ||
    null;

  const {
    records,
    loading: loadingRecords,
  } = useProgressRecords(plan?.id);

  const loading = loadingPlans || loadingRecords;

  return (
    <div className="min-screen">
      <Hero />

      {plan && plan.status !== "CANCELLED" ? (
        <SmokeFreeStats
          plan={{
            id: plan.id,
            created_at: plan.start_date,
            target_date: plan.target_date,
          }}
          records={records}
          loading={loading}
          avgPricePerPack={32000}
          cigarettesPerPack={20}
        />
      ) : (
        <div className="max-w-5xl mx-auto mt-10 bg-white/50 rounded-2xl flex flex-col items-center gap-4 p-10 border border-blue-100">
          <svg width="56" height="56" fill="none" viewBox="0 0 24 24" className="text-blue-400 mb-1">
            <path d="M12 2v2m0 16v2m8-10h2M2 12H4m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m0 12.728l-1.414 1.414m15.142-15.142l-1.414 1.414" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-xl md:text-2xl font-bold text-sky-700 mb-1">Bạn chưa có kế hoạch bỏ thuốc nào</h3>
          <div className="text-gray-500 text-base mb-4 text-center">
            Hãy bắt đầu hành trình mới để cải thiện sức khoẻ và tiết kiệm hơn mỗi ngày!
          </div>
          <Link
            href="/template"
            className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-7 rounded-xl shadow transition-all duration-150"
          >
            Tạo kế hoạch mới
          </Link>
        </div>
      )}

      <SupportTips />
      <Achieveboard />
      <BlogSection />
      <SuccessStories />
    </div>
  );
}
