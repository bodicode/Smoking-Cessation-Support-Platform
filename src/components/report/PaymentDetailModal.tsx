import { useLazyQuery } from '@apollo/client';
import { GET_PAYMENT_DETAIL, type PaymentDetail } from '@/graphql/queries/payments';
import React from 'react';

export default function PaymentDetailModal({ open, onClose, paymentId }: { open: boolean; onClose: () => void; paymentId: string | null }) {
  const [fetchDetail, { data, loading, error }] = useLazyQuery(GET_PAYMENT_DETAIL);
  React.useEffect(() => {
    if (open && paymentId) {
      fetchDetail({ variables: { getPaymentDetailId: paymentId } });
    }
  }, [open, paymentId, fetchDetail]);

  if (!open) return null;

  const detail: PaymentDetail | undefined = data?.getPaymentDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#03256C]">Chi tiết giao dịch</h2>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#60C3A4]"></div>
                <span className="text-gray-600">Đang tải chi tiết...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">Lỗi tải chi tiết giao dịch</p>
              </div>
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-[#03256C] mb-4">Thông tin giao dịch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mã giao dịch</label>
                      <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-lg border">{detail.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                          {detail.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phương thức thanh toán</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">{detail.payment_method}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                        {new Date(detail.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Số tiền</label>
                      <p className="text-2xl font-bold text-[#60C3A4] bg-white px-3 py-2 rounded-lg border">
                        {detail.price.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày cập nhật</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                        {new Date(detail.updated_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    {detail.content && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nội dung</label>
                        <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {detail.content}
                        </p>
                      </div>
                    )}
                    {detail.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                        <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {detail.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Info */}
              {detail.subscription?.package && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-[#03256C] mb-4">Thông tin gói dịch vụ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Mã subscription</label>
                        <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-lg border">
                          {detail.subscription.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tên gói</label>
                        <p className="text-gray-900 font-medium bg-white px-3 py-2 rounded-lg border">
                          {detail.subscription.package.name}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Giá gói</label>
                        <p className="text-lg font-bold text-blue-600 bg-white px-3 py-2 rounded-lg border">
                          {detail.subscription.package.price.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Thời hạn</label>
                        <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {detail.subscription.package.duration_days} ngày
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-sm font-medium text-gray-500">Mô tả gói</label>
                    <div className="bg-white rounded-lg border p-3 mt-1">
                      <ul className="space-y-1">
                        {Array.isArray(detail.subscription.package.description) && detail.subscription.package.description.map((desc, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-[#60C3A4] mr-2 mt-1.5">•</span>
                            <span className="text-gray-700">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transaction Info */}
              {detail.payment_transaction && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-[#03256C] mb-4">Thông tin giao dịch ngân hàng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Mã giao dịch NH</label>
                        <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.id}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ngân hàng</label>
                        <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.gateway}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Số tài khoản</label>
                        <p className="text-gray-900 font-mono bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.accountNumber}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tài khoản phụ</label>
                        <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.subAccount || '-'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Mã tham chiếu</label>
                        <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.referenceNumber || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Sepay ID</label>
                        <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.sepay_id || '-'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Số tiền vào</label>
                        <p className="text-xl font-bold text-green-600 bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.amountIn?.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Số tiền ra</label>
                        <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.amountOut?.toLocaleString('vi-VN') || '0'} đ
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tích lũy</label>
                        <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.accumulated?.toLocaleString('vi-VN') || '0'} đ
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ngày giao dịch</label>
                        <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border">
                          {detail.payment_transaction.transactionDate 
                            ? new Date(detail.payment_transaction.transactionDate).toLocaleDateString('vi-VN') 
                            : 'Chưa có thông tin'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mã code</label>
                      <p className="text-gray-900 font-mono text-sm bg-white px-3 py-2 rounded-lg border">
                        {detail.payment_transaction.code || '-'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Body</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border break-all whitespace-pre-wrap">
                        {detail.payment_transaction.body || '-'}
                      </p>
                    </div>
                  </div>
                  {detail.payment_transaction.transactionContent && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">Nội dung giao dịch</label>
                      <p className="text-gray-900 bg-white px-3 py-2 rounded-lg border mt-1">
                        {detail.payment_transaction.transactionContent}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Không có dữ liệu chi tiết.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}