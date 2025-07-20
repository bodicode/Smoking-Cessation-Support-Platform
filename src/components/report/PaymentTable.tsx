import { useQuery } from '@apollo/client';
import { GET_ALL_PAYMENTS_WITH_TRANSACTIONS, type PaymentWithTransaction } from '@/graphql/queries/payments';
import { useState } from 'react';

export default function PaymentTable({ onDetail }: { onDetail: (paymentId: string) => void }) {
  const { data, loading, error, refetch } = useQuery(GET_ALL_PAYMENTS_WITH_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter and map data
  const allPayments: PaymentWithTransaction[] = data?.getAllPaymentsWithTransactions || [];
  const filteredPayments = allPayments.filter(payment =>
    payment.status === 'SUCCESS' &&
    (
      payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.user?.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.price.toString().includes(search)
    )
  );
  const pageCount = Math.ceil(filteredPayments.length / pageSize);
  const pagedPayments = filteredPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Format currency
  const formatVND = (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder={'Tìm kiếm giao dịch...'}
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
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Mã giao dịch</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Người dùng</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Số tiền</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Trạng thái</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-6">Đang tải...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="text-center py-6 text-red-500">Lỗi tải dữ liệu</td></tr>
            ) : pagedPayments.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">Không có giao dịch thành công nào.</td></tr>
            ) : (
              pagedPayments.map((payment, idx) => (
                <tr key={payment.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition-colors"}>
                  <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{payment.id}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{payment.user?.user_name || '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatVND(payment.price)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Thành công</span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <button className="text-blue-600 hover:underline" onClick={() => onDetail(payment.id)}>Chi tiết</button>
                  </td>
                </tr>
              ))
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
  );
} 