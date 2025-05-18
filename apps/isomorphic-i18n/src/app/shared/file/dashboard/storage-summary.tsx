'use client';

import { Text } from 'rizzui';
import WidgetCard from '@components/cards/widget-card';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { useTranslation } from '@/app/i18n/client';
import { PaymentStatusSummary } from '@/app/[lang]/(hydrogen)/statistics/page';

const COLORS = ['#63C3A5', '#FBE3E4'];

function CustomLabel(props: any) {
  const { cx, cy } = props.viewBox;
  return (
    <>
      <text
        x={cx}
        y={cy - 5}
        fill="#111111"
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan alignmentBaseline="middle" fontSize="36px">
          {props.value1}
        </tspan>
      </text>
      <text
        x={cx}
        y={cy + 20}
        fill="#666666"
        className="recharts-text recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan fontSize="14px">{props.value2}</tspan>
      </text>
    </>
  );
}

// دالة لتحويل القيم إلى نسب متساوية
const makeEqualData = (data: PaymentStatusSummary[]): { name: string; value: number }[] => {
  if (data?.length === 2) {
    return [
      { name: data[0].paymentStatus, value: data[0].orderCount },
      { name: data[1].paymentStatus, value: data[1].orderCount + data[0].orderCount },
    ];
  }
  return data?.map(item => ({
    name: item.paymentStatus,
    value: item.orderCount,
  }));
};

export default function StorageSummary({ className, lang, currency ,paymentStatusSummaries, totalOrder }: {currency?:string; className?: string; lang?: string; paymentStatusSummaries?: PaymentStatusSummary[]; totalOrder?: number; }) {
  const { t } = useTranslation(lang!, 'common');

  // تحويل البيانات إلى نسب متساوية
  const transformedData = makeEqualData(paymentStatusSummaries as any);
  const totalOrders = transformedData?.reduce((acc, item) => acc + item.value, 0);

  return (
    <WidgetCard
      title={lang === 'ar' ? 'معدل استلام الطلبات' : 'Order Receiving Rate'}
      headerClassName=""
      className={className}
    >
      <div className="h-[373px] w-full @sm:py-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="[&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-white">
            <Pie
              data={transformedData}
              dataKey="value"
              nameKey="name"
              cornerRadius={40}
              innerRadius={100}
              outerRadius={120}
              paddingAngle={10}
              fill="#BFDBFE"
              stroke="rgba(0,0,0,0)"
            >
              {transformedData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                width={30}
                position="center"
                content={
                  <text x="50%" y="50%" className='text-base font-medium' textAnchor="middle" dominantBaseline="middle">
                    {transformedData && transformedData[0]?.value} {lang === 'ar' ? 'مدفوع من' : 'Paid of'}  {totalOrder}
                  </text>
                }
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        {paymentStatusSummaries?.map((item, index) => (
          <div
            key={index}
            className="mb-4 flex items-center justify-between border-b border-muted pb-4 last:mb-0 last:border-0 last:pb-0"
          >
            <div className="flex items-center justify-start gap-2">
              <span
                className="me-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <Text
                as="span"
                className="text-sm  font-medium text-gray-900 dark:text-gray-700 "
              >
                {item.paymentStatus === 'Unpaid'
                  ? (lang === 'ar' ? 'غير مدفوع' : 'Unpaid')
                  : (lang === 'ar' ? 'مدفوع' : 'Paid')}

              </Text>
              <Text as="span" className={`${index === 0 ? 'bg-green-50' : 'bg-red-50'} px-2 py-1 rounded-xl font-medium text-center`}>{item.percentage}%</Text>
            </div>
            <div className="flex items-center gap-1">
              <Text as="span" className='bg-slate-50 px-2 py-1 font-medium rounded-xl text-center'>{item.totalRevenue.toLocaleString()}{" "}{currency}</Text>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
