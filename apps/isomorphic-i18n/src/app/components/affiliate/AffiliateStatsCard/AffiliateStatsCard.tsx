'use client';

import { GetCookiesServer } from "../../ui/getCookiesServer/GetCookiesServer";

import { IconType } from 'react-icons';

interface AffiliateStatsCardProps {
  icon: IconType;
  title: string;
  value: string;
  subtitle: string;
}

const AffiliateStatsCard = ({ icon: Icon, title, value, subtitle }: AffiliateStatsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
      <div className="text-primary bg-[#ffe4e6] rounded-full p-3">
        <Icon className="text-xl" />
      </div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  );
};

export default AffiliateStatsCard;