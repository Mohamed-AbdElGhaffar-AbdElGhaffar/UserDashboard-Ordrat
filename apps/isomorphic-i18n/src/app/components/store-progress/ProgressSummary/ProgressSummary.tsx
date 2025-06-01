'use client';

import { FaExternalLinkAlt, FaShare } from "react-icons/fa";

interface ProgressSummaryProps {
  lang: string;
  total: number;
  completed: number;
}

export default function ProgressSummary({ lang, completed, total }: ProgressSummaryProps) {
  const text = {
    currency: lang === 'ar' ? "ج.م" : "EGP",
  }
  // const completed = 0;
  // const total = 6;
  const percentage = Math.round((completed / total) * 100);
  const remaining = total - completed;

  return (
    <div className="progress-summary bg-white rounded-xl p-6 shadow">
      <div className="summary-header text-center mb-6">
        <div className="summary-title text-lg font-semibold text-slate-800 mb-2">
          {lang === 'ar' ? 'تقدم الإعداد' : 'Setup Progress'}
        </div>
        <div className="summary-subtitle text-sm text-slate-500">
          {lang === 'ar' ? 'إكمال خطوات تفعيل المتجر' : 'Complete store activation steps'}
        </div>
      </div>

      <div className="progress-visual flex justify-center mb-6">
        <div className="progress-ring relative w-[140px] h-[140px]">
          <svg viewBox="0 0 140 140" className="w-full h-full rotate-[-90deg]">
            <circle cx="70" cy="70" r="60" className="ring-bg" stroke={total == completed?"#16a34a":"#f1f5f9"} strokeWidth="12" fill="none" />
            <circle
              cx="70"
              cy="70"
              r="60"
              className="ring-progress"
              stroke={total == completed?"#16a34a":"#dc3545"}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={377}
              strokeDashoffset={377 - (percentage / 100) * 377}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="ring-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className={`ring-percentage text-3xl font-bold ${total == completed?"text-green-600":"text-rose-600"} leading-none`}>
              {percentage}%
            </div>
            <div className="ring-label text-sm text-slate-500 mt-1">
              {lang === 'ar' ? 'مكتمل' : 'Completed'}
            </div>
          </div>
        </div>
      </div>

      <div className="progress-stats grid grid-cols-2 gap-4 mb-5">
        <div className="stat-item text-center bg-slate-50 rounded-lg py-4">
          <div className="stat-number text-xl font-bold text-slate-800">
            {completed}
          </div>
          <div className="stat-label text-xs text-slate-500 mt-1">
            {lang === 'ar' ? 'مكتملة' : 'Completed'}
          </div>
        </div>
        <div className="stat-item text-center bg-slate-50 rounded-lg py-4">
          <div className="stat-number text-xl font-bold text-slate-800">
            {remaining}
          </div>
          <div className="stat-label text-xs text-slate-500 mt-1">
            {lang === 'ar' ? 'متبقية' : 'Remaining'}
          </div>
        </div>
      </div>
    </div>
  );
}