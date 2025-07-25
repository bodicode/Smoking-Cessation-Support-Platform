"use client";

import { useState, useEffect, useRef } from "react";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useHealthScoreCriteria } from "@/services/healthScoreCriteriaService";
import { useAuth } from "@/hooks/useAuth";

interface HealthCriteriaItem {
  id: string;
  title: string;
  description: string;
  coach_id?: string;
}

interface HealthCriteriaFormData {
  title: string;
  description: string;
}

interface HealthCriteriaFormProps {
  onSubmit: (data: HealthCriteriaFormData) => void;
  defaultData?: HealthCriteriaFormData | null;
  onClose: () => void;
  isSubmitting: boolean;
}

const htmlToListText = (htmlString: string): string => {
  if (!htmlString) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const listItems = Array.from(doc.querySelectorAll("li"));

  return listItems
    .map((li) => li.textContent?.trim())
    .filter(Boolean)
    .join("\n");
};

const listTextToHtml = (plainText: string): string => {
  if (!plainText) return "";

  const lines = plainText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return "";

  return lines.map((line) => `<li>${line}</li>`).join("");
};

const HealthCriteriaForm = ({
  onSubmit,
  defaultData,
  onClose,
  isSubmitting,
}: HealthCriteriaFormProps) => {
  const [formData, setFormData] = useState<HealthCriteriaFormData>(
    defaultData
      ? { ...defaultData, description: htmlToListText(defaultData.description) }
      : { title: "", description: "" }
  );
  const isEditing = !!defaultData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      description: listTextToHtml(formData.description),
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border mb-8">
      <h3 className="text-lg font-bold text-sky-700 mb-4">
        {isEditing ? "Sửa Tiêu chí" : "Thêm Tiêu chí mới"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Tiêu đề
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            rows={4}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loading color="#ffffff" />
            ) : isEditing ? (
              "Lưu thay đổi"
            ) : (
              "Thêm mới"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function HealthCriteriaPage() {
  const { user } = useAuth();
  const coachId = user?.id || null;

  const {
    criteriaList,
    loading: criteriaLoading,
    error,
    handleCreate,
    handleUpdate,
  } = useHealthScoreCriteria(coachId);

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<HealthCriteriaItem | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const authErrorToasted = useRef(false);

  useEffect(() => {
    if (!authErrorToasted.current) {
      if (!user) {
        toast.error(
          "Bạn cần đăng nhập với tài khoản huấn luyện viên để quản lý tiêu chí sức khỏe."
        );
        authErrorToasted.current = true;
      }
    }
  }, [user]);

  const startEdit = (item: HealthCriteriaItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const submitForm = async (formData: HealthCriteriaFormData) => {
    setIsSubmittingForm(true);
    try {
      if (editingItem) {
        const updateInput = {
          title: formData.title,
          description: formData.description,
        };
        await handleUpdate(editingItem.id, updateInput);
        toast.success("Cập nhật tiêu chí thành công!");
      } else {
        await handleCreate(formData);
        toast.success("Thêm tiêu chí mới thành công!");
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (err: any) {
      toast.error(err.message || "Thao tác thất bại!");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (criteriaLoading) return <Loading />;

  if (error)
    return (
      <div className="text-red-600">
        Lỗi: {error.message || "Không lấy được dữ liệu"}
      </div>
    );

  if (!user) {
    return (
      <div className="text-center py-8 text-gray-600">
        Bạn cần đăng nhập với tài khoản huấn luyện viên để quản lý tiêu chí sức
        khỏe.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-sky-700">
          Quản lý Tiêu chí Sức khỏe
        </h1>
        {criteriaList.length === 0 && (
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm((v) => !v);
            }}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold shadow transition"
          >
            {showForm ? (
              <div className="flex items-center gap-2">
                <X size={20} />
                <p>Đóng form</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus size={20} />
                <p>Thêm tiêu chí mới</p>
              </div>
            )}
          </button>
        )}
      </div>

      {showForm && (
        <HealthCriteriaForm
          onSubmit={submitForm}
          defaultData={editingItem}
          onClose={() => setShowForm(false)}
          isSubmitting={isSubmittingForm}
        />
      )}

      {criteriaList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-md border overflow-hidden">
            <thead>
              <tr className="bg-sky-100 text-sky-800 text-base">
                <th className="px-5 py-3 font-bold text-left rounded-tl-xl">
                  Tiêu đề
                </th>
                <th className="px-5 py-3 font-bold text-left">
                  Mô tả chi tiết
                </th>
                <th className="px-5 py-3 rounded-tr-xl"></th>
              </tr>
            </thead>
            <tbody>
              {criteriaList.map((item: HealthCriteriaItem) => (
                <tr
                  key={item.id}
                  className="hover:bg-sky-50 border-b transition"
                >
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {item.title}
                  </td>
                  <td className="px-5 py-3 text-gray-700">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </td>
                  <td className="px-5 py-3 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => startEdit(item)}
                      className="cursor-pointer bg-sky-500 hover:bg-sky-700 text-white rounded-lg p-2 font-semibold transition"
                      aria-label="Sửa"
                      disabled={isSubmittingForm}
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 border border-dashed rounded-xl">
          <p>Không có tiêu chí nào được thiết lập.</p>
          <p>Vui lòng bấm "Thêm tiêu chí mới" để bắt đầu.</p>
        </div>
      )}
    </div>
  );
}
