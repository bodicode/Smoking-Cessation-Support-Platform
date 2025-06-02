import Achieveboard from "@/components/home/AchieveBoard";
import BlogSection from "@/components/home/BlogSection";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import SmokeFreeStats from "@/components/home/smokeStats";
import SuccessStories from "@/components/home/SuccessStories";
import SupportTips from "@/components/home/SupportTips";


export default function Home() {
  return (
    <div className="min-screen">
      <Hero />
      <SmokeFreeStats
        startDate="2025-05-31T14:10:00"
        avgPerDay={15}
        avgPricePerPack={32000}
        cigarettesPerPack={20}
      />
      <SupportTips />
      <Achieveboard />
      <BlogSection />
      <SuccessStories />
    </div>
  );
}
