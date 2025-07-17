"use client";

import { getAllUsers, removeUserByAdmin, updateUserByAdmin, createUserByAdmin } from "@/services/userService";
import { User } from "@/types/api/user";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronUp, ChevronDown, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import ModalConfirm from "@/components/common/ModalConfirm";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";

type SortKey = keyof User;
type SortOrder = "asc" | "desc";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "MEMBER", status: "ACTIVE" });
  const [editLoading, setEditLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    user_name: "",
    email: "",
    password: "",
    role: "MEMBER",
    status: "ACTIVE",
  });
  const [createLoading, setCreateLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.user_name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue === undefined || bValue === undefined) return 0;
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDelete = async (id: string) => {
    setRemovingId(id);
    try {
      await removeUserByAdmin(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message || "Lỗi khi xóa người dùng");
    } finally {
      setRemovingId(null);
    }
  };

  const handleOpenDeleteModal = (id: string) => {
    setSelectedUserId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;
    setRemovingId(selectedUserId);
    setModalOpen(false);
    try {
      await removeUserByAdmin(selectedUserId);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
      toast.success("Xóa người dùng thành công");
    } catch (err: any) {
      toast.error("Lỗi khi xóa người dùng");
    } finally {
      setRemovingId(null);
      setSelectedUserId(null);
    }
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({ name: user.name, role: user.role, status: user.status });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditLoading(true);
    try {
      const updateUserInput = {
        id: editingUser.id,
        name: editForm.name,
        role: editForm.role,
        status: editForm.status,
      };
      const updatedUser = await updateUserByAdmin(updateUserInput);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      setEditModalOpen(false);
      setEditingUser(null);
      toast.success("Cập nhật người dùng thành công");
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật người dùng");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const createUserInput = {
        name: createForm.name,
        username: createForm.user_name,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role,
        status: createForm.status,
      };
      const data = await createUserByAdmin(createUserInput);
      setUsers((prev) => [
        {
          id: data.user.id,
          name: data.user.user_metadata.name,
          user_name: data.user.user_metadata.user_name,
          role: data.user.user_metadata.role,
          status: createForm.status,
          created_at: new Date().toISOString(),
          avatar_url: "",
          coach_profile: null,
          member_profile: null,
        },
        ...prev,
      ]);
      setCreateModalOpen(false);
      setCreateForm({
        name: "",
        user_name: "",
        email: "",
        password: "",
        role: "MEMBER",
        status: "ACTIVE",
      });
      toast.success("Tạo người dùng thành công");
    } catch (err: any) {
      setError(err.message || "Lỗi khi tạo người dùng");
    } finally {
      setCreateLoading(false);
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
        Danh sách người dùng
      </motion.h1>

      <div className="relative mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer my-4"
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm người dùng
        </button>
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
            {error}
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
                <th
                  onClick={() => handleSort("name")}
                  className="p-4 text-left cursor-pointer hover:bg-gray-200"
                >
                  Tên {sortKey === "name" && (sortOrder === "asc" ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
                </th>
                <th
                  onClick={() => handleSort("user_name")}
                  className="p-4 text-left cursor-pointer hover:bg-gray-200"
                >
                  Username {sortKey === "user_name" && (sortOrder === "asc" ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
                </th>
                <th
                  onClick={() => handleSort("role")}
                  className="p-4 text-left cursor-pointer hover:bg-gray-200"
                >
                  Vai trò {sortKey === "role" && (sortOrder === "asc" ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="p-4 text-left cursor-pointer hover:bg-gray-200"
                >
                  Trạng thái {sortKey === "status" && (sortOrder === "asc" ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
                </th>
                <th
                  onClick={() => handleSort("created_at")}
                  className="p-4 text-left cursor-pointer hover:bg-gray-200"
                >
                  Ngày tạo {sortKey === "created_at" && (sortOrder === "asc" ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
                </th>
                <th className="p-4 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.user_name}</td>
                    <td className="p-4">{user.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${user.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(user.created_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-4 flex items-center justify-start">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="flex items-center gap-1 px-3 py-1 text-yellow-600 hover:bg-yellow-100 rounded-md transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(user.id)}
                        disabled={removingId === user.id}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                        title="Xóa người dùng"
                      >
                        <Trash2 className="w-4 h-4" />
                        {removingId === user.id ? "Đang xóa..." : ""}
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
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
        title="Xác nhận xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalOpen(false)}
      />
      {editModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-xs w-full"
          >
            <div className="font-bold text-lg mb-4">Chỉnh sửa người dùng</div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Tên</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Vai trò</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={editForm.role}
                onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
              >
                <option value="MEMBER">MEMBER</option>
                <option value="COACH">COACH</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Trạng thái</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={editForm.status}
                onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => setEditModalOpen(false)}
                disabled={editLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                disabled={editLoading}
              >
                {editLoading ? <Loading color="#fff" /> : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-xs w-full"
          >
            <div className="font-bold text-lg mb-4">Thêm người dùng mới</div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Tên</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={createForm.name}
                onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Username</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={createForm.user_name}
                onChange={e => setCreateForm(f => ({ ...f, user_name: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={createForm.email}
                onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Mật khẩu</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={createForm.password}
                onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Vai trò</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={createForm.role}
                onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))}
              >
                <option value="MEMBER">MEMBER</option>
                <option value="COACH">COACH</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Trạng thái</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={createForm.status}
                onChange={e => setCreateForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => setCreateModalOpen(false)}
                disabled={createLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                disabled={createLoading}
              >
                {createLoading ? <Loading color="#fff" /> : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;