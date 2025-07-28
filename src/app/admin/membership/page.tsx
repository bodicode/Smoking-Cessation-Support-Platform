"use client";

import { useState, useEffect } from 'react';
import { createMembershipPackage, updateMembershipPackage, getMembershipPackages } from "@/services/membershipService";
import { SuccessToast, ErrorToast } from "@/components/common/CustomToast";
import toast from "react-hot-toast";
import MembershipTable from "@/components/membership/MembershipTable";
import MembershipModal from "@/components/membership/MembershipModal";

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
    description: "",
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
      toast.custom(<SuccessToast message="Tạo gói thành viên thành công!" />);
    } catch (e) {
      toast.custom(<ErrorToast message="Tạo gói mới thất bại!" />);
    }
    setCreating(false);
  };

  const handleUpdate = async () => {
    if (editingIdx === null) return;
    setUpdating(true);
    try {
      const pack = packs[editingIdx];
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
        toast.custom(<SuccessToast message="Cập nhật gói thành viên thành công!" />);
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
      toast.custom(<SuccessToast message="Cập nhật gói thành viên thành công!" />);
    } catch (e) {
      toast.custom(<ErrorToast message="Cập nhật gói thất bại!" />);
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
        {/* Membership Modal for create/edit */}
        <MembershipModal
          showCreate={showCreate}
          setShowCreate={setShowCreate}
          creating={creating}
          createPack={createPack}
          setCreatePack={setCreatePack}
          handleCreate={handleCreate}
          showEdit={showEdit}
          setShowEdit={setShowEdit}
          updating={updating}
          editModalPack={editModalPack}
          setEditModalPack={setEditModalPack}
          handleUpdate={handleUpdate}
        />
        {/* Membership Table */}
        <MembershipTable
          packs={packs}
          startEdit={startEdit}
          deletePack={deletePack}
        />
      </div>
    </div>
  );
}