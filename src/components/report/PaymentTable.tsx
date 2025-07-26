import { useQuery } from '@apollo/client';
import { GET_ALL_PAYMENTS_WITH_TRANSACTIONS, type PaymentWithTransaction } from '@/graphql/queries/payments';
import { useState } from 'react';

export default function PaymentTable({ onDetail }: { onDetail: (paymentId: string) => void }) {
  const { data, loading, error, refetch } = useQuery(GET_ALL_PAYMENTS_WITH_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter and map data
  const allPayments: PaymentWithTransaction[] = data?.getAllPaymentsWithTransactions || [];
  const filteredPayments = allPayments.filter(payment => {
    // Status filtering
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    
    const matchesSearch = payment.id.toLowerCase().includes(search.toLowerCase()) ||
      payment.user?.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.price.toString().includes(search);
    
    // Date filtering - using payment_transaction.transactionDate for SUCCESS, content for PENDING
    let matchesDateRange = true;
    if (startDate || endDate) {
      let paymentDate = null;
      
      if (payment.payment_transaction?.transactionDate) {
        paymentDate = new Date(payment.payment_transaction.transactionDate);
      }
      // For pending payments, we can't filter by date since there's no transaction date
      // Skip date filtering for pending payments
      else if (payment.status === 'PENDING') {
        matchesDateRange = true;
      }
      
      if (paymentDate && (startDate || endDate)) {
        paymentDate.setHours(0, 0, 0, 0);
        
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          matchesDateRange = matchesDateRange && paymentDate >= start;
        }
        
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && paymentDate <= end;
        }
      } else if ((startDate || endDate) && payment.status !== 'PENDING') {
        matchesDateRange = false;
      }
    }
    
    return matchesStatus && matchesSearch && matchesDateRange;
  }).sort((a, b) => {
    // Sort SUCCESS payments first by transaction date (newest first)
    // Then PENDING payments at the end
    if (a.status === 'SUCCESS' && b.status === 'PENDING') {
      return -1; // SUCCESS comes first
    }
    if (a.status === 'PENDING' && b.status === 'SUCCESS') {
      return 1; // PENDING comes last
    }
    
    // Both are SUCCESS - sort by transaction date (newest first)
    if (a.status === 'SUCCESS' && b.status === 'SUCCESS') {
      const dateA = a.payment_transaction?.transactionDate ? new Date(a.payment_transaction.transactionDate).getTime() : 0;
      const dateB = b.payment_transaction?.transactionDate ? new Date(b.payment_transaction.transactionDate).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    }
    
    // Both are PENDING - maintain original order or sort by ID
    return 0;
  });
  
  const pageCount = Math.ceil(filteredPayments.length / pageSize);
  const pagedPayments = filteredPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Format currency
  const formatVND = (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex flex-col w-full lg:w-1/4">
          <label className="text-xs font-medium text-gray-600 mb-1.5">Tìm kiếm</label>
          <input
            type="text"
            placeholder={'Tìm kiếm giao dịch...'}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition-all hover:border-gray-400 h-[38px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-4">
          <div className="flex flex-col min-w-[140px]">
            <label className="text-xs font-medium text-gray-600 mb-1.5">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                handleFilterChange();
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition-all hover:border-gray-400 h-[38px]"
            >
              <option value="ALL">Tất cả</option>
              <option value="SUCCESS">Thành công</option>
              <option value="PENDING">Chờ xử lý</option>
            </select>
          </div>
          <div className="flex flex-col min-w-[140px]">
            <label className="text-xs font-medium text-gray-600 mb-1.5">Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                handleFilterChange();
              }}
              onFocus={e => e.target.showPicker && e.target.showPicker()} // Ensure datepicker opens on focus/click
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition-all hover:border-gray-400 h-[38px]"
            />
          </div>
          <div className="flex flex-col min-w-[140px]">
            <label className="text-xs font-medium text-gray-600 mb-1.5">Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                handleFilterChange();
              }}
              onFocus={e => e.target.showPicker && e.target.showPicker()} // Ensure datepicker opens on focus/click
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition-all hover:border-gray-400 h-[38px]"
            />
          </div>
          <div className="flex flex-col justify-end">
            <button
              onClick={() => {
                setSearch('');
                setStartDate('');
                setEndDate('');
                setStatusFilter('ALL');
                setCurrentPage(1);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors h-[38px] flex items-center justify-center"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-700 whitespace-nowrap w-16">No</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap w-32">Mã giao dịch</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Người dùng</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Số tiền</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Ngày giao dịch</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Trạng thái</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-6">Đang tải...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center py-6 text-red-500">Lỗi tải dữ liệu</td></tr>
            ) : pagedPayments.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-6 text-gray-400">Không có giao dịch nào.</td></tr>
            ) : (
              pagedPayments.map((payment, idx) => (
                <tr key={payment.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition-colors"}>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap w-32">
                    <div 
                      className="font-mono text-xs truncate max-w-[120px] cursor-help"
                      title={payment.id}
                    >
                      {payment.id}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{payment.user?.user_name || '-'}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-semibold">{formatVND(payment.price)}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm">
                    {payment.payment_transaction?.transactionDate 
                      ? new Date(payment.payment_transaction.transactionDate).toLocaleDateString('vi-VN')
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      payment.status === 'SUCCESS' 
                        ? 'bg-green-100 text-green-700' 
                        : payment.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {payment.status === 'SUCCESS' ? 'Thành công' : payment.status === 'PENDING' ? 'Chờ xử lý' : payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium" onClick={() => onDetail(payment.id)}>Chi tiết</button>
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