'use client';

import { GetCookiesServer } from "../../ui/getCookiesServer/GetCookiesServer";
import { FaUsers, FaCheckCircle, FaPercentage, FaWallet, FaMousePointer } from 'react-icons/fa';
import AffiliateStatsCard from "../AffiliateStatsCard/AffiliateStatsCard";
import ReferralLinkCard from "../ReferralLinkCard/ReferralLinkCard";
import { WalletDetails } from "../WalletDetails/WalletDetails";
import { AffiliateLevel } from "../AffiliateLevel/AffiliateLevel";
import AffiliateTable from "@/app/shared/roles-permissions/affiliate-table";
import ReferralsTable from "@/app/shared/roles-permissions/affiliate-referrals-table";
import Image from "next/image";
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

interface AffiliateStats {
  totalReferrals: number;
  successfulSubscriptions: number;
  patchLevel: number;
  commissionPercentage: number;
  walletBalance: number;
  totalClicks: number;
}

interface AffiliateComponentProps {
  lang: string;
  affiliateLink: string;
  currencyAbbreviation: string;
  affiliateStats: AffiliateStats;
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

export default function AffiliateComponent({ lang, affiliateLink, affiliateStats, affiliateWallet, currencyAbbreviation}: AffiliateComponentProps) {
  
  
  const stats = [
    {
      icon: FaUsers,
      value: `${affiliateStats?.totalReferrals}`,
      title: lang === 'ar' ? 'إجمالي الإحالات' : 'Total Referrals',
      subtitle: lang === 'ar'
        ? `${affiliateStats?.successfulSubscriptions} مستخدمًا مشتركًا`
        : `${affiliateStats?.successfulSubscriptions} subscribed users`,
    },
    {
      icon: FaCheckCircle,
      value: `${affiliateStats?.successfulSubscriptions}`,
      title: lang === 'ar' ? 'الاشتراكات الناجحة' : 'Successful Subscriptions',
      subtitle: lang === 'ar'
        ? `نسبة النجاح ${(affiliateStats?.totalReferrals ? Math.round((affiliateStats?.successfulSubscriptions / affiliateStats?.totalReferrals) * 100) : 0)}%`
        : `${affiliateStats?.totalReferrals ? Math.round((affiliateStats?.successfulSubscriptions / affiliateStats?.totalReferrals) * 100) : 0}% success rate`,
    },
    {
      icon: FaMousePointer,
      value: `${affiliateStats?.totalClicks}`,
      title: lang === 'ar' ? 'إجمالي النقرات' : 'Total Clicks',
      subtitle: lang === 'ar'
        ? 'عدد النقرات على رابط الإحالة'
        : 'Number of clicks on referral link',
    },    
    {
      icon: FaWallet,
      value: <>
      <div className="flex gap-1 items-center">

      {affiliateStats?.walletBalance.toFixed(2)}

      {currencyAbbreviation === "ر.س" ? (
        <Image src={sarIcon} alt="SAR" width={15} height={15} />
      ) : (
        <span>{currencyAbbreviation}</span>
      )}
      </div>
      </>,
      title: lang === 'ar' ? 'اجمالى المكتسب' : 'Total Earned',
      // subtitle: lang === 'ar'
      //   ? `0.00${text.currency} معلق`
      //   : `0.00${text.currency} pending`,
      subtitle: '',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <AffiliateStatsCard
            key={index}
            icon={item.icon}
            title={item.title}
            value={item.value as any}
            subtitle={item.subtitle}
          />
        ))}
      </div>

      <ReferralLinkCard referralLink={affiliateLink} lang={lang} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <WalletDetails lang={lang} affiliateWallet={affiliateWallet} currencyAbbreviation={currencyAbbreviation} />
        <AffiliateLevel lang={lang} affiliateStats={affiliateStats} currencyAbbreviation={currencyAbbreviation} />
      </div>
      <AffiliateTable usersData={ []} lang={lang} currencyAbbreviation={currencyAbbreviation} />
      <ReferralsTable usersData={ []} lang={lang} />
    </div>
  );
}