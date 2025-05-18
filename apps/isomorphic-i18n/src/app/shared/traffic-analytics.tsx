'use client';

import WidgetCard from '@components/cards/widget-card';
import cn from '@utils/class-names';
import { Progressbar, Text } from 'rizzui';
import { OrderStatusSummary } from '../[lang]/(hydrogen)/statistics/page';

export default function TrafficAnalytics({
  className,
  lang,
  orderStatusSummaries
}: {
  className?: string;
  lang: string;
  orderStatusSummaries: OrderStatusSummary[];
}) {
  const barColorClassName = ['bg-[#E11D48]', 'bg-[#FFD66B]','bg-[#F9A000]', 'bg-[#5DD581]','bg-[#08802C]'];
  const barColorClassName1 = [
    'bg-[#E11D48]/10 text-black', 
    'bg-[#FFD66B]/10 text-black', 
    'bg-[#F9A000]/10 text-black', 
    'bg-[#5DD581]/10 text-black', 
    'bg-[#08802C]/10 text-black'  
  ];
  
  const translateStatus = (statusName: string, lang: 'ar' | 'en'): string => {
    const translations: Record<string, { ar: string; en: string }> = {
      Pending: { ar: 'معلق', en: 'Pending' },
      Delivered: { ar: 'تم التوصيل', en: 'Delivered' },
      Canceled: { ar: 'ملغي', en: 'Cancelled' },
      BeingDelivered: { ar: 'جاري التوصيل', en: 'Being Delivered' },
      BeingPrepared: { ar: 'جاري التحضير', en: 'Preparing' },
    };
  
    if (translations[statusName]) {
      return translations[statusName][lang];
    }
  
    return statusName;
  };
  
  return (
    <WidgetCard title={lang==='ar'?'تحليل حالات الطلبات':'Order Status Analytics'} className={className}>
      {orderStatusSummaries.map((item, idx) => (
        <div className="my-6 space-y-2 relative" key={idx}>
          <div className="flex items-center gap-2">

          <Text className="font-medium text-gray-900">  {translateStatus(item.statusName, lang as any)}
          </Text>
          <Text  as="span"
            className={cn(
              "text-sm px-2 py-1 rounded-xl",
              barColorClassName1[idx % barColorClassName1.length]
            )}
          >
            {item.orderCount}{" "}{lang === 'ar' ? 'طلب' : 'order'}
          </Text>       
             </div>
          <div className="relative w-full">
            <Progressbar
              size="xl"
              value={item.percentage}
              barClassName={cn(
                "relative after:content-[''] after:size-2 after:rounded-full after:bg-white after:absolute after:top-1/2 after:-translate-y-1/2 after:end-1",
                barColorClassName[idx]
              )}
              className="relative w-full rounded-full bg-muted p-1 pe-2 h-6"
            />
            <span className="absolute end-5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-700">
              {item.percentage}%
            </span>
          </div>
        </div>
      ))}
    </WidgetCard>
  );
}
