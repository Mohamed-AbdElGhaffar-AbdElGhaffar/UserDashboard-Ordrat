import ActionsCellActive from '@/app/components/tables/branch/actionsCellActive/ActionsCellActive';
import ActionsCellBranch from '@/app/components/tables/branch/actionsCellBranch/ActionsCellBranch';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';
import { whatsApp } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '@ui/date-cell';
import { Checkbox, Text } from 'rizzui';

const columnHelper = createColumnHelper<whatsApp>();

export const defaultColumns = (lang: string) => {
  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      size: 240,
      header: lang === 'ar' ? 'اسم المستقبل' : 'Reciver Name',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.name}
        </Text>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('phoneNumber', {
      id: 'phoneNumber',
      size: 240,
      header: lang === 'ar' ? 'رقم هاتف المستقبل' : 'Reciver phone number',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.phoneNumber}
        </Text>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('massage', {
      id: 'massage',
      size: 240,
      header: lang === 'ar' ? 'الرسالة' : 'Massage',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.massage}
        </Text>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('sendingTime', {
      id: 'sendingTime',
      size: 240,
      header: lang === 'ar' ? 'تاريخ الإرسال' : 'Sending Time',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Text className="font-lexend text-sm font-normal text-gray-900 dark:text-gray-700">
            <DateCell lang={lang} date={new Date(row.original.sendingTime)} />
          </Text>
  
        </div>
      ),
    }),
  ];
  return columns;
};
