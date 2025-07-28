import { Pencil, Trash2 } from 'lucide-react';
import { updateMembershipPackage } from "@/services/membershipService";
import { SuccessToast, ErrorToast } from "@/components/common/CustomToast";
import toast from "react-hot-toast";

type Pack = {
  id?: string;
  name: string;
  price: number;
  duration: number;
  description: string[];
  is_active?: boolean;
};

interface MembershipTableProps {
  packs: Pack[];
  startEdit: (idx: number) => void;
  deletePack: (idx: number) => void;
  handleToggleActive: (pack: Pack, idx: number) => void;
}

export default function MembershipTable({ packs, startEdit, deletePack, handleToggleActive }: MembershipTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Price (₫)</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Duration (days)</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {packs.map((pack, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition-colors"}>
              <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
              <td className="px-4 py-3 whitespace-nowrap">{pack.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">{pack.price.toLocaleString()}</td>
              <td className="px-4 py-3 whitespace-nowrap">{pack.duration}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <ul className="list-disc pl-5">
                  {Array.isArray(pack.description)
                    ? pack.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))
                    : null}
                </ul>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <button
                  className={`px-3 py-1 rounded-lg font-semibold transition text-sm ${
                    pack.is_active
                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                      : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  }`}
                  onClick={() => handleToggleActive(pack, idx)}
                  title={pack.is_active ? "Đang hoạt động" : "Đã tắt"}
                >
                  {pack.is_active ? "Đang hoạt động" : "Đã tắt"}
                </button>
              </td>
              <td className="px-4 py-3 whitespace-nowrap space-x-2">
                <button
                  className="inline-flex items-center gap-1 border border-blue-500 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
                  onClick={() => startEdit(idx)}
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  className="inline-flex items-center gap-1 border border-red-500 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                  onClick={() => deletePack(idx)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </td>
            </tr>
          ))}
          {packs.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400">No membership packs found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}