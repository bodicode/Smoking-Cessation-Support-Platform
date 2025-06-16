"use client";

import { useState } from 'react';
import { Pencil, Trash2, Save } from 'lucide-react';

const initialPacks = [
  {
    name: '1 Year Pack',
    price: 499000,
    duration: 12,
    description: 'Best value, full benefits for a year.',
  },
  {
    name: '3 Months Pack',
    price: 159000,
    duration: 3,
    description: 'Easy to try premium benefits.',
  },
  {
    name: '1 Month Pack',
    price: 59000,
    duration: 1,
    description: 'Flexible, no commitment.',
  },
];

export default function AdminMembership() {
  const [packs, setPacks] = useState(initialPacks);
  const [editIdx, setEditIdx] = useState(-1);
  const [editPack, setEditPack] = useState({ name: '', price: 0, duration: 1, description: '' });

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setEditPack({ ...packs[idx] });
  };

  const saveEdit = (idx: number) => {
    const newPacks = [...packs];
    newPacks[idx] = { ...editPack };
    setPacks(newPacks);
    setEditIdx(-1);
  };

  const deletePack = (idx: number) => {
    setPacks(packs.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#03256C] mb-1">Manage Membership Packs</h1>
          <p className="text-gray-500 text-sm">Edit, update, or remove membership packs for users.</p>
        </div>
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
                    {editIdx === idx ? (
                      <input className="border rounded px-2 py-1 w-32" value={editPack.name} onChange={e => setEditPack({ ...editPack, name: e.target.value })} />
                    ) : (
                      pack.name
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editIdx === idx ? (
                      <input className="border rounded px-2 py-1 w-24" type="number" value={editPack.price} onChange={e => setEditPack({ ...editPack, price: +e.target.value })} />
                    ) : (
                      pack.price.toLocaleString()
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editIdx === idx ? (
                      <input className="border rounded px-2 py-1 w-16" type="number" value={editPack.duration} onChange={e => setEditPack({ ...editPack, duration: +e.target.value })} />
                    ) : (
                      pack.duration
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editIdx === idx ? (
                      <input className="border rounded px-2 py-1 w-64" value={editPack.description} onChange={e => setEditPack({ ...editPack, description: e.target.value })} />
                    ) : (
                      pack.description
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap space-x-2">
                    {editIdx === idx ? (
                      <button className="inline-flex items-center gap-1 border border-green-500 text-green-600 px-3 py-1 rounded-lg hover:bg-green-50 transition text-sm font-medium" onClick={() => saveEdit(idx)}>
                        <Save className="w-4 h-4" /> Save
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-1 border border-blue-500 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-sm font-medium" onClick={() => startEdit(idx)}>
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                    )}
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