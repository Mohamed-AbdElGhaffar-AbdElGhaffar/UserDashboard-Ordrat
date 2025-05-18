import { Faq } from '@/data/tan-table-data';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import Image from 'next/image';
import ActionsCellFAQ from '@/app/components/faq/actionsCellFAQ/ActionsCellFAQ';
import { RoleClientExist } from '@/app/components/ui/roleClientExist/RoleClientExist';

const columnHelper = createColumnHelper<Faq>();

export const defaultColumns = (lang: string, languages: number) => {
  const hasActions = RoleClientExist([
    'DeleteFAQCategory',
    'UpdateFAQCategory',
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
    columnHelper.accessor('image', {
      id: 'image',
      size: 200,
      header: lang === 'ar' ? 'صورة القسم' : 'Category Image',
      cell: ({ row }) => (
        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-100">
          <img
            src={row.original.image}
            alt="FAQ Category"
            className="aspect-square h-14 w-14"
            width="650"
            height="300"
          />
        </div>
      ),
    }),
    columnHelper.accessor('name', {
      id: 'name',
      size: 240,
      header: lang === 'ar' ? 'اسم قسم الأسئلة' : 'FAQ Category Name',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.name}
        </Text>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('faqNumber', {
      id: 'faqNumber',
      size: 140,
      header: lang === 'ar' ? 'عدد الأسئلة' : 'FAQ Number',
      cell: ({ row }) => (
        <Text className="text-center font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.faqNumber}
        </Text>
      ),
    }),
    columnHelper.accessor('title', {
      id: 'title',
      size: 200,
      header: lang === 'ar' ? 'عنوان' : 'Title',
      cell: ({ row }) => (
        <Text className="font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.title}
        </Text>
      ),
    }),
    columnHelper.accessor('metaDescription', {
      id: 'metaDescription',
      size: 240,
      header: lang === 'ar' ? 'وصف جوجل' : 'Meta Description',
      cell: ({ row }) => (
        <Text className="text-center font-lexend text-sm font-medium text-gray-900 dark:text-gray-700">
          {row.original.metaDescription}
        </Text>
      ),
    })
  ]
  
  if (hasActions) {
    columns.push(
      columnHelper.accessor('userName', {
        id: 'userName',
        size: 160,
        header: '',
        enablePinning: true,
        enableSorting: false,
        cell: ({ row }) => <ActionsCellFAQ row={row} lang={lang} languages={languages}/>,
      })
    );
  }

  return columns;
};
