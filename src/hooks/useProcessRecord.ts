import {
  createProgressRecord,
  getProgressRecords,
  removeProgressRecord,
  updateProgressRecord,
} from "@/services/processRecordService";
import { useEffect, useState } from "react";

export function useProgressRecords(planId?: string) {
  const [records, setRecords] = useState<any[]>([]);
  const [totalMoneySaved, setTotalMoneySaved] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!planId) {
      setRecords([]);
      setTotalMoneySaved(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProgressRecords({ planId })
      .then(({ records, totalMoneySaved }) => {
        setRecords(records);
        setTotalMoneySaved(totalMoneySaved);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [planId, reload]);

  const handleCreate = async (input: any) => {
    await createProgressRecord(input);
    setReload((r) => r + 1);
  };

  const handleUpdate = async (id: string, input: any) => {
    await updateProgressRecord({ id, ...input });
    setReload((r) => r + 1);
  };

  const handleDelete = async (id: string) => {
    await removeProgressRecord(id);
    setReload((r) => r + 1);
  };

  return {
    records,
    totalMoneySaved,
    loading,
    error,
    handleCreate,
    reload,
    setReload,
    handleUpdate,
    handleDelete,
  };
}
