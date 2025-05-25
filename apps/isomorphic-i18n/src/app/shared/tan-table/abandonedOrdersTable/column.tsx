import Link from 'next/link';
import { routes } from '@/config/routes';
import EyeIcon from '@components/icons/eye';
import DateCell from '@ui/date-cell';
import PencilIcon from '@components/icons/pencil';
import AvatarCard from '@ui/avatar-card';
import DeletePopover from '@/app/shared/delete-popover';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Checkbox, Text, Tooltip } from 'rizzui';
import { PhoneNumberOrder } from '@/data/tan-table-data';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'
import Image from 'next/image';

const columnHelper = createColumnHelper<PhoneNumberOrder>();
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date ? date.toLocaleDateString("en-GB") : "Invalid Date";
};

export const defaultColumns = (lang: string,currencyAbbreviation:string) => {

  const columns = [
    columnHelper.accessor('phoneNumber', {
      id: 'phoneNumber',
      size: 240,
      header: lang === 'ar' ? 'رقم الهاتف' : 'phoneNumber',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.phoneNumber}
        </Text>
      ),
    }),
    columnHelper.accessor('orderCost', {
      id: 'orderCost',
      size: 240,
      header: lang === 'ar' ? 'تكلفة الطلب' : 'orderCost',
      cell: ({ row }) => (
          <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700 flex items-center gap-1">
          {row.original.orderCost}
          {row.original.currencyAbbreviation === "ر.س" ? (
            <Image src={sarIcon} alt="SAR" width={16} height={16} />
          ) : (
            <span>{row.original.currencyAbbreviation}</span>
          )}
        </Text>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('visitTime', {
  id: 'visitTime',
  size: 240,
  header: lang === 'ar' ? 'وقت الزيارة' : 'Visit Time',
  cell: ({ row }) => {
    const visitTime = row.original.visitTime;
    const formattedDate = visitTime
      ? new Date(visitTime).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '-';
    return (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {formattedDate}
      </Text>
    );
  },
  enableSorting: false,
}),
  ]
  return columns;
};