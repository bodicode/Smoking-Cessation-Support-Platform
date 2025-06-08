"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/store/userSlice";

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
    pathname?.includes("/forgot-password");
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

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
  }, [user?.accessToken, dispatch]);

  return (
    <div className="bg-[#f9f5ec]">
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </div>
  );
}
