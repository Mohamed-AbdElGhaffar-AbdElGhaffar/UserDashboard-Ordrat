import { ActionIcon, Select, SelectOption, Text } from 'rizzui';
import { type Table as ReactTableType } from '@tanstack/react-table';
import {
  PiCaretLeftBold,
  PiCaretRightBold,
  PiCaretDoubleLeftBold,
  PiCaretDoubleRightBold,
} from 'react-icons/pi';

const initOptions = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
];

export default function TablePagination<TData extends Record<string, any>>({
  table,
  lang,
  options,
  pageIndex,
  totalPages,
  setPageIndex,
}: {
  table: ReactTableType<TData>;
  lang: string;
  options?: { value: number; label: string }[];
  pageIndex?: number;
  totalPages?: number;
  setPageIndex?: (index: number) => void;
}) {
  const currentPageIndex = pageIndex !== undefined ? pageIndex : table?.getState().pagination.pageIndex;
  const totalPageCount = totalPages !== undefined ? totalPages : table?.getPageCount();
  const canPreviousPage = pageIndex !== undefined ? pageIndex === 0 : !table?.getCanPreviousPage();
  const canNextPage = pageIndex !== undefined ? pageIndex >= (totalPages || 1) - 1 : !table?.getCanNextPage();

  const handlePageChange = (newPageIndex: number) => {
    if (setPageIndex) {
      setPageIndex(newPageIndex);
    } else {
      table?.setPageIndex(newPageIndex);
    }
  };
  return (
    <div className="flex w-full items-center justify-between @container">
      <div className="hidden @2xl:block">
        <Text>
          {table.getFilteredSelectedRowModel().rows.length} {lang === 'ar' ? 'من' : 'of'}{' '}
          {table.getFilteredRowModel().rows.length} {lang === 'ar' ? 'صفوف' : 'row(s)'}{' '}{lang === 'ar' ? 'محددة' : 'selected'}.
        </Text>
      </div>
      <div className="flex w-full items-center justify-between gap-6 @2xl:w-auto @2xl:gap-12">
        <div className="flex items-center gap-4">
          <Text className="hidden font-medium text-gray-900 @md:block">
            {lang === 'ar' ? 'الصفوف لكل صفحة' : 'Rows per page'}
          </Text>
          <Select
            options={options || initOptions}
            className="w-[70px]"
            value={table.getState().pagination.pageSize}
            onChange={(v: SelectOption) => {
              table.setPageSize(Number(v.value));
            }}
            selectClassName="font-semibold text-sm ring-0 shadow-sm h-9"
            dropdownClassName="font-medium [&_li]:justify-center [&_li]:text-sm"
          />
        </div>
        <Text className="hidden font-medium text-gray-900 @3xl:block">
          {lang === 'ar' ? 'الصفحة' : 'Page'} {currentPageIndex + 1} {lang === 'ar' ? 'من' : 'of'} {totalPageCount}
        </Text>
        <div className="grid grid-cols-4 gap-2">
          <ActionIcon
            rounded="lg"
            variant="outline"
            aria-label={lang === 'ar' ? 'الذهاب إلى الصفحة الأولى' : 'Go to first page'}
            onClick={() => handlePageChange(0)}
            disabled={canPreviousPage}
            className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none"
          >
            <PiCaretDoubleLeftBold className="size-4 rtl:rotate-180" />
          </ActionIcon>
          <ActionIcon
            rounded="lg"
            variant="outline"
            aria-label={lang === 'ar' ? 'الذهاب إلى الصفحة السابقة' : 'Go to previous page'}
            onClick={() => handlePageChange(currentPageIndex - 1)}
            disabled={canPreviousPage}
            className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none"
          >
            <PiCaretLeftBold className="size-4 rtl:rotate-180" />
          </ActionIcon>
          <ActionIcon
            rounded="lg"
            variant="outline"
            aria-label={lang === 'ar' ? 'الذهاب إلى الصفحة التالية' : 'Go to next page'}
            onClick={() => handlePageChange(currentPageIndex + 1)}
            disabled={canNextPage}
            className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none"
          >
            <PiCaretRightBold className="size-4 rtl:rotate-180" />
          </ActionIcon>
          <ActionIcon
            rounded="lg"
            variant="outline"
            aria-label={lang === 'ar' ? 'الذهاب إلى الصفحة الأخيرة' : 'Go to last page'}
            onClick={() => handlePageChange((totalPageCount || 1) - 1)}
            disabled={canNextPage}
            className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none"
          >
            <PiCaretDoubleRightBold className="size-4 rtl:rotate-180" />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
}
