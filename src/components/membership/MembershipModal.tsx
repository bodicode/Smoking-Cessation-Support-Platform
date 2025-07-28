interface MembershipModalProps {
  showCreate: boolean;
  setShowCreate: (v: boolean) => void;
  creating: boolean;
  createPack: { name: string; price: number; duration: number; description: string };
  setCreatePack: (v: any) => void;
  handleCreate: () => void;
  showEdit: boolean;
  setShowEdit: (v: boolean) => void;
  updating: boolean;
  editModalPack: { name: string; price: number; duration: number; description: string[] | string };
  setEditModalPack: (v: any) => void;
  handleUpdate: () => void;
}

export default function MembershipModal({
  showCreate,
  setShowCreate,
  creating,
  createPack,
  setCreatePack,
  handleCreate,
  showEdit,
  setShowEdit,
  updating,
  editModalPack,
  setEditModalPack,
  handleUpdate,
}: MembershipModalProps) {
  return (
    <>
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
    </>
  );
}
