"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import MembershipBanner from "@/components/common/MembershipBanner";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/store/userSlice";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/common/Loading";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import ChatBubble from "@/components/myPlan/ChatBubble";
import { useUserPlans } from "@/hooks/useUserPlans";
// Import SubscriptionProvider

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout =
    pathname?.includes("/login") ||
    pathname?.includes("/signup") ||
    pathname?.includes("/coach") ||
    pathname?.includes("/admin") ||
    pathname?.includes("/forgot-password");
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const { hasActivePlans, loading: loadingPlans } = useUserPlans();
  const [chatKey, setChatKey] = useState(0);

  useEffect(() => {
    if (!user?.accessToken) {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        try {
          const decoded: any = jwtDecode(accessToken);
          const userData = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.user_metadata?.role,
            accessToken,
            name: decoded.user_metadata?.name,
          };
          dispatch(setUser(userData));
        } catch (e) {
          localStorage.removeItem("access_token");
        }
      }
    }
    setTimeout(() => setHydrated(true), 0);
  }, [user?.accessToken, dispatch]);

  // Reset chat component when user changes
  useEffect(() => {
    if (user?.id) {
      setChatKey(prev => prev + 1);
    }
  }, [user?.id]);

  if (!hydrated) {
    return <Loading />;
  }

  return (
    <div className="bg-[#f9f5ec]">
      <SubscriptionProvider>
        {!hideLayout && <MembershipBanner />}
        {!hideLayout && <Header />}
        {children}
        {!hideLayout && <Footer />}
        {hasActivePlans && !loadingPlans && <ChatBubble key={chatKey} />}
      </SubscriptionProvider>
    </div>
  );
}
