'use client';

import { Text } from 'rizzui';
import cn from '@utils/class-names';
import MetricCard from '@components/cards/metric-card';
import TrendingUpIcon from '@components/icons/trending-up';
import TrendingDownIcon from '@components/icons/trending-down';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import SimpleBar from '@ui/simplebar';
import { getChartColorByEngagementRate } from '@/app/shared/analytics-dashboard/website-metrics/columns';
import { ChartData } from '@/app/[lang]/(hydrogen)/statistics/page';
import { useUserContext } from '@/app/components/context/UserContext';

interface StatsCardsProps {
  className?: string;
  currency?: string;
  lang?: string;
  visitsCount?: number;
  visitsGrowthPct?: number;
  visitsChart?: ChartData[];
  totalOrders?: number;
  totalOrdersGrowthPct?: number;
  totalOrdersChart?: ChartData[];
  totalRevenue?: number;
  totalRevenueGrowthPct?: number;
  grossProfit?: number;
  abandonedCheckouts?: number;
  abandonedCheckoutsPct?: number;
  grossProfitGrowthPct?: number;
  timesAddToCart?: number;
  timesAddToCartPct?: number;
  timesReachCheckout?: number;
  timesReachCheckoutPct?: number;
  timesSuccessOrder?: number;
  timesSuccessOrderPct?: number;
  cvrRate?: number;
  activeOrders?: number;
  activeOrdersGrowthPct?: number;
  paidOrders?: number;
  unpaidOrders?: number;
  unpaidOrdersGrowthPct?: number;
  paidOrdersGrowthPct?: number;
  cancelledOrders?: number;
  cancelledOrdersGrowthPct?: number;
  paidRevenueGrowthPct?: number;
  paidRevenue?: number;
  unpaidRevenue?: number;
  avgSellingPrice?: number;
  unpaidRevenueGrowthPct?: number;
  avgOrderValueGrowthPct?: number;
  totalRevenueChart?: ChartData[];
  avgOrderValueChart?: ChartData[];
  grossProfitChart?: ChartData[];
  successOrderChart?: ChartData[];
  activeOrdersChart?: ChartData[];
  addToCartChart?: ChartData[];
  reachedCheckoutChart?: ChartData[];
  abandonedCheckoutsChart?: ChartData[];
  cvrRateChart?: ChartData[];
  paidOrdersChart?: ChartData[];
  unpaidOrdersChart?: ChartData[];
  cancelledOrdersChart?: ChartData[];
  paidRevenueChart?: ChartData[];
  unpaidRevenueChart?: ChartData[];
   periodStart?: string;
  periodEnd?: string;
  prevPeriodStart?: string;
  prevPeriodEnd?: string;
  periodLabel?: string;
  viewType?: any;
}

