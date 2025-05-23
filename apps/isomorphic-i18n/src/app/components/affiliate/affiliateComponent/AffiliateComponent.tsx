'use client';

import { GetCookiesServer } from "../../ui/getCookiesServer/GetCookiesServer";
import { FaUsers, FaCheckCircle, FaPercentage, FaWallet, FaMousePointer } from 'react-icons/fa';
import AffiliateStatsCard from "../AffiliateStatsCard/AffiliateStatsCard";
import ReferralLinkCard from "../ReferralLinkCard/ReferralLinkCard";
import { WalletDetails } from "../WalletDetails/WalletDetails";
import { AffiliateLevel } from "../AffiliateLevel/AffiliateLevel";
import AffiliateTable from "@/app/shared/roles-permissions/affiliate-table";
import ReferralsTable from "@/app/shared/roles-permissions/affiliate-referrals-table";

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
  affiliateStats: AffiliateStats;
  affiliateWallet: {
    id: string;
    userId: string;
    balance: number;
    transactions: {
      id: string;
      amount: number;
      transactionDate: string;
      description: string;
      status: string;
    }[];
  };
}

export default function AffiliateComponent({ lang, affiliateLink, affiliateStats, affiliateWallet, }: AffiliateComponentProps) {
  const text = {
    currency: lang === 'ar' ? "ج.م" : "EGP",
  }
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
      value: `${affiliateStats?.walletBalance.toFixed(2)}${text.currency}`,
      title: lang === 'ar' ? 'رصيد المحفظة' : 'Wallet Balance',
      subtitle: lang === 'ar'
        ? `0.00${text.currency} معلق`
        : `0.00${text.currency} pending`,
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
            value={item.value}
            subtitle={item.subtitle}
          />
        ))}
      </div>

      <ReferralLinkCard referralLink={affiliateLink} lang={lang} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <WalletDetails lang={lang} affiliateWallet={affiliateWallet}/>
        <AffiliateLevel lang={lang} affiliateStats={affiliateStats}/>
      </div>
      <AffiliateTable usersData={ []} lang={lang} />
      <ReferralsTable usersData={ []} lang={lang} />
    </div>
  );
}