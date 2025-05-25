'use client';

import { useState } from 'react';
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Text, Title } from 'rizzui';
import { TrendingUpIcon } from 'lucide-react';
import cn from '@utils/class-names';
import WidgetCard from '@components/cards/widget-card';
import { CustomYAxisTick } from '@components/charts/custom-yaxis-tick';
import { CustomTooltip } from '@components/charts/custom-tooltip';
import { BranchSummary } from '../[lang]/(hydrogen)/statistics/page';
import { formatNumber } from '@utils/format-number';
import { addSpacesToCamelCase } from '@utils/add-spaces-to-camel-case';
import Image from 'next/image';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

export default function TotalProfitLoss({ className, lang, branchSummaries, currency }: { currency: string; className?: string; lang: string, branchSummaries: BranchSummary[] }) {

  const formattedData = branchSummaries.map(item => ({
    branchName: lang === 'ar' ? item.branchNameAr : item.branchNameEn,
    paidOrders: item.paidOrders,
    unpaidOrders: item.unpaidOrders,
    cancelledOrders: item.cancelledOrders,
    totalRevenue: item.totalRevenue,
    paidRevenue: item.paidRevenue,
    unpaidRevenue: item.unpaidRevenue,
    totalCost: item.totalCost,
    grossProfit: item.grossProfit,
    profitMarginPercent: item.profitMarginPercent,
    avgOrderValue: item.avgOrderValue,
  }));

  const getBars = (lang: string) => [
    {
      name: lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      value: 'totalRevenue',
      color: '#63C3A5'
    },
    {
      name: lang === 'ar' ? 'الإيرادات المدفوعة' : 'Paid Revenue',
      value: 'paidRevenue',
      color: '#10B880'
    },
    {
      name: lang === 'ar' ? 'الإيرادات غير المدفوعة' : 'Unpaid Revenue',
      value: 'unpaidRevenue',
      color: '#E94554'
    },
    {
      name: lang === 'ar' ? 'إجمالي التكلفة' : 'Total Cost',
      value: 'totalCost',
      color: '#FFBC75'
    },
    {
      name: lang === 'ar' ? 'اجمالي الايرادات' : 'Gross Profit',
      value: 'grossProfit',
      color: '#63C3A5'
    },
  ];


  const bars = getBars(lang);
  const totalRevenue = branchSummaries.reduce((sum, item) => sum + item.totalRevenue, 0);
  const translateDataKey = (key: string, lang: string): string => {
    const translations: { [key: string]: string } = {
      totalRevenue: lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      paidRevenue: lang === 'ar' ? 'الإيرادات المدفوعة' : 'Paid Revenue',
      unpaidRevenue: lang === 'ar' ? 'الإيرادات غير المدفوعة' : 'Unpaid Revenue',
      totalCost: lang === 'ar' ? 'إجمالي التكلفة' : 'Total Cost',
      grossProfit: lang === 'ar' ? 'الربح الإجمالي' : 'Gross Profit',
      branchName: lang === 'ar' ? 'اسم الفرع' : 'Branch Name',
      paidOrders: lang === 'ar' ? 'الطلبات المدفوعة' : 'Paid Orders',
      unpaidOrders: lang === 'ar' ? 'الطلبات غير المدفوعة' : 'Unpaid Orders',
      cancelledOrders: lang === 'ar' ? 'الطلبات الملغاة' : 'Cancelled Orders',
      profitMarginPercent: lang === 'ar' ? 'نسبة هامش الربح' : 'Profit Margin %',
      avgOrderValue: lang === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value',
    };

    if (key in translations) {
      return translations[key];
    }
    return addSpacesToCamelCase(key);
  };



  return (
    <WidgetCard
      title={lang === 'ar' ? 'تحليل إحصائيات الفروع' : 'Branch Statistics Analysis'}
      titleClassName="font-normal sm:text-sm text-gray-500 mb-2.5 font-inter"
      className={cn('min-h-[28rem]', className)}
      description={
        <div className="flex items-center justify-start">
          <Title as="h2" className="me-2 font-semibold flex items-center w-fit gap-1 ">
            {totalRevenue.toLocaleString()} {currency==='ر.س'? <Image src={sarIcon} alt="SAR" width={30} height={30} />:currency}
          </Title>
        </div>
      }
    >
      <div className="custom-scrollbar overflow-x-auto -mb-3 pb-3">
        <div className="h-[28rem] w-full pt-6 @lg:pt-8">
          <ResponsiveContainer width="100%" height="100%" minWidth={1100}>
            <ComposedChart
              data={formattedData}
              margin={{ left: 5 }}
              barGap={0}
              className="rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-5 ltr:[&_.recharts-cartesian-axis.yAxis]:translate-x-5"

            >
              <CartesianGrid vertical={false} strokeOpacity={0.435} strokeDasharray="8 10" />
              <Legend name='' lang={lang} className="mt-2 flex gap-20 @3xl:hidden" />
              <XAxis
                reversed={lang === 'ar'} 
               dataKey={'branchName'} axisLine={false} tickLine={false} />
              <YAxis
                orientation={lang === 'ar' ? 'right' : 'left'}
                axisLine={false}
                tickLine={false}
                dataKey="totalRevenue"
                tick={({ payload, ...rest }) => {
                  const pl = {
                    ...payload,
                    value: Number(payload.value),
                  };

                  return (
                    <CustomYAxisTick
                      payload={pl}
                      {...rest}
                      prefix={
                        currency === 'ر.س' ? (
                          <Image
                            src={sarIcon}
                            alt="SAR"
                            width={14}
                            height={14}
                            style={{ display: 'inline-block' }}
                          />
                        ) : (
                          currency
                        )
                      }
                    />
                  );
                }}
              />
           <Tooltip
            content={
              <CustomTooltip
                lang={lang!}
                translateKey={(key: string) => translateDataKey(key, lang)}
                prefix={
                  currency === 'ر.س' ? (
                    <Image
                      src="/assets/Saudi_Riyal_Symbol.svg.png"
                      alt="SAR"
                      width={14}
                      height={14}
                      style={{ display: 'inline-block' }}
                    />
                  ) : (
                    currency
                  )
                }
                currency={currency} // 👈 مهم نمرره عشان نعرف العملة داخل التولتيب
              />
            }
          />

              {/* // labelFormatter={(label) => (lang === 'ar' ? 'الفرع: ' : 'Branch: ') + label}
              // formatter={(value, name) => {
              //   // استخدام الاسم المترجم من الأعمدة
              //   const translatedName = bars.find(bar => bar.value === name)?.name || name;
              //   return [`${value} ${currency}`, translatedName];
              // }}
              /> */}
              {bars.map((bar) => (
                <Bar
                  key={bar.value}
                  dataKey={bar.value}
                  fill={bar.color}
                  barSize={28}
                  radius={[4, 4, 0, 0]}
                  name={bar.name}
                />
              ))}
              <Line
                type="monotone"
                dataKey=""
                stroke="#eab308"
                strokeWidth={2}
                dot={false}

              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  )
}
