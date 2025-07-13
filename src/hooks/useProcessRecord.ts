import {
  createProgressRecord,
  getProgressRecords,
  removeProgressRecord,
  updateProgressRecord,
} from "@/services/processRecordService";
import { useEffect, useState } from "react";

export function useProgressRecords(planId: string) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!planId) return;
    setLoading(true);
    getProgressRecords({ planId })
      .then(setRecords)
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
    loading,
    error,
    handleCreate,
    reload,
    setReload,
    handleUpdate,
    handleDelete,
  };
}
