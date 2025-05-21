import Achieveboard from "@/components/home/AchieveBoard";
import BlogSection from "@/components/home/BlogSection";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import SuccessStories from "@/components/home/SuccessStories";
import SupportTips from "@/components/home/SupportTips";


export default function Home() {
  return (
    <div className="min-h-screen bg-[#fefcf6]">
      <Header />
      <Hero />
      <Achieveboard />
      <SupportTips />
      <BlogSection />
      <SuccessStories />
      <Footer />
    </div>
  );
}
