import React from "react";

interface PaymentQRCodeProps {
  amount: number;
  description: string;
  acc?: string;
  bank?: string;
  className?: string;
}

const PaymentQRCode: React.FC<PaymentQRCodeProps> = ({ amount, description, acc = "27202407", bank = "ACB", className }) => {
  const qrUrl = `https://qr.sepay.vn/img?acc=${acc}&bank=${bank}&amount=${amount}&des=${description}`;
  return (
    <img
      src={qrUrl}
      alt="QR Sepay"
      className={`w-64 h-64 border-4 border-green-200 rounded-xl ${className || ""}`}
    />
  );
};

export default PaymentQRCode; 