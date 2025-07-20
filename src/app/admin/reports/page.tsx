"use client";

import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ALL_PAYMENTS_WITH_TRANSACTIONS, type PaymentWithTransaction, GET_PAYMENT_DETAIL, type PaymentDetail } from '@/graphql/queries/payments';
import { useState } from 'react';
import React from 'react';
import PaymentDetailModal from '@/components/report/PaymentDetailModal';
import PaymentTable from '@/components/report/PaymentTable';

export default function AdminRevenue() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <PaymentDetailModal open={modalOpen} onClose={() => setModalOpen(false)} paymentId={selectedPaymentId} />
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#03256C] mb-1">Quản lý doanh thu</h1>
          <p className="text-gray-500 text-sm">Danh sách giao dịch thành công</p>
        </div>
        <PaymentTable onDetail={(id) => { setSelectedPaymentId(id); setModalOpen(true); }} />
      </div>
    </div>
  );
}