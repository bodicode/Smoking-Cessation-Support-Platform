"use client";

import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { createMembershipPackage, updateMembershipPackage, getMembershipPackages } from "@/services/membershipService";

// Update: description is always a string array
type Pack = {
  id?: string;
  name: string;
  price: number;
  duration: number;
  description: string[];
};

export default function AdminMembership() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createPack, setCreatePack] = useState({
    name: "",
    price: 0,
    duration: 1,
    description: "", // textarea value, will split to array
  });

  // For edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editModalPack, setEditModalPack] = useState<Pack>({
    name: "",
    price: 0,
    duration: 1,
    description: [],
  });
  const [updating, setUpdating] = useState(false);

  // Fetch membership packages from service on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMembershipPackages();
        setPacks(
          data.map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
            duration: pkg.duration_days,
            description: Array.isArray(pkg.description) ? pkg.description : [pkg.description],
          }))
        );
      } catch (e) {
        setPacks([]);
      }
    }
    fetchData();
  }, []);

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditModalPack({ ...packs[idx] });
    setShowEdit(true);
  };

  const deletePack = (idx: number) => {
    setPacks(packs.filter((_, i) => i !== idx));
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const descArr = createPack.description
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      const newPack = await createMembershipPackage({
        name: createPack.name,
        price: createPack.price,
        duration_days: createPack.duration,
        description: descArr,
      });
      setPacks([...packs, {
        name: newPack.name,
        price: newPack.price,
        duration: newPack.duration_days,
        description: Array.isArray(newPack.description) ? newPack.description : [newPack.description],
      }]);
      setShowCreate(false);
      setCreatePack({ name: "", price: 0, duration: 1, description: "" });
    } catch (e) {
      alert("Tạo gói mới thất bại!");
    }
    setCreating(false);
  };

  const handleUpdate = async () => {
    if (editingIdx === null) return;
    setUpdating(true);
    try {
      const pack = packs[editingIdx];
      // Fix type issue: always treat as string or string[]
      let descArr: string[];
      const descRaw = editModalPack.description as unknown;
      if (Array.isArray(descRaw)) {
        descArr = descRaw as string[];
      } else if (typeof descRaw === "string") {
        descArr = (descRaw as string)
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0);
      } else {
        descArr = [];
      }
      if (!("id" in pack) || !pack.id) {
        const newPacks = [...packs];
        newPacks[editingIdx] = { ...editModalPack, description: descArr };
        setPacks(newPacks);
        setShowEdit(false);
        setUpdating(false);
        return;
      }
      const updated = await updateMembershipPackage({
        id: pack.id,
        name: editModalPack.name,
        price: editModalPack.price,
        duration_days: editModalPack.duration,
        description: descArr,
      });
      const newPacks = [...packs];
      newPacks[editingIdx] = {
        ...newPacks[editingIdx],
        name: updated.name,
        price: updated.price,
        duration: updated.duration_days,
        description: Array.isArray(updated.description) ? updated.description : [updated.description],
      };
      setPacks(newPacks);
      setShowEdit(false);
    } catch (e) {
      alert("Cập nhật gói thất bại!");
    }
    setUpdating(false);
  };

  return (
    <div className="max-w-8xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#03256C] mb-1">Manage Membership Packs</h1>
          <p className="text-gray-500 text-sm">Edit, update, or remove membership packs for users.</p>
        </div>
        <div className="mb-4 flex justify-end">
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            onClick={() => setShowCreate(true)}
          >
            Tạo gói mới
          </button>
        </div>
        {/* Modal for creating new package */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setShowCreate(false)}
                aria-label="Đóng"
                tabIndex={0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold mb-6 text-[#03256C] text-center">Tạo gói thành viên mới</h2>
              <form
                className="flex flex-col gap-5"
                onSubmit={e => {
                  e.preventDefault();
                  handleCreate();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên gói</label>
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition"
                    placeholder="Tên gói"
                    value={createPack.name}
                    onChange={e => setCreatePack({ ...createPack, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (₫)</label>
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition"
                      type="number"
                      min={0}
                      placeholder="Giá"
                      value={createPack.price}
                      onChange={e => setCreatePack({ ...createPack, price: +e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn (tháng)</label>
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition"
                      type="number"
                      min={1}
                      placeholder="Thời hạn"
                      value={createPack.duration}
                      onChange={e => setCreatePack({ ...createPack, duration: +e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (mỗi dòng là một mục)</label>
                  <textarea
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition resize-none"
                    placeholder="Mỗi dòng là một mô tả, ví dụ:
Thời hạn: 30 ngày
Coach hỗ trợ 24/7"
                    value={createPack.description}
                    onChange={e => setCreatePack({ ...createPack, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold transition"
                    onClick={() => setShowCreate(false)}
                    disabled={creating}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                    disabled={creating}
                  >
                    {creating ? "Đang tạo..." : "Tạo"}
                  </button>
                </div>
              </form>
            </div>
            <style jsx global>{`
              .animate-fade-in {
                animation: fadeInModal 0.2s ease;
              }
              @keyframes fadeInModal {
                from { opacity: 0; transform: translateY(24px);}
                to { opacity: 1; transform: translateY(0);}
              }
            `}</style>
          </div>
        )}
        {/* Modal for editing package */}
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setShowEdit(false)}
                aria-label="Đóng"
                tabIndex={0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold mb-6 text-[#03256C] text-center">Chỉnh sửa gói thành viên</h2>
              <form
                className="flex flex-col gap-5"
                onSubmit={e => {
                  e.preventDefault();
                  handleUpdate();
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên gói</label>
                  <input
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition"
                    placeholder="Tên gói"
                    value={editModalPack.name}
                    onChange={e => setEditModalPack({ ...editModalPack, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (₫)</label>
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition"
                      type="number"
                      min={0}
                      placeholder="Giá"
                      value={editModalPack.price}
                      onChange={e => setEditModalPack({ ...editModalPack, price: +e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn (tháng)</label>
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition"
                      type="number"
                      min={1}
                      placeholder="Thời hạn"
                      value={editModalPack.duration}
                      onChange={e => setEditModalPack({ ...editModalPack, duration: +e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (mỗi dòng là một mục)</label>
                  <textarea
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition resize-none"
                    placeholder="Mỗi dòng là một mô tả"
                    value={Array.isArray(editModalPack.description) ? editModalPack.description.join('\n') : ""}
                    onChange={e => setEditModalPack({ ...editModalPack, description: e.target.value.split('\n') })}
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold transition"
                    onClick={() => setShowEdit(false)}
                    disabled={updating}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                    disabled={updating}
                  >
                    {updating ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
            <style jsx global>{`
              .animate-fade-in {
                animation: fadeInModal 0.2s ease;
              }
              @keyframes fadeInModal {
                from { opacity: 0; transform: translateY(24px);}
                to { opacity: 1; transform: translateY(0);}
              }
            `}</style>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Price (₫)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Duration (months)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packs.map((pack, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition-colors"}>
                  <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {pack.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {pack.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {pack.duration}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ul className="list-disc pl-5">
                      {Array.isArray(pack.description)
                        ? pack.description.map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))
                        : null}
                    </ul>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap space-x-2">
                    <button
                      className="inline-flex items-center gap-1 border border-blue-500 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
                      onClick={() => startEdit(idx)}
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button className="inline-flex items-center gap-1 border border-red-500 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition text-sm font-medium" onClick={() => deletePack(idx)}>
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {packs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">No membership packs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}