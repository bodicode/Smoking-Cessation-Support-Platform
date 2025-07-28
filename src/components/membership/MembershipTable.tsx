import { Pencil, Trash2 } from 'lucide-react';

type Pack = {
  id?: string;
  name: string;
  price: number;
  duration: number;
  description: string[];
};

interface MembershipTableProps {
  packs: Pack[];
  startEdit: (idx: number) => void;
  deletePack: (idx: number) => void;
}

export default function MembershipTable({ packs, startEdit, deletePack }: MembershipTableProps) {
  return (
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
              <td colSpan={6} className="text-center py-6 text-gray-400">No membership packs found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
