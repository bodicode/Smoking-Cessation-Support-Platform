"use client";

import { Pencil, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useBadges } from '@/hooks/useBadges';
import Pagination from '@/components/common/Pagination';
import toast from 'react-hot-toast';
import Loading from '@/components/common/Loading';
import { CreateBadgeInput } from '@/types/api/badge';
import CreateBadgeForm from '@/components/badges/CreateBadgeForm';
import RequirementForm from '@/components/badges/RequirementForm';

async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}

function renderRequirement(requirement: string | null): React.ReactNode {
  if (!requirement || requirement === 'null' || requirement.trim() === "") return <span className="text-gray-400">-</span>;
  try {
    const req = typeof requirement === "string" ? JSON.parse(requirement) : requirement;

    switch (req.criteria_type) {
      case 'task_completed_at_time':
        return (
          <span>
            Hoàn thành task trước <b>{req.condition?.time_before}</b> mỗi ngày
          </span>
        );
      case 'streak_achieved':
        return (
          <span>
            Đạt chuỗi <b>{req.days}</b> ngày liên tục
          </span>
        );
      case 'first_plan_created':
        return (
          <span>
            Tạo kế hoạch đầu tiên
          </span>
        );
      default:
        return (
          <span className="text-gray-500 text-xs">
            {requirement}
          </span>
        );
    }
  } catch (err) {
    // Nếu lỗi JSON thì hiện chuỗi gốc
    return (
      <span className="text-gray-500 text-xs">{String(requirement)}</span>
    );
  }
}


