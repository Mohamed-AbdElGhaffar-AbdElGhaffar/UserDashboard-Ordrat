import ActionsCellBranch from '@/app/components/tables/branch/actionsCellBranch/ActionsCellBranch';
import ActionsCellActive from '@/app/components/tables/category/actionsCellActive/ActionsCellActive';
import ActionsCellCategory from '@/app/components/tables/category/actionsCellCategory/ActionsCellCategory';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';
import { Categories } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import AvatarCard from '@ui/avatar-card';
import { Checkbox, Text } from 'rizzui';

const columnHelper = createColumnHelper<Categories>();
 
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
  const updateActivationStatus = RoleClientExist([
    'ChangeCategoryActivationStatus',
  ]);
  const hasActions = RoleClientExist([
    'DeleteCategory',
    'UpdateCategory',
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
      header: lang === 'ar' ? 'اسم القسم' : 'Category Name',
      cell: ({ row }) => (
        // <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
        //   {row.original.name}
        // </Text>
        <AvatarCard
          src={row.original.bannerUrl}
          name={row.original.name}
          description={``}
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('priority', {
      id: 'priority',
      size: 120,
      header: lang === 'ar' ? 'الترتيب' : 'Priority',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.priority}
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      size: 160,
      header: lang === 'ar' ? 'الحالة' : 'Status',
      cell: ({ row }) => (
        <div id='change-status-category' className='flex items-center gap-2'>
          <Text className="font-lexend text-sm font-normal text-gray-900 dark:text-gray-700">
            {row.original.status}
          </Text>
          {updateActivationStatus &&(
            <ActionsCellActive row={row as any} 
              lang={lang}
            />
          )}
        </div>
      ),
    }),
    columnHelper.accessor('numberOfColumns', {
      id: 'numberOfColumns',
      size: 200,
      header: lang === 'ar' ? 'شكل القسم' : 'Category Design',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.numberOfColumns}
        </Text>
      ),
    }),
    columnHelper.accessor('numberOfProducts', {
      id: 'numberOfProducts',
      size: 200,
      header: lang === 'ar' ? 'عدد المنتجات' : 'Number Of Products',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.numberOfProducts}
        </Text>
      ),
    }),
  ]

  if (hasActions) {
    columns.push(
      columnHelper.accessor('userName', {
        id: 'userName',
        size: 160,
        header: '',
        enablePinning: true,
        enableSorting: false,
        cell: ({ row }) => <ActionsCellCategory row={row} lang={lang} languages={languages}/>,
      })
    );
  }

  return columns;
};
