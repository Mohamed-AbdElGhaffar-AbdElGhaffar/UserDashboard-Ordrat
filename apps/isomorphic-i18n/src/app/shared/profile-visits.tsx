'use client';

import WidgetCard from '@components/cards/widget-card';
import { CustomTooltip } from '@components/charts/custom-tooltip';
import { useTheme } from 'next-themes';
import { useMedia } from 'react-use';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CountrySummary } from '../[lang]/(hydrogen)/statistics/page';

export default function ProfileVisits({
  className,
  countrySummaries,
  lang
}: {
  className?: string;
  lang: string;
  countrySummaries: CountrySummary[];
}) {
  const isSM = useMedia('(max-width: 640px)', false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <WidgetCard
      className={className}
      title={lang==='ar'?'تحليل دول الزائرين':'Visitor Country Analysis'}
      headerClassName="items-center"
    >
      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <div className="mt-6 h-[300px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isSM && { minWidth: '500px' })}
          >
            <BarChart
              data={countrySummaries}
              margin={{
                top: 30,
                left: 10,
              }}
              className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:translate-x-8 ltr:[&_.recharts-cartesian-axis.yAxis]:-translate-x-8 [&_.recharts-cartesian-grid-vertical]:opacity-0"
            >
              <CartesianGrid strokeDasharray="1 0" vertical={false} />
              <XAxis 
                reversed={lang === 'ar'} 
                dataKey="country" tickLine={false} />
              <YAxis 
                orientation={lang === 'ar' ? 'right' : 'left'}
                dataKey="visitsCount" axisLine={false} tickLine={false}  />
              <Tooltip content={<CustomTooltip formattedNumber />} />
              <Bar
                barSize={24}
                fill={'#10B880'}
                dataKey={'visitsCount'}
                radius={[0, 0, 6, 6]}
                background={{ fill: isDark ? '#333333' : '#F1F1F2', radius: 6 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}