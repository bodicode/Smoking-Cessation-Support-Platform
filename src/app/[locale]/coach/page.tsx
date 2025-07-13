"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";

export default function CoachHome() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/coach/chat");
    }, [router]);

    return <Loading />;
}
