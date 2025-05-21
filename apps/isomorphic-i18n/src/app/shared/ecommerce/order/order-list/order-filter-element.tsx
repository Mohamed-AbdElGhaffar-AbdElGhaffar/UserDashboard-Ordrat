'use client';

import React from 'react';
import { PiTrashDuotone } from 'react-icons/pi';
import DateFiled from '@/app/shared/controlled-table/date-field';
import PriceField from '@/app/shared/controlled-table/price-field';
import StatusField from '@/app/shared/controlled-table/status-field';
import { Badge, Text, Button } from 'rizzui';
import { getDateRangeStateValues } from '@utils/get-formatted-date';
import { useMedia } from '@hooks/use-media';

const statusOptions = [
  { value: '0', label: 'Cancelled / تم الإلغاء' },
  { value: '1', label: 'Pending / في انتظار الموافقة' },
  { value: '2', label: 'Being Prepared / يتم التحضير' },
  { value: '3', label: 'Being Delivered / يتم التوصيل' },
  { value: '4', label: 'Delivered / تم الاستلام' },
];

type FilterElementProps = {
  isFiltered: boolean;
  filters: { [key: string]: any };
  updateFilter: (columnId: string, filterValue: string | any[]) => void;
  handleReset: () => void;
  lang?: string;
};

export default function FilterElement({
  isFiltered,
  filters,
  updateFilter,
  handleReset,
  lang = 'en',
}: FilterElementProps) {
  const isMediumScreen = useMedia('(max-width: 1860px)', false);

  return (
    <>
      {/* <PriceField
        value={filters['price']}
        onChange={(data) => updateFilter('price', data)}
        label={lang === 'ar' ? 'السعر' : 'Price'}
      />
      <DateFiled
        className="w-full"
        selected={getDateRangeStateValues(filters['createdAt'][0])}
        startDate={getDateRangeStateValues(filters['createdAt'][0])}
        endDate={getDateRangeStateValues(filters['createdAt'][1])}
        onChange={(date: any) => {
          updateFilter('createdAt', date);
        }}
        placeholderText={lang === 'ar' ? 'حدد تاريخ الإنشاء' : 'Select created date'}
        {...(isMediumScreen && {
          inputProps: {
            label: lang === 'ar' ? 'تاريخ الإنشاء' : 'Created Date',
            labelClassName: 'font-medium text-gray-700',
          },
        })}
      />
      <DateFiled
        className="w-full"
        selected={getDateRangeStateValues(filters['updatedAt'][0])}
        startDate={getDateRangeStateValues(filters['updatedAt'][0])}
        endDate={getDateRangeStateValues(filters['updatedAt'][1])}
        onChange={(date: any) => {
          updateFilter('updatedAt', date);
        }}
        placeholderText={lang === 'ar' ? 'حدد تاريخ التعديل' : 'Select modified date'}
        {...(isMediumScreen && {
          inputProps: {
            label: lang === 'ar' ? 'تاريخ التعديل' : 'Due Date',
            labelClassName: 'font-medium text-gray-700',
          },
        })}
      /> */}
      <div>
        <StatusField
          options={statusOptions}
          value={filters['status']}
          onChange={(value: string) => {
            updateFilter('status', value);
          }}
          getOptionValue={(option: { value: any }) => option.value}
          getOptionDisplayValue={(option: { value: any }) =>
            renderOptionDisplayValue(option.value, lang)
          }
          displayValue={(selected: string) => renderOptionDisplayValue(selected, lang)}
          {...(isMediumScreen && {
            label: lang === 'ar' ? 'الحالة' : 'Status',
            placeholder: lang === 'ar' ? 'اختر حالة' : 'Choose Status',
            labelClassName: 'font-medium text-gray-700',
          })}
        />
      </div>
      {isFiltered ? (
        <Button
          size="sm"
          onClick={handleReset}
          className="h-8 bg-gray-200/70 mt-auto"
          variant="flat"
        >
          <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" />
          {lang === 'ar' ? 'مسح التصفية' : 'Clear'}
        </Button>
      ) : null}
    </>
  );
}

function renderOptionDisplayValue(value: string, lang: string) {
  switch (value) {
    case '0':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-red-dark">
            {lang === 'ar' ? 'تم الغاء الطلب' : 'Order Cancelled'}
          </Text>
        </div>
      );
    case '1':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium text-orange-dark">
            {lang === 'ar' ? 'انتظار الموافقة' : 'Order Pending'}
          </Text>
        </div>
      );
    case '2':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-gray-600">
            {lang === 'ar' ? 'يتم تحضير الطلب' : 'Being Prepared'}
          </Text>
        </div>
      );
    case '3':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium text-gray-600">
            {lang === 'ar' ? 'يتم توصيل الطلب' : 'Being Delivered'}
          </Text>
        </div>
      );
    case '4':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark">
            {lang === 'ar' ? 'تم الاستلام' : 'Delivered'}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium text-gray-600">
            {lang === 'ar' ? 'يتم توصيل الطلب' : 'Being Delivered'}
          </Text>
        </div>
      );
  }
}
