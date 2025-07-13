import { useState, useEffect, useCallback } from "react";
import { createBadge, getBadges, updateBadge } from "@/services/badgesService";
import { BadgesResponse, CreateBadgeInput, UpdateBadgeInput } from "@/types/api/badge";

export function useBadges(filters: any = {}) {
    const [badges, setBadges] = useState<BadgesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const fetchBadgeList = useCallback(() => {
        setLoading(true);
        setError(null);
        getBadges(filters)
            .then((res) => {
                setBadges(res);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Lỗi khi lấy badges");
                setLoading(false);
            });
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchBadgeList();
    }, [fetchBadgeList]);

    const update = async (input: UpdateBadgeInput) => {
        setUpdating(true);
        setUpdateError(null);
        try {
            await updateBadge(input);
            setUpdating(false);
            fetchBadgeList();
        } catch (err: any) {
            setUpdateError(err.message || "Update badge failed");
            setUpdating(false);
            throw err;
        }
    };

    const create = async (input: CreateBadgeInput) => {
        setUpdating(true);
        setUpdateError(null);
        try {
            await createBadge(input);
            setUpdating(false);
            fetchBadgeList();
        } catch (err: any) {
            setUpdateError(err.message || "Create badge failed");
            setUpdating(false);
            throw err;
        }
    };

    return { badges, loading, error, update, create, updating, updateError };


}
