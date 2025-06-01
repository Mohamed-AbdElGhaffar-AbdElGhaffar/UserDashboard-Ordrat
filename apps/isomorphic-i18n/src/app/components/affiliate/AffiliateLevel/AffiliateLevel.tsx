'use client';

import Image from 'next/image';
import { FaAward } from 'react-icons/fa';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

interface AffiliateStats {
  totalReferrals: number;
  successfulSubscriptions: number;
  patchLevel: number;
  commissionPercentage: number;
  walletBalance: number;
  totalClicks: number;
}

interface AffiliateLevelProps {
  lang: string;
  currencyAbbreviation: string;
  affiliateStats: AffiliateStats;
}

export function AffiliateLevel({ lang, affiliateStats,currencyAbbreviation }: AffiliateLevelProps) {
  const isAr = lang === 'ar';
const currency=currencyAbbreviation === "ر.س" ? (
                  <Image src={sarIcon} alt="SAR" width={10} height={10} />
                ) : (
                  <span>{currencyAbbreviation}</span>
                )
  const text = {
    title: isAr ? 'مستوى الشراكة' : 'Affiliate Level',
    heading: isAr ? `تابع مستوى ${affiliateStats?.patchLevel}` : `Level ${affiliateStats?.patchLevel} Affiliate Partner`,
    desc: isAr
      ? `تحصل حاليًا على عمولة ${(affiliateStats?.commissionPercentage * 100).toFixed(0)}٪ على جميع الإحالات`
      : `You currently earn ${(affiliateStats?.commissionPercentage * 100).toFixed(0)}% commission on all referrals`,
    referrals: isAr ? 'إحالات' : 'referrals',
    needed: isAr ? 'مطلوب للوصول إلى المستوى' : 'needed for Level',
    thLevel: isAr ? 'المستوى' : 'Level',
    thReferrals: isAr ? 'الإحالات' : 'Referrals',
    thCommission: isAr ? 'العمولة' : 'Commission',
  };

  // Define levels
  const levels = [
    { level: 1, min: 1, max: 16, commission: '2%' },
    { level: 2, min: 17, max: 32, commission: '4%' },
    { level: 3, min: 33, max: 48, commission: '6%' },
    { level: 4, min: 49, max: 64, commission: '8%' },
    { level: 5, min: 65, max: 200, commission: '10%' },
    { level: 6, min: 201, max: 500, commission: '20%' },
    { level: 8, min: 501, max: Infinity, commission: '25%' },
  ];

  const currentLevel = levels.find((lvl) =>
    affiliateStats?.successfulSubscriptions >= lvl.min && affiliateStats?.successfulSubscriptions <= lvl.max
  ) || levels[0];

  const nextLevel = levels.find((lvl) => lvl.level > currentLevel.level);

  const progressToNext =
    nextLevel && nextLevel.max !== Infinity
      ? Math.min(100, ((affiliateStats?.successfulSubscriptions - currentLevel.min + 1) / (nextLevel.min - currentLevel.min)) * 100)
      : 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FaAward className="text-primary" />
          {text.title}
        </h2>
      </div>
      <div className="p-6 pb-0">
        <div className="flex items-center mb-6 gap-2">
          <div className="relative bg-rose-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
            {currentLevel.level}
            <span className="absolute !bottom-[-20%] left-1/2 transform -translate-x-1/2 translate-y-1 text-[10px] bg-rose-700 px-1 rounded text-white uppercase">
              {text.thLevel}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-1">{text.heading}</h3>
            <p className="text-sm text-gray-500">{text.desc}</p>
          </div>
        </div>

        <div className="h-2 bg-gray-200 rounded-full mb-2">
          <div className="h-2 bg-rose-500 rounded-full" style={{ width: `${progressToNext}%` }}></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-6">
          <span>{affiliateStats?.successfulSubscriptions} {text.referrals}</span>
          {nextLevel && (
            <span>
              {nextLevel.min - affiliateStats?.successfulSubscriptions} {text.needed} {nextLevel.level}
            </span>
          )}
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="py-2 px-4 text-center">{text.thLevel}</th>
              <th className="py-2 px-4 text-center">{text.thReferrals}</th>
              <th className="py-2 px-4 text-center">{text.thCommission}</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((lvl) => (
              <tr
                key={lvl.level}
                className={`text-center ${lvl.level === currentLevel.level ? 'bg-rose-50 font-semibold' : ''}`}
              >
                <td className="py-2 px-4">{lvl.level}</td>
                <td className="py-2 px-4">
                  {lvl.max === Infinity ? `${lvl.min}+` : `${lvl.min}-${lvl.max}`}
                </td>
                <td className="py-2 px-4">{lvl.commission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
