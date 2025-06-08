import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRequireRole(role: string) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== role) {
            router.replace("/");
        }
    }, [user, role, router]);
}
