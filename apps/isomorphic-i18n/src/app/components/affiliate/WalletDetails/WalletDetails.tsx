'use client';

import { FaWallet } from 'react-icons/fa';
interface WalletDetailsProps {
  lang: string;
  affiliateWallet: {
    id: string;
    userId: string;
    balance: number;
    pendingBalance: number;
    withdrawedBalance: number;
    transactions: {
      id: string;
      amount: number;
      transactionDate: string;
      description: string;
      status: string;
    }[];
  };
}
export function WalletDetails({ lang, affiliateWallet }:WalletDetailsProps) {
  const text = {
    title: lang === 'ar' ? 'تفاصيل المحفظة' : 'Wallet Details',
    available: lang === 'ar' ? 'الرصيد المتاح للسحب' : 'Available Balance for Withdrawal',
    total: lang === 'ar' ? 'الإجمالي المكتسب' : 'Total Earned',
    pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
    withdrawn: lang === 'ar' ? 'المسحوب' : 'Withdrawn',
    walletId: 'Your ID',
    currency: lang === 'ar' ? "ج.م" : "EGP",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaWallet className="text-primary" />
          {text.title}
        </h2>
      </div>
      <div className="p-6 pb-0">
        <div className="flex flex-col mb-6">
          <div className="text-3xl font-bold text-primary mb-1">{affiliateWallet?.pendingBalance || '0.00'}{text.currency}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            {text.available}
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit mt-2">
            ID: {affiliateWallet?.userId || text.walletId}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="text-center bg-gray-50 p-4 rounded">
            <div className="text-xl font-semibold">{affiliateWallet?.balance || '0.00'}{text.currency}</div>
            <div className="text-xs text-gray-500 uppercase">{text.total}</div>
          </div>
          <div className="text-center bg-gray-50 p-4 rounded">
            <div className="text-xl font-semibold">{affiliateWallet?.pendingBalance || '0.00'}{text.currency}</div>
            <div className="text-xs text-gray-500 uppercase">{text.pending}</div>
          </div>
          <div className="text-center bg-gray-50 p-4 rounded">
            <div className="text-xl font-semibold">{affiliateWallet?.withdrawedBalance || '0.00'}{text.currency}</div>
            <div className="text-xs text-gray-500 uppercase">{text.withdrawn}</div>
          </div>
        </div>

        <div className="h-0 md:h-64">
          <canvas id="earningsChart" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
