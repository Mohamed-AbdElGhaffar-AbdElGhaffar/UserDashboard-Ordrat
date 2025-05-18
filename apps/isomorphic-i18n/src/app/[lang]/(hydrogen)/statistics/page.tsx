import axiosClient from '@/app/components/context/api';
import Statistics from '@/app/components/statistics/Statistics';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import { fetchTotalProducts, GetBestCustomers, GetCancelledOrdersCount, GetCancelledOrdersPercentage, GetTopRatedProducts, GetTopSellingCategories, GetTopSellingProduct, GetTotalCategories, GetTotalCustomers, GetTotalDeliveries, GetTotalOrders, GetTotalProductsVariations, GetTotalProfit } from '@/app/lib/api/GetSellerStatistics';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'الإحصائيات | تابع أداء متجرك بالأرقام'
        : 'Statistics | Track Your Store Performance with Data',
      lang,
      undefined,
      lang === 'ar'
        ? 'استعرض تقارير الأداء والمبيعات وعدد الطلبات والعملاء لفهم نشاط متجرك.'
        : 'View sales reports, order counts, and customer activity to monitor store performance.'
    ),
  };
}

export interface ShopStatistics {
  totalOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  paidRevenue: number;
  unpaidRevenue: number;
  totalRevenue: number;
  activeOrders: number;
  totalCost: number;
  avgSellingPrice: number;
  avgCostPerOrder: number;
  grossProfit: number;
  profitMarginPercent: number;
  visitsCount: number;
  cvrRate: number;
  abandonedCheckouts: number;
  abandonedCheckoutsPct: number;
  timesAddToCart: number;
  timesAddToCartPct: number;
  timesReachCheckout: number;
  timesReachCheckoutPct: number;
  timesSuccessOrder: number;
  timesSuccessOrderPct: number;
  cancelledOrders: number;
  periodType: string;
  totalOrdersGrowthPct: number;
  totalRevenueGrowthPct: number;
  grossProfitGrowthPct: number;
  visitsGrowthPct: number;
  cancelledOrdersGrowthPct: number;
  prevTotalOrders: number;
  prevPaidOrders: number;
  prevUnpaidOrders: number;
  prevPaidRevenue: number;
  prevUnpaidRevenue: number;
  prevTotalRevenue: number;
  prevActiveOrders: number;
  prevGrossProfit: number;
  prevVisitsCount: number;
  prevAbandonedCheckouts: number;
  prevAbandonedCheckoutsPct: number;
  prevTimesAddToCart: number;
  prevTimesAddToCartPct: number;
  prevTimesReachCheckout: number;
  prevTimesReachCheckoutPct: number;
  prevTimesSuccessOrder: number;
  prevTimesSuccessOrderPct: number;
  prevCVRRate: number;
  prevCancelledOrders: number;
  activeOrdersGrowthPct: number;
  paidOrdersGrowthPct: number;
  unpaidOrdersGrowthPct: number;
  paidRevenueGrowthPct: number;
  unpaidRevenueGrowthPct: number;
  avgOrderValueGrowthPct: number;
  periodStart: string;
  periodEnd: string;
  prevPeriodStart: string;
  prevPeriodEnd: string;
  currencyAbbreviationEn: string;
  currencyAbbreviationAr: string;
  totalOrdersChart: ChartData[];
  activeOrdersChart: ChartData[];
  cancelledOrdersChart: ChartData[];
  paidRevenueChart: ChartData[];
  paidOrdersChart: ChartData[];
  unpaidOrdersChart: ChartData[];
  totalRevenueChart: ChartData[];
  activeRevenueChart: ChartData[];
  unpaidRevenueChart: ChartData[];
  statusRevenueChart: StatusChartData[];
  grossProfitChart: StatusChartData[];
  visitsChart: ChartData[];
  deviceSummaries: DeviceSummary[];
  avgOrderValueChart: ChartData[];
  countrySummaries: CountrySummary[];
  abandonedCheckoutsChart: ChartData[];
  addToCartChart: ChartData[];
  reachedCheckoutChart: ChartData[];
  successOrderChart: ChartData[];
  cvrRateChart: ChartData[];
  orderStatusSummaries: OrderStatusSummary[];
  paymentStatusSummaries: PaymentStatusSummary[];
  paymentMethodSummaries: PaymentMethodSummary[];
  branchSummaries: BranchSummary[];
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: LowStockProduct[];
  intervals: Interval[];
}

export interface ChartData {
  intervalNum: number;
  label: string;
  count: number;
}

export interface StatusChartData extends ChartData {
  status: number;
  statusName: string;
}

export interface OrderStatusSummary {
  status: number;
  statusName: string;
  orderCount: number;
  totalRevenue: number;
  percentage: number;
}
export type CountrySummary = {
  country: string;
  visitsCount: number;
  abandonedCheckouts: number;
  completedOrders: number;
  totalAddToCardCount: number;
  conversionRate: number;      // معدل التحويل
  abandomnmentRate: number;    // معدل الهجر
};

export interface PaymentStatusSummary {
  isPaid: boolean;
  paymentStatus: string;
  orderCount: number;
  totalRevenue: number;
  percentage: number;
}
export type DeviceSummary = {
  deviceType: string;        // نوع الجهاز (Desktop أو Mobile)
  visitsCount: number;       // عدد الزيارات
  abandonedCheckouts: number; // عدد الطلبات المهجورة
  completedOrders: number;    // عدد الطلبات المكتملة
  totalAddToCartCount: number; // عدد العناصر المضافة للسلة
  conversionRate: number;     // معدل التحويل
  abandonmentRate: number;    // معدل الهجر
  percentage: number;         // نسبة الجهاز من الاستخدام
};

export interface PaymentMethodSummary {
  paymentMethod: number;
  paymentMethodName: string;
  orderCount: number;
  totalRevenue: number;
  percentage: number;
}

export interface BranchSummary {
  branchId: string;
  branchNameEn: string;
  branchNameAr: string;
  totalOrders: number;
  activeOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  paidRevenue: number;
  unpaidRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMarginPercent: number;
  avgOrderValue: number;
}

export interface TopSellingProduct {
  productId: string;
  productNameEn: string;
  productNameAr: string;
  price: number;
  totalQuantitySold: number;
  activeQuantitySold: number;
  totalRevenue: number;
  productImage: any;
  activeRevenue: number;
  totalProfit: number;
  categoryNameEn: string;
  categoryNameAr: string;
  paidQuantitySold: number;
  unpaidQuantitySold: number;
  paidRevenue: number;
  unpaidRevenue: number;
}

export interface LowStockProduct {
  productId: string;
  productNameEn: string;
  productNameAr: string;
  price: number;
  buyingPrice: number;
  productImage: any;
  categoryNameEn: string;
  categoryNameAr: string;
  branchNameEn: string;
  branchNameAr: string;
  branchId: string;
  currentStock: number;
}

export interface Interval {
  intervalNum: number;
  label: string;
  startDate: string;
  endDate: string;
}



export default async function Page({ params, }: { params: { lang: string }, }) {
  const { lang } = params;

  const pageHeader = {
    title: lang === 'ar' ? 'الإحصائيات' : 'Statistics',
    breadcrumb: [
      { href: `/${lang}/storeSetting/basicData`, name: lang === 'ar' ? 'المتجر' : 'Store' },
      { name: lang === 'ar' ? 'الإحصائيات' : 'Statistics' },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Statistics lang={lang}  />
    </>
  );
}