export default function StatsCards({ className,periodLabel ,viewType ,periodStart,periodEnd,prevPeriodEnd,prevPeriodStart, avgSellingPrice, avgOrderValueChart, avgOrderValueGrowthPct, unpaidRevenueChart, unpaidRevenue, unpaidRevenueGrowthPct, activeOrders, paidRevenueChart, paidRevenue, cancelledOrders, paidRevenueGrowthPct, cancelledOrdersChart, cancelledOrdersGrowthPct, unpaidOrdersChart, unpaidOrdersGrowthPct, unpaidOrders, paidOrdersChart, activeOrdersGrowthPct, paidOrders, paidOrdersGrowthPct, activeOrdersChart, cvrRate, cvrRateChart, timesReachCheckout, timesReachCheckoutPct, timesSuccessOrder, successOrderChart, timesSuccessOrderPct, reachedCheckoutChart, abandonedCheckouts, addToCartChart, timesAddToCart, timesAddToCartPct, abandonedCheckoutsChart, abandonedCheckoutsPct, grossProfitChart, grossProfit, grossProfitGrowthPct, currency, visitsCount, totalRevenue, totalRevenueGrowthPct, totalRevenueChart, visitsGrowthPct, visitsChart, totalOrders, totalOrdersChart, totalOrdersGrowthPct, lang }: StatsCardsProps) {
  const filesStatData = [
    {
      id: 1,
      title: lang === 'ar' ? 'الزيارات' : ' Visitors',
      metric: visitsCount,
      fill: '#3872FA',
      percentage: 32,
      increased: Number(visitsGrowthPct) > 0,
      decreased: Number(visitsGrowthPct) < 0,
      value: visitsGrowthPct,
      engagementRate: totalOrdersGrowthPct,
      chart: visitsChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 2,
      title: lang === 'ar' ? ' عدد الطلبات'  : 'Orders Number',
      metric: totalOrders,
      fill: '#3872FA',
      percentage: 48,
      increased: Number(totalOrdersGrowthPct) > 0,
      decreased: Number(totalOrdersGrowthPct) < 0,
      value: totalOrdersGrowthPct,
      engagementRate: totalOrdersGrowthPct,
      chart: totalOrdersChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 3,
      title: lang === 'ar' ? 'اجمالى المبيعات' : 'Total sales',
      metric: `${totalRevenue} ${currency}`,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(totalRevenueGrowthPct) > 0,
      decreased: Number(totalRevenueGrowthPct) < 0,
      value: totalRevenueGrowthPct,
      engagementRate: totalRevenueGrowthPct,
      chart: totalRevenueChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 4,
      title: lang === 'ar' ? 'صافي الربح' : 'Gross Profit',
      metric: `${grossProfit} ${currency}`,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(grossProfitGrowthPct) > 0,
      decreased: Number(grossProfitGrowthPct) < 0,
      value: grossProfitGrowthPct,
      engagementRate: grossProfitGrowthPct,
      chart: grossProfitChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 5,
      title: lang === 'ar' ? 'الإيرادات المدفوعة' : 'Paid Revenue',
      metric: `${paidRevenue} ${currency}`,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(paidRevenueGrowthPct) > 0,
      decreased: Number(paidRevenueGrowthPct) < 0,
      value: paidRevenueGrowthPct,
      engagementRate: paidRevenueGrowthPct,
      chart: paidRevenueChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 6,
      title: lang === 'ar' ? 'الإيرادات غير المدفوعة' : 'Unpaid Revenue',
      metric: `${unpaidRevenue} ${currency}`,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(unpaidRevenueGrowthPct) > 0,
      decreased: Number(unpaidRevenueGrowthPct) < 0,
      value: unpaidRevenueGrowthPct,
      engagementRate: unpaidRevenueGrowthPct,
      chart: unpaidRevenueChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 7,
      title: lang === 'ar' ? 'متوسط قيمة الطلب' : 'Average Order Value',
      metric: `${avgSellingPrice} ${currency}`,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(avgOrderValueGrowthPct) > 0,
      decreased: Number(avgOrderValueGrowthPct) < 0,
      value: avgOrderValueGrowthPct,
      engagementRate: avgOrderValueGrowthPct,
      chart: avgOrderValueChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 8,
      title: lang === 'ar' ? 'الطلبات النشطة' : 'Active Orders ',
      metric: `${activeOrders} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(activeOrdersGrowthPct) > 0,
      decreased: Number(activeOrdersGrowthPct) < 0,
      value: activeOrdersGrowthPct,
      engagementRate: activeOrdersGrowthPct,
      chart: activeOrdersChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 9,
      title: lang === 'ar' ? 'الطلبات المدفوعة' : 'Paid Orders',
      metric: `${paidOrders} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(paidOrdersGrowthPct) > 0,
      decreased: Number(paidOrdersGrowthPct) < 0,
      value: paidOrdersGrowthPct,
      engagementRate: paidOrdersGrowthPct,
      chart: paidOrdersChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 10,
      title: lang === 'ar' ? 'الطلبات غير المدفوعة' : 'Unpaid Orders',
      metric: `${unpaidOrders} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(unpaidOrdersGrowthPct) > 0,
      decreased: Number(unpaidOrdersGrowthPct) < 0,
      value: unpaidOrdersGrowthPct,
      engagementRate: unpaidOrdersGrowthPct,
      chart: unpaidOrdersChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 11,
      title: lang === 'ar' ? 'الطلبات الملغية' : 'Cancelled Orders',
      metric: `${cancelledOrders} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(cancelledOrdersGrowthPct) > 0,
      decreased: Number(cancelledOrdersGrowthPct) < 0,
      value: cancelledOrdersGrowthPct,
      engagementRate: cancelledOrdersGrowthPct,
      chart: cancelledOrdersChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
      {
      id: 12,
      title: lang === 'ar' ? 'معدل التحويل' : 'Conversion Rate',
      metric: `${cvrRate} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(cvrRate) > 0,
      decreased: Number(cvrRate) < 0,
      value: cvrRate,
      engagementRate: cvrRate,
      chart: cvrRateChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    }, 
    
    {
      id: 13,
      title: lang === 'ar' ? 'الوصول لاتمام الطلب' : 'Reach Complete Order',
      metric: `${timesSuccessOrder} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(timesSuccessOrderPct) > 0,
      decreased: Number(timesSuccessOrderPct) < 0,
      value: timesSuccessOrderPct,
      engagementRate: timesSuccessOrderPct,
      chart: successOrderChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },    
    {
      id: 14,
      title: lang === 'ar' ? 'الإضافات إلى السلة' : 'Add to Cart',
      metric: `${timesAddToCart} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(timesAddToCartPct) > 0,
      decreased: Number(timesAddToCartPct) < 0,
      value: timesAddToCartPct,
      engagementRate: timesAddToCartPct,
      chart: addToCartChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 15,
      title: lang === 'ar' ? 'الوصول لصفحة الدفع' : 'Reach Checkout',
      metric: `${timesReachCheckout} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(timesReachCheckoutPct) > 0,
      decreased: Number(timesReachCheckoutPct) < 0,
      value: timesReachCheckoutPct,
      engagementRate: timesReachCheckoutPct,
      chart: reachedCheckoutChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },
    {
      id: 16,
      title: lang === 'ar' ? ' الطلبات المهجورة' : 'Abandoned Checkouts',
      metric: `${abandonedCheckouts} `,
      fill: '#3872FA',
      percentage: 54,
      increased: Number(abandonedCheckoutsPct) > 0,
      decreased: Number(abandonedCheckoutsPct) < 0,
      value: abandonedCheckoutsPct,
      engagementRate: abandonedCheckoutsPct,
      chart: abandonedCheckoutsChart?.map(item => ({
        label: item.label,
        count: item.count,
      })),
    },

  ];
  return (
    <SimpleBar>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 4xl:grid-cols-8 gap-5 ">
        {filesStatData?.map((stat: any) => {
          return (
            <MetricCard
              key={`${stat.id}-${stat.metric}-${viewType}`} 
              title={stat.title}
              metric={stat.metric}
              titleClassName='font-bold mb-2'
              metricClassName="3xl:text-[20px] "
              className={cn('w-full pb-10 h-36 max-w-full relative justify-between', className)}
              chartClassName="sm:w-20 w-44"
              chart={
                <div className="ms-3 h-12 w-full 4xl:h-9">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stat.chart}

                      margin={{
                        left: -30,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id={`deviceSessionsMobile-${stat.id}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#F0F1FF"
                            className="[stop-opacity:0.25] dark:[stop-opacity:0.2]"
                          />
                          <stop
                            offset="95%"
                            stopColor={getChartColorByEngagementRate(
                              stat.engagementRate
                            )}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="bump"
                        dataKey="count"
                        stroke={getChartColorByEngagementRate(
                          stat.engagementRate
                        )}
                        isAnimationActive={true}
                        strokeWidth={1.8}
                        fillOpacity={1}
                        fill={`url(#deviceSessionsMobile-${stat.id})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              }
            >
             
          <Text className="mt-52 bottom-3 absolute flex items-center leading-none text-gray-500">
  <Text
    as="span"
    className={cn(
      'me-2 inline-flex items-center font-medium',
      String(stat.value).includes('-') ? 'text-red' : 'text-green'
    )}
  >
    {String(stat.value).includes('-')
      ? (<TrendingDownIcon className="me-1 h-4 w-4" />)
      : (<TrendingUpIcon className="me-1 h-4 w-4" />)}
    {stat.value}%
  </Text>
  {periodLabel}
</Text>


            </MetricCard>
          );
        })}
      </div>
    </SimpleBar>
  );
}