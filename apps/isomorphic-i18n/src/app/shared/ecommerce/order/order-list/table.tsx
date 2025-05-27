'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@hooks/use-table';
import { useColumn } from '@hooks/use-column';
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi';
import ControlledTable from '@/app/shared/controlled-table/index';
import { getColumns } from '@/app/shared/ecommerce/order/order-list/columns';
import { ActionIcon } from 'rizzui';
import cn from '@utils/class-names';
import ExpandedOrderRow from '@/app/shared/ecommerce/order/order-list/expanded-row';
import axiosClient from '@/app/components/context/api';
import { useTranslation } from '@/app/i18n/client';
import { useUserContext } from '@/app/components/context/UserContext';
// dynamic import
const FilterElement = dynamic(
  () => import('@/app/shared/ecommerce/order/order-list/order-filter-element'),
  { ssr: false }
);

function CustomExpandIcon(props: any) {
  return (
    <ActionIcon
      size="sm"
      variant="outline"
      rounded="full"
      className="expand-row-icon ms-2"
      onClick={(e) => {
        props.onExpand(props.record, e);
      }}
    >
      {props.expanded ? (
        <PiCaretUpBold className="h-3.5 w-3.5" />
      ) : (
        <PiCaretDownBold className="h-3.5 w-3.5" />
      )}
    </ActionIcon>
  );
}

const filterState = {
  price: ['', ''],
  createdAt: [null, null],
  updatedAt: [null, null],
  status: '',
};

const translations = {
  en: {
    searchPlaceholder: 'Search Orders...',
    noData: 'No orders found',
    pageSizeLabel: 'Items per page',
    totalOrders: 'Total Orders',
  },
  ar: {
    searchPlaceholder: 'بحث عن الطلبات...',
    noData: 'لا توجد طلبات',
    pageSizeLabel: 'عدد العناصر في الصفحة',
    totalOrders: 'إجمالي الطلبات',
  },
};

export default function OrderTable({
  shopId,
  lang = 'en',
  initData = [],
  variant = 'modern',
  className,
}: {
  shopId: string;
  lang?: string;
  initData: any[];
  variant?: 'modern' | 'minimal' | 'classic' | 'elegant' | 'retro';
  className?: string;
}) {
  // const [pageSize, setPageSize] = useState(1);

  // const onHeaderCellClick = (value: string) => ({
  //   onClick: () => {
  //     handleSort(value);
  //   },
  // });

  // const onDeleteItem = useCallback((id: string) => {
  //   handleDelete(id);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const {
  //   isLoading,
  //   isFiltered,
  //   tableData,
  //   currentPage,
  //   totalItems,
  //   handlePaginate,
  //   filters,
  //   updateFilter,
  //   searchTerm,
  //   handleSearch,
  //   sortConfig,
  //   handleSort,
  //   handleDelete,
  //   handleReset,
  // } = useTable(data, pageSize, filterState);

  // const columns = useMemo(
  //   () => getColumns({ sortConfig, onHeaderCellClick, onDeleteItem }),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [onHeaderCellClick, sortConfig.key, sortConfig.direction, onDeleteItem]
  // );

  // const { visibleColumns, checkedColumns, setCheckedColumns } =
  //   useColumn(columns);

  // ✅ State management
  const [data, setData] = useState([]); // Stores table data
  const [isLoading, setIsLoading] = useState(true); // ✅ Initially true for first load
  const [firstLoad, setFirstLoad] = useState(true);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages from API
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // Total number of pages from API
  const [filters, setFilters] = useState(filterState);
  const { mainBranch } = useUserContext();
  console.log("searchTerm: ",searchTerm);

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(filterState);
  };

  const isFiltered = useMemo(() => {
    return Object.values(filters).some(
      (val) =>
        (Array.isArray(val) && val.some((v) => v !== '' && v !== null)) ||
        (typeof val === 'string' && val.trim() !== '')
    );
  }, [filters]);

  // const t = translations[lang as 'en' | 'ar'] || translations.en;

  // ✅ Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/api/Order/Filter/filter/${shopId}`, {
        params: { 
          PageNumber: currentPage, 
          PageSize: pageSize, 
          OrderNumber: searchTerm?searchTerm:null,
          OrderStatus: filters.status || null,
          branchId: mainBranch
        },
        headers: { 'Accept-Language': lang },
      });
      console.log("response.data.entities: ",response.data.entities);
      
      setData(response.data.entities);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  // ✅ First time load (component mount)
  useEffect(() => {
    fetchData().finally(() => {
      setIsLoading(false);
      setFirstLoad(false); // ✅ Disable first-time loading after first fetch
    });
  }, [lang]);

  // ✅ Handle page changes without triggering loading
  useEffect(() => {
    if (!firstLoad) {
      fetchData();
    }
  }, [currentPage, pageSize, searchTerm, filters.status, mainBranch]);
  // ✅ Handle pagination change
  const handlePaginate = (page: number) => {
    setCurrentPage(page);
  };

  // ✅ Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // ✅ Handle sorting (Fixed to avoid infinite re-render)
  const handleSort = useCallback((key: string) => {
    // setSortConfig((prevSort) => {
    //   const direction = prevSort?.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc';
    //   return { key, direction };
    // });
    // console.log("");
    
  }, []);

  // ✅ Handle Delete Action
  const onDeleteItem = useCallback((id: string) => {
    console.log("Delete Order:", id);
  }, []);

  // ✅ Generate table columns dynamically (Fixed)
  const columns = useMemo(() => {
    return getColumns({ sortConfig, onHeaderCellClick: handleSort, onDeleteItem, lang });
  }, [sortConfig, handleSort, onDeleteItem, lang]);

  const { visibleColumns, checkedColumns, setCheckedColumns } =
    useColumn(columns);

  const { t } = useTranslation(lang!, "table");
  // const { t : tableLang } = useTranslation(lang!, "table");

  return (
    <div className={cn(className)}>
      <ControlledTable
        lang={lang}
        variant={variant}
        isLoading={isLoading}
        showLoadingText={true}
        data={data}
        // @ts-ignore
        columns={visibleColumns}
        expandable={{
          expandIcon: CustomExpandIcon,
          expandedRowRender: (record) => <ExpandedOrderRow record={record} lang={lang} />,
        }}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: totalPages * pageSize,
          current: currentPage,
          onChange: (page: number) => handlePaginate(page),
        }}
        filterOptions={{
          t: t,
          searchTerm,
          onSearchClear: () => {
            setSearchTerm('');
            setCurrentPage(1);
          },
          onSearchChange: (event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
          },
          // hasSearched: isFiltered,
          hideIndex: 1,
          columns,
          checkedColumns,
          setCheckedColumns,
          drawerTitle: lang === 'ar' ? 'تصفية الجدول' : 'Table Filters',
          enableDrawerFilter: true,
        }}
        filterElement={
          <FilterElement
            isFiltered={isFiltered}
            filters={filters}
            updateFilter={updateFilter}
            handleReset={handleReset}
            lang={lang}
          />
        }
        className={
          'rounded-md border border-muted text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0'
        }
        t={t}
      />
      
    </div>
  );
}
