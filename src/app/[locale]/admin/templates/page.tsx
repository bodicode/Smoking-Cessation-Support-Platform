"use client";

import { useTranslations } from 'next-intl';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminTemplates() {
  const t = useTranslations('adminTemplates');

  // Dummy data for demonstration
  const allTemplates = [
    { name: 'Template 1', created: '2025-05-01' },
    { name: 'Template 2', created: '2025-04-15' },
  ];

  const [search, setSearch] = useState('');
  const filteredTemplates = allTemplates.filter(template =>
    template.name.toLowerCase().includes(search.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.ceil(filteredTemplates.length / pageSize);
  const pagedTemplates = filteredTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#03256C] mb-1">{t('templateManagement')}</h1>
          <p className="text-gray-500 text-sm">{t('manageTemplates')}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder={t('templateList') + '...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-1/3"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">No</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('templateList')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('created')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pagedTemplates.map((template, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition-colors"}>
                  <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{template.name}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{template.created}</td>
                  <td className="px-6 py-3 whitespace-nowrap space-x-2">
                    <button className="inline-flex items-center gap-1 border border-blue-500 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                      <Pencil className="w-4 h-4" /> {t('editTemplate')}
                    </button>
                    <button className="inline-flex items-center gap-1 border border-red-500 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition text-sm font-medium">
                      <Trash2 className="w-4 h-4" /> {t('deleteTemplate')}
                    </button>
                  </td>
                </tr>
              ))}
              {pagedTemplates.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">No templates found.</td>
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