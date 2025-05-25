import ActionsCellBranch from '@/app/components/tables/branch/actionsCellBranch/ActionsCellBranch';
import ActionsCellPrinter from '@/app/components/tables/printer/actionsCellPrinter/ActionsCellPrinter';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';
import { Printer } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import { id } from 'date-fns/locale';
import { Checkbox, Text } from 'rizzui';

const columnHelper = createColumnHelper<Printer>();

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


export const defaultColumns = (lang: string, categories: any[]) => {
  const hasActions = RoleClientExist([
    'UpdatePrinter',
    'DeletePrinter',
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
    columnHelper.accessor('ip', {
      id: 'ip',
      size: 240,
      header: lang === 'ar' ? 'IP' : 'IP',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.ip}
        </Text>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      id: 'name',
      size: 240,
      header: lang === 'ar' ? 'اسم الطابعة' : 'Printer Name',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.name}
        </Text>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('totalCategories', {
      id: 'totalCategories',
      size: 240,
      header: lang === 'ar' ? 'عدد اقسام الطابعة' : 'Total Categories Printer',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.totalCategories}
        </Text>
      ),
    }),
    columnHelper.accessor('branch', {
      id: 'branch',
      size: 240,
      header: lang === 'ar' ? 'الفرع' : 'Branch',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.branch}
        </Text>
      ),
    }),
  ];
  if (hasActions) {
    columns.push(
      columnHelper.accessor('userName', {
        id: 'userName',
        size: 160,
        header: '',
        enablePinning: true,
        enableSorting: false,
        cell: ({ row }) => <ActionsCellPrinter row={row} lang={lang} categories={categories}/>,
      })
    );
  }

  return columns;
};
