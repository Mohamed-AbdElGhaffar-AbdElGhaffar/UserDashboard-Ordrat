'use client';

import React, { useEffect, useState } from 'react';
import axiosClient from './context/api';

export type Invoice = {
    id: string;
    invoiceNumber: number;
    amount: number;
    createdAt: string;
    lastUpdateAt: string;
    paymentStatus: number;
    plan?: {
        id: string;
        name: string;
        description: string;
        egpAnnualPrice: number;
        egpMonthlyPrice: number;
        usdAnnualPrice: number;
        usdMonthlyPrice: number;
        sarAnnualPrice: number;
        sarMonthlyPrice: number;
        kwdAnnualPrice: number;
        kwdMonthlyPrice: number;
        isActive: boolean;
        numberOfProducts: number;
        numberOfBranches: number;
        planFeatures: any[];
    };
    subscriptionWalletRecharge?: {
        id: string;
        createdAt: string;
        bulk: {
            id: string;
            nameAr: string;
            nameEn: string;
            egyptionAmount: number;
            dollarAmount: number;
            ryialAmount: number;
        };
        sellerId: string;
        subscriptionWalletId: string;
        amount: number;
        status: number;
        bulkId: string;
    };
};


// const invoices: Invoice[] = [
//   { id: 'INV-001', date: '15 مارس 2025', amount: '$2.99', subscriptionType: 'اشتراك شهري', status: 'مدفوع' },
//   { id: 'INV-002', date: '15 فبراير 2025', amount: '$2.99', subscriptionType: 'اشتراك شهري', status: 'مدفوع' },
//   { id: 'INV-003', date: '15 يناير 2025', amount: '$2.99', subscriptionType: 'اشتراك شهري', status: 'مدفوع' },
//   { id: 'INV-004', date: '15 ديسمبر 2024', amount: '$2.99', subscriptionType: 'اشتراك شهري', status: 'مدفوع' },
//   { id: 'INV-005', date: '15 نوفمبر 2024', amount: '$2.99', subscriptionType: 'اشتراك شهري', status: 'مدفوع' },
//   { id: 'INV-005', date: '15 نوفمبر 2024', amount: '$2.99', subscriptionType: 'اشتراك شهري', status: 'مدفوع' },
//   { id: 'INV-005', date: '15 نوفمبر 2024', amount: '$2.99', subscriptionType: 'اشتراك شهري', status: 'مدفوع' },
// ];

type Props = {
    lang: string;
};

function SubscriptionTable({ lang }: Props) {
    const [loading, setLoading] = useState(false);
    const [activePlan, setActivePlan] = useState<Invoice[]>([]);
const sellerId=localStorage.getItem('sellerId')

    const getPaymentStatusText = (status: number, lang: 'ar' | 'en') => {
        if (lang === 'ar') {
            switch (status) {
                case 0:
                    return 'مدفوع';
                case 1:
                    return 'غير مدفوع';
                case 2:
                    return 'فشل';
                default:
                    return 'غير معروف';
            }
        } else {
            switch (status) {
                case 0:
                    return 'Paid';
                case 1:
                    return 'Unpaid';
                case 2:
                    return 'Failed';
                default:
                    return 'Unknown';
            }
        }
    };

    const fetchSubscriptionWallet = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`api/Invoice/GetAllSellerInvoices/byseller/${sellerId}`, {
                headers: {
                    "Accept-Language": lang,
                },
            });
            setActivePlan(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSubscriptionWallet();
    }, []);
    return (
        <div className="bg-white shadow-md rounded-lg pb-3 mt-8">
            <div className="flex justify-between items-center px-6 py-3">
                <h3 className='text-2xl'>{lang === 'ar' ? 'فواتير الاشتراك' : 'Subscription bills'}</h3>
            </div>
            <div className="w-full h-[1px] bg-[#bebebe]"></div>
            <div className="px-6 my-5">
                <div className="overflow-x-auto bg-white">
                    <table className="min-w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA]">
                            <th className="py-3 px-4 text-mainTextColor font-semibold">
    {lang === 'ar' ? '#' : '#'}
</th>
<th className="py-3 px-4 text-mainTextColor font-semibold">
    {lang === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date'}
</th>
<th className="py-3 px-4 text-mainTextColor font-semibold">
    {lang === 'ar' ? 'المبلغ' : 'Amount'}
</th>
<th className="py-3 px-4 text-mainTextColor font-semibold">
    {lang === 'ar' ? 'نوع الفاتورة' : 'Invoice Type'}
</th>
<th className="py-3 px-4 text-mainTextColor font-semibold">
    {lang === 'ar' ? 'الحالة' : 'Status'}
</th>

                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(activePlan) && activePlan.map((invoice, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">{invoice.invoiceNumber}</td>
                                    <td className="py-2 px-4">
                                    {new Date(invoice.createdAt).toLocaleDateString(
                                        lang === 'ar' ? 'ar-EG' : 'en-US',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }
                                    )}

                                    </td>
                                    <td className="py-2 px-4">{invoice.amount} {lang==='ar'?'ج.م':'EGP'}</td>
                                    <td className="py-2 px-4">
    {invoice.plan ? invoice.plan.name : invoice.subscriptionWalletRecharge?.bulk?.nameAr || invoice.subscriptionWalletRecharge?.bulk?.nameEn || 'N/A'}
</td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`inline-block px-2 py-1 text-sm font-medium rounded ${invoice.paymentStatus === 1 || invoice.paymentStatus === 2
                                                    ? "text-red-700 bg-red-100"
                                                    : "text-green-700 bg-green-100"
                                                }`}
                                        >
                                            {getPaymentStatusText(invoice.paymentStatus, lang as any)}
                                        </span>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionTable;
