"use client";

import { Trash2, ChevronUp, ChevronDown, Search, AlertCircle } from 'lucide-react';
import { getPlanTemplates, removePlanTemplate } from "@/services/templateService";
import { getAllCoaches } from "@/services/userService";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import toast from "react-hot-toast";
import ModalConfirm from "@/components/common/ModalConfirm";

export default function AdminTemplates() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string>("");

  useEffect(() => {
    getAllCoaches().then(setCoaches).catch(() => setCoaches([]));
  }, []);

  const { templates, total, loading, error, refetch } = getPlanTemplates({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    orderBy: 'name',
    sortOrder,
    filters: selectedCoach ? { coachId: selectedCoach } : undefined,
  });

  const pageCount = Math.ceil(total / pageSize);
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(pageCount, startPage + maxPagesToShow - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const handleSortName = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleOpenDeleteModal = (id: string) => {
    setSelectedTemplateId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTemplateId) return;
    setRemovingId(selectedTemplateId);
    setModalOpen(false);
    try {
      await removePlanTemplate(selectedTemplateId);
      toast.success("Xóa template thành công");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Xóa template thất bại");
    } finally {
      setRemovingId(null);
      setSelectedTemplateId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Danh sách mẫu kế hoạch
      </motion.h1>

      <div className="relative mb-6 flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm mẫu kế hoạch..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <select
          value={selectedCoach}
          onChange={e => setSelectedCoach(e.target.value)}
          className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả Coach</option>
          {coaches.map(coach => (
            <option key={coach.id} value={coach.id}>{coach.name}</option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {typeof error === 'string' ? error : error.message}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 text-left">No</th>
                <th
                  onClick={handleSortName}
                  className="p-4 text-left cursor-pointer hover:bg-gray-200"
                >
                  Tên mẫu kế hoạch {sortOrder === "asc" ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />}
                </th>
                <th className="p-4 text-left">Coach</th>
                <th className="p-4 text-left">Ngày tạo</th>
                <th className="p-4 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Không có mẫu kế hoạch nào
                  </td>
                </tr>
              ) : (
                templates.map((template: any, idx: number) => (
                  <motion.tr
                    key={template.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="p-4">{template.name}</td>
                    <td className="p-4">{template.coach?.name || '-'}</td>
                    <td className="p-4">{template.created_at ? new Date(template.created_at).toLocaleDateString('vi-VN') : '-'}</td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDeleteModal(template.id)}
                        disabled={removingId === template.id}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                        {removingId === template.id ? "Đang xóa..." : ""}
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>

          {pageCount > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                Trang {currentPage} / {pageCount}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                disabled={currentPage === pageCount}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}
      <ModalConfirm
        open={modalOpen}
        title="Xác nhận xóa template"
        message="Bạn có chắc chắn muốn xóa template này? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}