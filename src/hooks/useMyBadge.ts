import { getMyAwardedBadges } from "@/services/badgesService";
import { useEffect, useState, useCallback } from "react";

export function useMyBadges(
    params: any = { page: 1, limit: 10 },
    filters: any = {}
) {
    const [badges, setBadges] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBadges = useCallback(() => {
        setLoading(true);
        setError(null);
        getMyAwardedBadges(params, filters)
            .then((res) => {
                setBadges(res);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Không thể lấy danh sách badge của bạn");
                setLoading(false);
            });
    }, [JSON.stringify(params), JSON.stringify(filters)]);

    useEffect(() => {
        fetchBadges();
    }, [fetchBadges]);

    return { badges, loading, error, refresh: fetchBadges };
}
