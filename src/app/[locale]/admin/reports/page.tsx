"use client";

import { useTranslations } from 'next-intl';
import { Eye, Download } from 'lucide-react';
import { useState } from 'react';

export default function AdminReports() {
  const t = useTranslations('adminReports');

  // Dummy data for demonstration
  const allReports = [
    { title: 'Monthly Report May', date: '2025-05-31', status: 'completed' },
    { title: 'Monthly Report April', date: '2025-04-30', status: 'completed' },
    { title: 'Monthly Report April', date: '2025-04-30', status: 'completed' },
    { title: 'Monthly Report April', date: '2025-04-30', status: 'completed' },
    { title: 'Monthly Report April', date: '2025-04-30', status: 'completed' },
    { title: 'Monthly Report April', date: '2025-04-30', status: 'completed' },
  ];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const filteredReports = allReports.filter(report =>
    (report.title.toLowerCase().includes(search.toLowerCase()) || report.date.includes(search)) &&
    (statusFilter ? report.status === statusFilter : true)
  );
  const statusKeys = ['completed', 'pending', 'failed'];
  const statuses = Array.from(new Set(allReports.map(r => r.status)));

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.ceil(filteredReports.length / pageSize);
  const pagedReports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#03256C] mb-1">{t('reportManagement')}</h1>
          <p className="text-gray-500 text-sm">{t('manageReports')}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder={t('reportList') + '...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-1/3"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-1/4"
          >
            <option value="">{t('allStatuses')}</option>
            {statusKeys.map(status => <option key={status} value={status}>{t(status)}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">No</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('reportList')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('date')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('status')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pagedReports.map((report, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition-colors"}>
                  <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{report.title}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{report.date}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{t(report.status)}</td>
                  <td className="px-6 py-3 whitespace-nowrap space-x-2">
                    <button className="inline-flex items-center gap-1 border border-blue-500 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                      {t('viewReports')}
                    </button>
                    <button className="inline-flex items-center gap-1 border border-green-500 text-green-600 px-3 py-1 rounded-lg hover:bg-green-50 transition text-sm font-medium">
                      {t('download')}
                    </button>
                  </td>
                </tr>
              ))}
              {pagedReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">No reports found.</td>
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