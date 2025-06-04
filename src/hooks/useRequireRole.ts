import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useRequireRole(role: string) {
    const user = useSelector((state: any) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (user?.role === undefined) return;

        if (user?.role !== role) {
            router.replace("/");
        }
    }, [user?.role, role, router]);
}
