'use client';

import { ActionIcon, Title, Text } from 'rizzui';
import cn from '@utils/class-names';
import WidgetCard from '@components/cards/widget-card';
import { PiSlidersHorizontalDuotone } from 'react-icons/pi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  PiBankDuotone,
  PiFileTextDuotone,
  PiGiftDuotone,
  PiPulseDuotone,
} from 'react-icons/pi';

import { CustomTooltip } from '@components/charts/custom-tooltip';
import { chartData, widgetData } from '@/data/card-widgets-data';
import { useTranslation } from '@/app/i18n/client';
import { ChartData } from '../../statistics/page';

export default function AreaChartList({ className,
  unpaidOrders,
  lang ,
  paidOrders,
  avgSellingPrice,
  paidRevenue,
  paidRevenueChart,
  cancelledOrders,
  currency}: { className?: string;paidOrders?: number;avgSellingPrice?:number;paidRevenue?: number;cancelledOrders?:number;currency?:string; unpaidOrders?: number; lang?: string;paidRevenueChart?:ChartData[] }) {
  const { t } = useTranslation(lang!, 'common');

  const widgetCardStat = [
    {
      title: lang === 'ar' ? 'طلبات مكتملة' : ' Completed Orders',
      metric: `${paidOrders} `,
      bgColor: 'bg-[#10b981]',
      textColor: 'text-[#10b981]',
      icon: <PiBankDuotone className="h-6 w-6" />,
    },
    {
      title: lang === 'ar' ? 'طلبات معلقة' : ' Pending Orders',
      metric: `${unpaidOrders} `,
      bgColor: 'bg-[#D89B0D]',
      textColor: 'text-[#D89B0D]',
      icon: <PiGiftDuotone className="h-6 w-6" />,
    },
    {
      title: lang === 'ar' ? 'طلبات ملغية' : 'Cancelled Orders',
      metric: `${cancelledOrders} `,
      bgColor: 'bg-[#C5280C]',
      textColor: 'text-[#C5280C]',
      icon: <PiFileTextDuotone className="h-6 w-6" />,
    },
    {
      title: lang === 'ar' ? 'تكلفة الطلب' : 'Order Cost',
      metric: `${avgSellingPrice} ${currency} `,
      bgColor: 'bg-[#D89B0D]',
      textColor: 'text-[#D89B0D]',
      icon: <PiPulseDuotone className="h-6 w-6" />,
    },
  ];

  const widgetData = [
    {
      name: 'text-profit',
      color: '#10b981',
      statTitle: 'Profit',
      statMetric: '$2780.00',
      stat: widgetCardStat,
    },

  ];

  // const chartData = [
  //   {
  //     day: 'Mon',
  //     bounceRate: 40,
  //     pageSession: 40,
  //   },
  //   {
  //     day: 'Tue',
  //     bounceRate: 90,
  //     pageSession: 30,
  //   },
  //   {
  //     day: 'Thu',
  //     bounceRate: 64,
  //     pageSession: 43,
  //   },
  //   {
  //     day: 'Wed',
  //     bounceRate: 99,
  //     pageSession: 50,
  //   },
  //   {
  //     day: 'Fri',
  //     bounceRate: 50,
  //     pageSession: 70,
  //   },
  //   {
  //     day: 'sat',
  //     bounceRate: 55,
  //     pageSession: 80,
  //   },
  //   {
  //     day: 'Sun',
  //     bounceRate: 70,
  //     pageSession: 80,
  //   },
  // ];
  const chartData = paidRevenueChart?.map(item => ({
    day: item.label,
    bounceRate: item.count,
  }))
  return (
    <>
      {widgetData.map((item) => (
        <WidgetCard
          key={item.name}
          title={lang === 'ar' ? 'صافى الربح' : 'Net profit'}
          description={`${paidRevenue?.toLocaleString()} ${currency}`}
          headerClassName='text-xl font-medium'
          rounded="lg"
          action={
            ''
            // <ActionIcon variant="outline" rounded="full">
            //   <PiSlidersHorizontalDuotone className="h-auto w-5" />
            // </ActionIcon>
          }
          descriptionClassName="text-gray-500 mt-1.5"
          className={cn(className)}
        >
          <div className="mt-5  grid w-full grid-cols-1 justify-around gap-6 @sm:py-2 @7xl:gap-8">
            <div className="h-72 w-full @sm:pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    left: -30,
                  }}
                >
                  <YAxis tickLine={false} axisLine={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="natural"
                    dataKey="bounceRate"
                    stroke={item.color}
                    fill={item.color}
                    strokeWidth={2}
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {item.stat.map((stat) => (
                <div key={stat.title} className="flex items-center">
                  <div
                    className={cn(
                      'me-3.5 flex h-10 w-10 items-center justify-center rounded-md bg-opacity-10 p-[9px]',
                      stat.bgColor,
                      stat.textColor
                    )}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <Text className="mb-1 text-gray-600">{t(stat.title)}</Text>
                    <Title as="h6" className="font-semibold">
                      {stat.metric}
                    </Title>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </WidgetCard>
      ))}
    </>
  );
}
