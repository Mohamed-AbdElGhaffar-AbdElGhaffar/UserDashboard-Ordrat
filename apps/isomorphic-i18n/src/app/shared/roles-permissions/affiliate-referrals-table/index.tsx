'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@hooks/use-table';
import { useColumn } from '@hooks/use-column';
import ControlledTable from '@/app/shared/controlled-table/index';

import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi';
import { ActionIcon } from 'rizzui';
import cn from '@utils/class-names';
import ExpandedOrderRow from '@/app/shared/ecommerce/order/order-list/expanded-row';
import axiosClient from '@/app/components/context/api';
import { useTranslation } from '@/app/i18n/client';
import { Referrals } from '@/data/users-data';
import { useUserContext } from '@/app/components/context/UserContext';
import toast from 'react-hot-toast';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import WidgetCard from '@components/cards/widget-card';
import { getColumns } from './columns';

const shopId = GetCookiesClient('shopId');

const FilterElement = dynamic(
  () => import('@/app/shared/roles-permissions/affiliate-referrals-table/filter-element'),
  { ssr: false }
);
const TableFooter = dynamic(() => import('@/app/shared/table-footer'), {
  ssr: false,
});

const filterState = {
  role: '',
  status: '',
}; 

export default function ReferralsTable({ usersData = [], lang }: { usersData: any[]; lang:string; }) {
  // const [pageSize, setPageSize] = useState(10);

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
  //   selectedRowKeys,
  //   setSelectedRowKeys,
  //   handleRowSelect,
  //   handleSelectAll,
  //   handleDelete,
  //   handleReset,
  // } = useTable(data, pageSize, filterState);

  // const columns = useMemo(
  //   () =>
  //     getColumns({
  //       data,
  //       sortConfig,
  //       checkedItems: selectedRowKeys,
  //       onHeaderCellClick,
  //       onDeleteItem,
  //       onChecked: handleRowSelect,
  //       handleSelectAll,
  //       lang,
  //     }),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [
  //     selectedRowKeys,
  //     onHeaderCellClick,
  //     sortConfig.key,
  //     sortConfig.direction,
  //     onDeleteItem,
  //     handleRowSelect,
  //     handleSelectAll,
  //   ]
  // );

  // const { visibleColumns, checkedColumns, setCheckedColumns } =
  //   useColumn(columns);
  
  // ✅ State management
  const [data, setData] = useState(usersData);
  const [isLoading, setIsLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ phoneNumber: string }>({
    phoneNumber: '',
  });
  const { groupsPermissions, setGroupsPermissions } = useUserContext();
  
  
  // Functions to update filters and search, and reset them.
  const updateFilter = (columnId: string, filterValue: string | any[]) => {
    setFilters((prev) => ({ ...prev, [columnId]: filterValue }));
    setCurrentPage(1); // reset page for new filter
  };

  const handleReset = () => {
    setFilters({ phoneNumber: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  // const t = translations[lang as 'en' | 'ar'] || translations.en;

  // ✅ Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/api/Affiliate/referrals`);

      console.log("response.data: ", response.data);

      const apiData = response.data;

      const transformedUsers: Referrals[] = apiData.map((user: any) => ({
        userName: user.referralCode  || '--------',
        referralDate: new Date(user.referralDate),
        subscribed: user.isSubscribed || false,
        planStatus: user.isPlanActive || false,
        payments: user.paymentCount || 0,
      }));
      const pages = Math.ceil(transformedUsers.length / pageSize);
      const start = (currentPage - 1) * pageSize;
      const paginatedUsers = transformedUsers.slice(start, start + pageSize);
  
      setData(paginatedUsers);
      setTotalPages(pages == 0? 1 : pages); 
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  // Initial data load on mount or when lang changes
  useEffect(() => {
    fetchData().finally(() => {
      setIsLoading(false);
      setFirstLoad(false);
    });
  }, [lang]);

  // Re-fetch data when pagination, filters, or search changes (except on first load)
  useEffect(() => {
    if (!firstLoad) {
      fetchData();
    }
  }, [currentPage, pageSize, filters, searchTerm]);

  useEffect(() => {
    if (groupsPermissions == true) {
      fetchData();
      setGroupsPermissions(false);
    }
  }, [groupsPermissions]); 

  // Handle pagination change
  const handlePaginate = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
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
  const handleDeleteEmployee = async (id:String) => {
    
  };
  const onDeleteItem = useCallback((id: string) => {
    handleDeleteEmployee(id);
  }, [handleDeleteEmployee]);  

  // ✅ Generate table columns dynamically (Fixed)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleRowSelect = (id: string) => {
    setSelectedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((item) => item.id);
      setSelectedRowKeys(allIds);
    } else {
      setSelectedRowKeys([]);
    }
  };
  // Generate table columns dynamically (make sure getColumns expects all these properties)
  const columns = useMemo(() => {
    return getColumns({
      data,
      sortConfig,
      onHeaderCellClick: handleSort,
      onDeleteItem,
      lang,
      checkedItems: selectedRowKeys,
      onChecked: handleRowSelect,
      handleSelectAll
    });
  }, [data, sortConfig, handleSort, onDeleteItem, lang, selectedRowKeys]);

  const { visibleColumns, checkedColumns, setCheckedColumns } =
    useColumn(columns);

  const { t } = useTranslation(lang!, "table");
  // const { t : tableLang } = useTranslation(lang!, "table");


  return (
    <WidgetCard title='' className="!pt-2 flex flex-col gap-4 mt-6">
      <div className="">
        <FilterElement
          isFiltered={!!(filters.phoneNumber || searchTerm)}
          filters={filters}
          updateFilter={updateFilter}
          handleReset={handleReset}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          lang={lang}
        />
        <ControlledTable
          variant="modern"
          data={data}
          lang={lang}
          isLoading={isLoading}
          showLoadingText={true}
          // @ts-ignore
          columns={columns}
          paginatorOptions={{
            pageSize,
            setPageSize,
            total: totalPages * pageSize,
            current: currentPage,
            onChange: (page: number) => handlePaginate(page),
          }}
          // tableFooter={
          //   <TableFooter
          //     lang={lang}
          //     checkedItems={selectedRowKeys}
          //     handleDelete={(ids: string[]) => {
          //       setSelectedRowKeys([]);
          //       handleDelete(ids);
          //     }}
          //   />
          // }
          className="rounded-md border border-muted text-sm shadow-sm [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:h-60 [&_.rc-table-placeholder_.rc-table-expanded-row-fixed>div]:justify-center [&_.rc-table-row:last-child_td.rc-table-cell]:border-b-0 [&_thead.rc-table-thead]:border-t-0"
        />
      </div>
    </WidgetCard>
  );
}
