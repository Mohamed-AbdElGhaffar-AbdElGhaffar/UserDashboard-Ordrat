import ActionsCellActive from '@/app/components/tables/branch/actionsCellActive/ActionsCellActive';
import ActionsCellBranch from '@/app/components/tables/branch/actionsCellBranch/ActionsCellBranch';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';
import { Branches } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';

const columnHelper = createColumnHelper<Branches>();

const formatTime = (time: string, lang: string) => {
  if (!time || typeof time !== 'string' || !time.includes(':')) {
    return lang === 'ar' ? 'وقت غير صحيح' : 'Invalid Time';
  }
  try {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return lang === 'ar' ? 'وقت غير صحيح' : 'Invalid Time';
    }
    const period = hours >= 12 ? (lang === 'ar' ? 'م' : 'PM') : (lang === 'ar' ? 'ص' : 'AM');
    const formattedHours = hours % 12 || 12;
    const localizeNumber = (num: number) => {
      const padded = num.toString().padStart(2, '0');
      return lang === 'ar'
        ? padded.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d])
        : padded;
    };
    return `${localizeNumber(formattedHours)}:${localizeNumber(minutes)}:${localizeNumber(seconds)} ${period}`;
  } catch (error) {
    return lang === 'ar' ? 'وقت غير صحيح' : 'Invalid Time';
  }
};

const formatTimeLocalized = (time: string, lang: string) => {
  if (!time || typeof time !== 'string' || !time.includes(':')) {
    return lang === 'ar' ? 'وقت غير صحيح' : 'Invalid Time';
  }
  try {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return lang === 'ar' ? 'وقت غير صحيح' : 'Invalid Time';
    }
    const localizeNumber = (num: number) => {
      const padded = num.toString().padStart(2, '0');
      return lang === 'ar'
        ? padded.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d])
        : padded;
    };
    return `${localizeNumber(hours)}:${localizeNumber(minutes)}:${localizeNumber(seconds)}`;
  } catch (error) {
    return lang === 'ar' ? 'وقت غير صحيح' : 'Invalid Time';
  }
};


export const defaultColumns = (lang: string, languages: number) => {
  const updateStatusActivate = RoleClientExist([
    'ActivateBranch',
  ]);
  const updateStatusDeActivate = RoleClientExist([
    'DeActivateBranch',
  ]);
  const hasActions = RoleClientExist([
    'DeleteBranch',
    'UpdateBranch',
    'GetBranchById',
  ]);
  const hasAccess = RoleClientExist([
    'GetBranchByShopId',
  ]);

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      size: 60,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows"
          checked={table.getIsAllPageRowsSelected()}
          onChange={() => table.toggleAllPageRowsSelected()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onChange={() => row.toggleSelected()}
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      id: 'name',
      size: 240,
      header: lang === 'ar' ? 'اسم الفرع' : 'Branch Name',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.name}
        </Text>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('totalSales', {
      id: 'totalSales',
      size: 240,
      header: lang === 'ar' ? 'اجمالي المبيعات' : 'Total Sales',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.totalSales}
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      size: 240,
      header: lang === 'ar' ? 'الحالة' : 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Text className="font-lexend text-sm font-normal text-gray-900 dark:text-gray-700">
            {row.original.status}
          </Text>
          {updateStatusActivate&& updateStatusDeActivate &&(
            <ActionsCellActive row={row as any} lang={lang} />
          )}
        </div>
      ),
    }),
    columnHelper.accessor('openAt', {
      id: 'openAt',
      size: 200,
      header: lang === 'ar' ? 'وقت الفتح' : 'Opening At',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {formatTime(row.original.openAt, lang)}
        </Text>
      ),
    }),
    columnHelper.accessor('closedAt', {
      id: 'closedAt',
      size: 200,
      header: lang === 'ar' ? 'وقت الإغلاق' : 'Closed At',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {formatTime(row.original.closedAt, lang)}
        </Text>
      ),
    }),
    columnHelper.accessor('deliveryTime', {
      id: 'deliveryTime',
      size: 200,
      header: lang === 'ar' ? 'مده التوصيل' : 'Delivery Time',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {formatTimeLocalized(row.original.deliveryTime, lang)}
        </Text>
      ),
    }),
  ];

  if (hasAccess && hasActions) {
    columns.push(
      columnHelper.accessor('userName', {
        id: 'userName',
        size: 160,
        header: '',
        enablePinning: true,
        enableSorting: false,
        cell: ({ row }) => <ActionsCellBranch row={row} lang={lang} languages={languages}/>,
      })
    );
  }

  return columns;
};
