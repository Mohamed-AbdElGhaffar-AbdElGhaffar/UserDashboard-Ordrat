import ActionsCellActive from '@/app/components/tables/branch/actionsCellActive/ActionsCellActive';
import ActionsCellBranch from '@/app/components/tables/branch/actionsCellBranch/ActionsCellBranch';
import ActionsCellCoupon from '@/app/components/tables/coupon/actionsCellCoupon/ActionsCellCoupon';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';
import { Branches, CouponEntity, PhoneNumberOrder } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '@ui/date-cell';
import { Checkbox, Text } from 'rizzui';

const columnHelper = createColumnHelper<PhoneNumberOrder>();

export const defaultColumns = (lang: string) => {

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
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.orderCost}
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
