"use client";

import { Pencil, Trash2, Medal } from 'lucide-react';
import { useState } from 'react';

export default function AdminBadges() {
  // Dummy data for demonstration
  const allBadges = [
    { name: '7 Days Smoke-Free', description: 'Awarded for staying smoke-free for 7 days', icon: '🔥' },
    { name: '30 Days Smoke-Free', description: 'Awarded for staying smoke-free for 30 days', icon: '⭐' },
    { name: '500K Saved', description: 'Saved 500,000 VND by not smoking', icon: '💰' },
  ];

  const [search, setSearch] = useState('');
  const [iconFilter, setIconFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const icons = Array.from(new Set(allBadges.map(b => b.icon)));

  const filteredBadges = allBadges.filter(badge =>
    (badge.name.toLowerCase().includes(search.toLowerCase()) || badge.description.toLowerCase().includes(search.toLowerCase())) &&
    (iconFilter ? badge.icon === iconFilter : true)
  );

  const pageCount = Math.ceil(filteredBadges.length / pageSize);
  const pagedBadges = filteredBadges.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#03256C] mb-1">Manage Badges</h1>
          <p className="text-gray-500 text-sm">Create, edit, or remove achievement badges for users.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-1/2"
          />
          <select
            value={iconFilter}
            onChange={e => setIconFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-1/4"
          >
            <option value="">All Icons</option>
            {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Badge</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Icon</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedBadges.map((badge, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition-colors"}>
                  <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold">{badge.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{badge.description}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-2xl">{badge.icon}</td>
                  <td className="px-4 py-3 whitespace-nowrap space-x-2">
                    <button className="inline-flex items-center gap-1 border border-blue-500 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button className="inline-flex items-center gap-1 border border-red-500 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition text-sm font-medium">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {pagedBadges.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">No badges found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-[#60C3A4] text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
              className="px-3 py-1 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 