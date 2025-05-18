  'use client';

  import WidgetCard from '@components/cards/widget-card';
  import TrendingUpIcon from '@components/icons/trending-up';
  import { DatePicker } from '@ui/datepicker';
  import { Title } from 'rizzui';
  import cn from '@utils/class-names';
  import { useCallback, useEffect, useState } from 'react';
  import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
  import axiosClient from '@/app/components/context/api';

  export interface ShopStatsResponse {
    totalVisits: number;
    deviceStats: DeviceStat[];
    checkoutVisitStats: StatWithPercentage;
    completedOrderStats: StatWithPercentage;
    conversionRates: ConversionRates;
    addToCartStats: AddToCartStats;
    cityCounts: LocationStat[];
    countryCounts: LocationStat[];
  }

  export interface DeviceStat {
    deviceType: string;
    count: number;
    percentage: number;
  }

  export interface StatWithPercentage {
    count: number;
    percentage: number;
  }

  export interface ConversionRates {
    visitToCartRate: number;
    visitToCheckoutRate: number;
    visitToOrderRate: number;
    cartToCheckoutRate: number;
    checkoutToOrderRate: number;
  }

  export interface AddToCartStats {
    totalAddToCartCount: number;
    visitsWithAddToCartCount: number;
    percentage: number;
  }

  export interface LocationStat {
    city?: string;
    country?: string;
    count: number;
  }
  export interface props {
    className?:string,
    lang?:string,
    timesAddToCartPct?: number,
    timesReachCheckoutPct?: number,
    timesSuccessOrderPct?: number,
    cvrRate?: number,
  }

  const COLORS = ['#FFBC75','#63C3A5','#10B880',   '#E94554'];

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, midAngle } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius - 100) * cos;
    const sy = cy + (outerRadius - 100) * sin;
    return (
      <Sector
        cx={sx}
        cy={sy}
        cornerRadius={5}
        innerRadius={50}
        outerRadius={120}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={props.fill}
      />
    );
  };

  export default function Spending({ className, lang,timesAddToCartPct,timesReachCheckoutPct,timesSuccessOrderPct,cvrRate }:props) {
    const [activeIndex, setActiveIndex] = useState(2);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [spend, setSpend] = useState<ShopStatsResponse | null>(null);

    const onMouseOver = useCallback((_: any, index: number) => {
      setActiveIndex(index);
    }, []);
    const onMouseLeave = useCallback(() => {
      setActiveIndex(2);
    }, []);
  const failurePct = 100 - (timesAddToCartPct ?? 0);
    const chartData = [
        {
          name: lang === 'ar' ? 'اضافة للسلة' : 'Add to Cart',
          value:timesAddToCartPct,
        },
        {
          name: lang === 'ar' ? 'وصل لمرحلة الدفع' : 'Reached Checkout',
          value: timesReachCheckoutPct,
        },
        {
          name: lang === 'ar' ? 'تم الشراء' : 'Purchased',
          value: timesSuccessOrderPct,
        },
        {
          name: lang === 'ar' ? 'تم الشراء' : 'Purchased',
          value: failurePct,
        },
      ];
    return (
      <WidgetCard
        title={lang === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}
        titleClassName="text-gray-700 font-bold"
        headerClassName="items-center"
        className={cn('@container', className)}
        action={
          <div className="flex flex-col items-start">
            {/* <DatePicker
              selected={startDate}
              onChange={(date: Date) => {
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                lastDay.setHours(23, 59, 59, 999);

                setStartDate(firstDay);
                setEndDate(lastDay);
              }}
              dateFormat="MMM, yyyy"
              placeholderText={lang === 'ar' ? 'اختار الشهر' : "Select Month"}
              showMonthYearPicker
              popperPlacement="bottom-end"
              inputProps={{
                variant: 'text',
                inputClassName: 'p-0 px-1 h-auto [&_input]:text-ellipsis',
              }}
              className="w-40 rounded border [&_.rizzui-input-container]:px-3 [&_.rizzui-input-container]:py-1.5"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
                className="text-xs text-primary mt-2 underline"
              >
                {lang === 'ar' ? 'عرض الكل' : 'Show All'}
              </button>
            )} */}
          </div>
        }
      >
        <div className="mb-8 mt-1 flex items-center gap-2">
          <Title as="h2" className="font-semibold">
            {cvrRate?.toFixed(1)}%
          </Title>
          <span className="flex items-center gap-1 text-green-dark">
            {/* <TrendingUpIcon className="h-auto w-5" /> */}
            {/* <span className="font-medium leading-none">+32.40%</span> */}
          </span>
        </div>
        <div className="flex flex-col gap-6">
          <div className="relative h-[300px] w-full after:absolute after:top-1/2 after:left-1/2 after:h-24 after:w-24 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border after:border-dashed after:border-gray-300 @sm:py-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="[&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-white">
                <Pie
                  activeIndex={activeIndex}
                  data={chartData}
                  cornerRadius={4}
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={6}
                  stroke="rgba(0,0,0,0)"
                  dataKey="value"
                  activeShape={renderActiveShape}
                  onMouseOver={onMouseOver}
                  onMouseLeave={onMouseLeave}
                  isAnimationActive={true} 
  animationDuration={800} 
  animationEasing="ease-in-out"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-4 gap-x-6 @[24rem]:grid-cols-2 @[28rem]:mx-auto">
            <Detail
              color={COLORS[0]}
              value={timesAddToCartPct?.toFixed(1) as any}
              text={lang === 'ar' ? 'اضافة للسلة' : 'Add to Cart'}
            />
            <Detail
              color={COLORS[1]}
              value={timesReachCheckoutPct?.toFixed(1) as any}
              text={lang === 'ar' ? 'وصل لمرحلة الدفع' : 'Reached Checkout'}
            />
            <Detail
              color={COLORS[2]}
              value={timesSuccessOrderPct?.toFixed(1) as any}
              text={lang === 'ar' ? 'تم الشراء' : 'Purchased'}
            />
            <Detail
              color={COLORS[3]}
              value={failurePct?.toFixed(1) as any}
              text={lang === 'ar' ? 'مشاهدة فقط' : 'Watch only'}
            />
          </div>
        </div>
      </WidgetCard>
    );
  }

  function Detail({
    color,
    value,
    text,
  }: {
    color: string;
    value: number;
    text: string;
  }) {
    return (
      <div className="flex justify-between gap-2">
        <div className="col-span-3 flex items-center justify-start gap-1.5">
          <span style={{ background: color }} className="block h-2.5 w-2.5 rounded" />
          <p className="text-gray-500">{text}</p>
        </div>
        <span
          style={{ borderColor: color }}
          className="rounded-full border-2 px-2 py-0.5 font-bold text-gray-700"
        >
          {value}%
        </span>
      </div>
    );
  }
