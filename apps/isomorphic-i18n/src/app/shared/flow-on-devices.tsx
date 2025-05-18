'use client';

import { Text } from 'rizzui';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import WidgetCard from '@components/cards/widget-card';
import cn from '@utils/class-names';
import { DeviceSummary } from '../[lang]/(hydrogen)/statistics/page';
import {
  PiDesktopDuotone,
  PiDeviceMobileDuotone,
} from 'react-icons/pi';
import { FaTabletAlt } from "react-icons/fa";
import { MdDeviceUnknown } from "react-icons/md";

export default function FlowOnDevices({ className, lang, deviceSummaries }: { className?: string; lang?: string; deviceSummaries: DeviceSummary[]; }) {
  const FLOW_ON_DEVICES_COLORS = ['#63C3A5', '#FFBC75', '#16A679','C5280C'];

  const flowOnDevicesStatisticsData = [
    {
      icon: PiDeviceMobileDuotone,
      name: lang === 'ar' ? 'الهاتف' : 'Mobile',
      value: deviceSummaries[0]?.percentage,
      color: '#63C3A5',
    },
    {
      icon: PiDesktopDuotone,
      name: lang === 'ar' ? 'الحاسوب' : 'Desktop',
      value: deviceSummaries[1]?.percentage,
      color: '#FFBC75',
    },
    {
      icon: FaTabletAlt,
      name: lang === 'ar' ? 'الجهاز اللوحي' : 'Tablet',
      value: deviceSummaries[2]?.percentage,
      color: '#C5280C',
    },
    {
      icon: MdDeviceUnknown,
      name: lang === 'ar' ? 'غير معروف' : 'Unknown',
      value: deviceSummaries[3]?.percentage,
      color: '#C5280C',
    },
  ];

  return (
    <WidgetCard
      title={lang === 'ar' ? 'مصدر الزيارات' : 'Traffic Source'}
      className={cn('@container/fd', className)}
    >
      <div className="mt-8 flex flex-col items-center gap-8">
        <div className="relative h-[100px] w-[120px]">
          <div className={`absolute start-1/2 top-1/2 size-28 ${lang === 'ar' ? 'translate-x-1/2 ' : '-translate-x-1/2 '} -translate-y-1/2 rounded-full border-[23px] border-gray-100 dark:border-muted`} />
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={flowOnDevicesStatisticsData}
                cornerRadius={10}
                innerRadius={40}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {deviceSummaries?.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={FLOW_ON_DEVICES_COLORS[index % FLOW_ON_DEVICES_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend deviceSummaries={deviceSummaries as any} />
      </div>
    </WidgetCard>
  );
}

function CustomLegend({ deviceSummaries }: { deviceSummaries: DeviceSummary[] }) {
  const flowOnDevicesStatisticsData = [
    {
      icon: PiDeviceMobileDuotone,
      name: 'Mobile',
      value: deviceSummaries[0]?.percentage,
      color: '#63C3A5',
    },
    {
      icon: PiDesktopDuotone,
      name: 'Desktop',
      value: deviceSummaries[1]?.percentage,
      color: '#FFBC75',
    },
    {
      icon: FaTabletAlt,
      name: 'Tablet',
      value: deviceSummaries[2]?.percentage,
      color: '#16A679',
    },
    {
      icon: MdDeviceUnknown,
      name: 'Unknown',
      value: deviceSummaries[3]?.percentage,
      color: '#C5280C',
    },
  ];

  return (
    <div className="flex  items-center sm:gap-14 gap-5 ">
      {flowOnDevicesStatisticsData?.map((item: any) => {
        const Icon = item.icon;
        return (
          <div key={item.name} className="flex flex-col items-center gap-2">
            <Icon className="size-8" fill={item.color} />
            <Text className="mb-0.5 mt-2 text-center">{item.name}</Text>
            <Text
              className="text-center text-[22px] font-bold leading-none"
              style={{
                color: item.color,
              }}
            >
              {item.value}%
            </Text>
          </div>
        );
      })}
    </div>
  );
}