export default function AdminBadges() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [iconFilter, setIconFilter] = useState('');

  const filters = useMemo(() => ({
    name: search || undefined,
    page: currentPage,
    limit: pageSize,
  }), [search, currentPage, pageSize]);

  const {
    badges,
    loading,
    error,
    update,
    create,
    updating,
    updateError
  } = useBadges(filters);

  const badgeList = badges?.data ?? [];
  const total = badges?.total ?? 0;
  const pageCount = Math.ceil(total / pageSize);

  const icons = useMemo(
    () => [...new Set(badgeList.map((b: any) => b.icon_url || ''))].filter(Boolean),
    [badgeList]
  );

  const filteredBadgeList = iconFilter
    ? badgeList.filter((b: any) => b.icon_url === iconFilter)
    : badgeList;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    id: string;
    name: string;
    description: string;
    sort_order: number;
    icon_url: string;
    requirements: string;
  }>({
    id: '',
    name: '',
    description: '',
    sort_order: 1,
    icon_url: '',
    requirements: ''
  });

  const [creating, setCreating] = useState(false);
  const [newBadge, setNewBadge] = useState<CreateBadgeInput>({
    name: '',
    description: '',
    sort_order: 1,
    icon_url: '',
    badge_type_id: '',
    requirements: ''
  });

  const startEdit = (badge: any) => {
    setEditingId(badge.id);
    setEditValues({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      sort_order: badge.sort_order,
      icon_url: badge.icon_url,
      requirements: badge.requirements || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ id: '', name: '', description: '', sort_order: 1, icon_url: '', requirements: '' });
  };

  const handleUpdate = async () => {
    try {
      await update({ ...editValues });
      setEditingId(null);
      toast.success("Cập nhật badge thành công!");
    } catch (err: any) {
      toast.error(err?.message || "Cập nhật badge thất bại!");
    }
  };

  const handleCreate = async () => {
    try {
      await create(newBadge);
      toast.success("Tạo huy hiệu thành công!");
      setNewBadge({ name: '', description: '', sort_order: 1, icon_url: '', badge_type_id: '', requirements: '' });
      setCreating(false);
    } catch (err: any) {
      toast.error(err?.message || "Tạo huy hiệu thất bại!");
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03256C] mb-1">Quản lý huy hiệu</h1>
        <p className="text-gray-500 text-sm">Thêm, xóa, hoặc sửa huy hiệu.</p>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2 w-full md:w-1/2"
        />

        <button
          onClick={() => setCreating(true)}
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Tạo huy hiệu
        </button>
      </div>

      {creating && (
        <CreateBadgeForm
          onSubmit={async (badge) => {
            try {
              await create(badge);
              toast.success("Tạo huy hiệu thành công!");
              setCreating(false);
              setNewBadge({ name: '', description: '', sort_order: 1, icon_url: '', badge_type_id: '', requirements: '' }); // reset nếu muốn
            } catch (err: any) {
              toast.error(err?.message || "Tạo huy hiệu thất bại!");
            }
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-10 flex justify-center"><Loading /></div>
        ) : (
          <table className="min-w-[800px] w-full divide-y divide-gray-200 bg-white ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">STT</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Huy Hiệu</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Mô tả</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 text-nowrap">Thứ tự hiển thị</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Yêu cầu</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Icon</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-red-500">Error: {error}</td>
                </tr>
              ) : filteredBadgeList.length > 0 ? (
                filteredBadgeList.map((badge: any, idx: number) => (
                  <tr key={badge.id} className={(idx % 2 === 0 ? "bg-white" : "bg-gray-50") + " hover:bg-blue-50 transition-colors"}>
                    <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                      {editingId === badge.id ? (
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={e => setEditValues(ev => ({ ...ev, name: e.target.value }))}
                          className="border px-2 py-1 rounded w-32"
                        />
                      ) : (
                        badge.name
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === badge.id ? (
                        <input
                          type="text"
                          value={editValues.description}
                          onChange={e => setEditValues(ev => ({ ...ev, description: e.target.value }))}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        badge.description
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === badge.id ? (
                        <input
                          type="number"
                          value={editValues.sort_order}
                          onChange={e => setEditValues(ev => ({ ...ev, sort_order: Number(e.target.value) }))}
                          className="border px-2 py-1 w-16 rounded"
                        />
                      ) : (
                        badge.sort_order
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === badge.id ? (
                        <RequirementForm
                          criteriaType={
                            (() => {
                              try {
                                return JSON.parse(editValues.requirements)?.criteria_type || "";
                              } catch {
                                return "";
                              }
                            })()
                          }
                          value={editValues.requirements}
                          onChange={val => setEditValues(ev => ({ ...ev, requirements: val }))}
                        />
                      ) : (
                        <div className="text-sm">
                          {renderRequirement(badge.requirements)}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {editingId === badge.id ? (
                        <div className="flex items-center gap-2">
                          {badge.icon_url ? (
                            <img src={badge.icon_url} alt={badge.name} className="w-8 h-8 rounded" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                              <span>?</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setEditValues(ev => ({
                                  ...ev,
                                  icon_url: URL.createObjectURL(file),
                                }));
                                const url = await uploadImage(file);
                                setEditValues(ev => ({
                                  ...ev,
                                  icon_url: url,
                                }));
                              }
                            }}
                            className="block w-36 text-xs"
                          />
                        </div>
                      ) : (
                        <img src={badge.icon_url} alt={badge.name} className="w-8 h-8 rounded" />
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap space-x-2">
                      {editingId === badge.id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="cursor-pointer px-3 py-1 bg-green-500 text-white rounded mr-2"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={updating}
                            className="cursor-pointer px-3 py-1 bg-gray-300 rounded"
                          >
                            Hủy
                          </button>
                          {updateError && <div className="text-red-500">{updateError}</div>}
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(badge)}
                          className="cursor-pointer inline-flex items-center gap-1 border border-blue-500 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
                        >
                          <Pencil className="w-4 h-4" /> Sửa
                        </button>
                      )}
                      <button className="cursor-pointer inline-flex items-center gap-1 border border-red-500 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition text-sm font-medium">
                        <Trash2 className="w-4 h-4" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">Không tìm thấy badge.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={pageCount}
            onPageChange={setCurrentPage}
            hasNext={badges?.hasNext ?? false}
          />
        </div>
      )}
    </div>
  );
}
