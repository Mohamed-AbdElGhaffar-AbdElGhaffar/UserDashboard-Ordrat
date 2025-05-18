import ActionsCellActive from '@/app/components/tables/branch/actionsCellActive/ActionsCellActive';
import ActionsCellBranch from '@/app/components/tables/branch/actionsCellBranch/ActionsCellBranch';
import ActionsCellCoupon from '@/app/components/tables/coupon/actionsCellCoupon/ActionsCellCoupon';
import { Branches, CouponEntity } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '@ui/date-cell';
import { Checkbox, Text } from 'rizzui';

const columnHelper = createColumnHelper<CouponEntity>();



export const defaultColumns = (lang: string) => [

  columnHelper.accessor('code', {
    id: 'code',
    size: 240,
    header: lang === 'ar' ? 'الكود' : 'code',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.code}
      </Text>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('discountType', {
    id: 'discountType',
    size: 240,
    header: lang === 'ar' ? 'نوع الخصم' : 'discount Type',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.discountType ===0 ? (lang==='ar'? "نسبة مثوية":"Percentage"):(lang==='ar'? "رقمي":"Flat") }
      </Text>
    ),
  }),
  columnHelper.accessor('discountValue', {
    id: 'discountValue',
    size: 240,
    header: lang === 'ar' ? 'قيمة الخصم' : 'discount Value',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.discountValue}
      </Text>
    ),
  }),
  columnHelper.accessor('usageNumbers', {
    id: 'usageNumbers',
    size: 240,
    header: lang === 'ar' ? 'عدد مرات الاستخدام' : 'Usage Numbers',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.usageNumbers}
      </Text>
    ),
  }),
  columnHelper.accessor('usageLimit', {
    id: 'usageLimit',
    size: 240,
    header: lang === 'ar' ? 'المتبقي ' : 'usageLimit',
    cell: ({ row }) => (
      <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        {row.original.usageLimit}
      </Text>
    ),
  }),
  columnHelper.accessor('createdAt', {
    id: 'createdAt',
    size: 240,
    header: lang === 'ar' ? 'تاريخ الانشاء' : 'createdAt',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Text className="font-lexend text-sm font-normal text-gray-900 dark:text-gray-700">
          <DateCell lang={lang} date={new Date(row.original.createdAt)} />
        </Text>

      </div>
    ),
  }),
  columnHelper.accessor('expireDate', {
    id: 'expireDate',
    size: 240,
    header: lang === 'ar' ? 'تاريخ الانتهاء' : 'expireDate',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Text className="font-lexend text-sm font-normal text-gray-900 dark:text-gray-700">
          <DateCell lang={lang} date={new Date(row.original.expireDate)} />
        </Text>

      </div>
    ),
  }),
  
 
  columnHelper.accessor('userName', {
    id: 'userName',
    size: 160,
    header: '',
    enablePinning: true,
    enableSorting: false,
    cell: ({ row }) => <ActionsCellCoupon row={row as any} lang={lang}/>,
  })
];
