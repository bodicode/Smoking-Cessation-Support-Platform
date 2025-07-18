import { useState } from "react";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { useProgressRecords } from "@/hooks/useProcessRecord";
import ProgressRecordForm from "./ProcessRecordForm";
import ConfirmModal from "@/components/common/ModalConfirm";
import CriteriaModal from "./CriteriaModal";

export default function ProgressRecordTable({
  planId,
  coachId,
}: {
  planId: string;
  coachId: string;
}) {
  const { records, loading, error, handleCreate, handleUpdate, handleDelete } =
    useProgressRecords(planId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);

  const startEdit = (rec: any) => {
    setEditingId(rec.id);
    setEditData({
      record_date: rec.record_date?.slice(0, 10),
      cigarettes_smoked: rec.cigarettes_smoked,
      health_score: rec.health_score,
      notes: rec.notes,
    });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleUpdate(editingId!, editData);
      toast.success("Cập nhật thành công!");
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message || "Cập nhật thất bại!");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await handleDelete(deleteId);
      toast.success("Đã xóa ghi nhận!");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Xóa thất bại!");
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-red-600">
        Lỗi: {error.message || "Không lấy được dữ liệu"}
      </div>
    );

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sky-700">
          Theo dõi quá trình hàng ngày
        </h2>
        <button
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow transition"
          onClick={() => setShowForm((v) => !v)}
        >
          <Plus size={20} /> {showForm ? "Đóng" : "Ghi nhận mới"}
        </button>
      </div>
      {showForm && (
        <div className="mb-8">
          <ProgressRecordForm
            coachId={coachId}
            planId={planId}
            handleCreate={handleCreate}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md border overflow-hidden">
          <thead>
            <tr className="bg-sky-100 text-sky-800 text-base">
              <th className="px-5 py-3 font-bold text-center rounded-tl-xl">
                Ngày ghi nhận
              </th>
              <th className="px-5 py-3 font-bold text-center">Số điếu hút</th>
              <th className="px-5 py-3 font-bold text-center">
                Sức khỏe (1-10)
              </th>
              <th className="px-5 py-3 font-bold text-left">Ghi chú</th>
              <th className="px-5 py-3 rounded-tr-xl"></th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) =>
              editingId === rec.id ? (
                <tr key={rec.id} className="bg-yellow-50 border-b">
                  <td className="px-5 py-3 text-center">
                    <input
                      type="date"
                      value={editData.record_date}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          record_date: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1 w-[120px] text-center"
                    />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      value={editData.cigarettes_smoked}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          cigarettes_smoked: +e.target.value,
                        })
                      }
                      className="border rounded px-2 py-1 w-[80px] text-center"
                    />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={editData.health_score}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            health_score: +e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 w-[80px] text-center"
                      />
                      <HelpCircle
                        size={20}
                        className="text-sky-500 hover:text-sky-700 cursor-pointer transition"
                        onClick={() => setShowCriteriaModal(true)}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <input
                      type="text"
                      value={editData.notes}
                      onChange={(e) =>
                        setEditData({ ...editData, notes: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-5 py-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={submitEdit}
                      className="cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-semibold"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="cursor-pointer bg-gray-100 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 font-semibold"
                    >
                      Huỷ
                    </button>
                  </td>
                </tr>
              ) : (
                <tr
                  key={rec.id}
                  className="hover:bg-sky-50 border-b transition"
                >
                  <td className="px-5 py-3 text-center font-medium text-gray-800">
                    {new Date(rec.record_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-5 py-3 text-center text-lg text-sky-700 font-semibold">
                    {rec.cigarettes_smoked}
                  </td>
                  <td className="px-5 py-3 text-center text-lg text-green-700 font-bold">
                    <div className="flex items-center justify-center gap-2">
                      {rec.health_score}
                      <HelpCircle
                        size={20}
                        className="text-sky-500 hover:text-sky-700 cursor-pointer transition"
                        onClick={() => setShowCriteriaModal(true)}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-700 whitespace-pre-line max-w-[200px] break-words text-left">
                    {rec.notes}
                  </td>
                  <td className="px-5 py-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => startEdit(rec)}
                      className="cursor-pointer bg-sky-500 hover:bg-sky-700 text-white rounded-lg px-4 py-2 font-semibold transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => setDeleteId(rec.id)}
                      className="cursor-pointer bg-red-500 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-semibold transition"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            Chưa có ghi nhận nào
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa ghi nhận này không?"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <CriteriaModal
        open={showCriteriaModal}
        onClose={() => setShowCriteriaModal(false)}
        coachId={coachId}
      />
    </div>
  );
}
