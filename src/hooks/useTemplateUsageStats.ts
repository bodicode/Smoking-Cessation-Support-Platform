import { useState, useEffect } from "react";
import { getTemplateUsageStats } from "@/services/templateUsageStatsService";
import { TemplateUsageStats, GetTemplateUsageStatsInput } from "@/types/api/templateUsageStats";

export function useTemplateUsageStats(input: GetTemplateUsageStatsInput) {
  const [stats, setStats] = useState<TemplateUsageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!input.templateId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getTemplateUsageStats(input);
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Lỗi tải thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [input.templateId, input.params?.page, input.params?.limit, input.filters?.status, input.filters?.search]);

  const refetch = async () => {
    if (!input.templateId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getTemplateUsageStats(input);
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refetch
  };
} 