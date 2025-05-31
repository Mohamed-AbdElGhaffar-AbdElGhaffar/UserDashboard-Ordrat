'use client';

import { FaExternalLinkAlt, FaShare } from "react-icons/fa";

interface StoreHeaderProps {
  lang: string;
}

export default function StoreHeader({ lang }: StoreHeaderProps) {
  const text = {
    currency: lang === 'ar' ? "ج.م" : "EGP",
  }
  
  return (
    <div className="dashboard-header flex flex-col lg:flex-row justify-between items-center bg-white px-6 py-5 mb-6 rounded-xl shadow">
      <div className="header-info text-center lg:text-start">
        <h1 className="text-xl font-semibold text-slate-800 mb-1">
          {lang === 'ar' ? 'لوحة تحكم المتجر' : 'Store Dashboard'}
        </h1>
        <p className="text-sm text-slate-500">
          {lang === 'ar' ? 'مرحباً بك، تابع تقدم إعداد متجرك' : 'Welcome, track your store setup progress'}
        </p>
      </div>

      <div className="header-actions flex gap-3 mt-4 lg:mt-0">
        <a
          href="#"
          id="viewStoreBtn"
          className="quick-btn flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 hover:-translate-y-0.5 transition-transform"
        >
          <FaExternalLinkAlt />
          {lang === 'ar' ? 'عرض المتجر' : 'View Store'}
        </a>
        <a
          href="#"
          id="shareStoreBtn"
          className="quick-btn secondary flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 hover:-translate-y-0.5 transition-transform"
        >
          <FaShare />
          {lang === 'ar' ? 'مشاركة' : 'Share'}
        </a>
      </div>
    </div>
  );
}