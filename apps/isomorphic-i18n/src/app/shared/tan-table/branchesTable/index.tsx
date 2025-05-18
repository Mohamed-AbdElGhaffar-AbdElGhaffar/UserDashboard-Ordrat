'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Branches } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import AddButton from '../../branchAddButtom';
import toast from 'react-hot-toast';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';

export default function BranchesTable({lang = "en", languages, branches}:{lang?:string; languages: number; branches: Branches[];}) {
  const shopId = GetCookiesClient('shopId');
  const [defaultData, setDefaultData] = useState<Branches[]>(branches);
  const { branchesData, setBranchesData } = useUserContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<Branches>({
    tableData: defaultData,
    columnConfig: defaultColumns(lang, languages),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 5,
        },
      },
      filterFns: {
        statusFilter: (row, columnId, value) => {
          if (!value) return false;
          let status =
            row.original[columnId].toLowerCase() === value.toLowerCase()
              ? true
              : false;
          return status;
        },
        priceFilter: (row, columnId, value) => {
          if (!value) return false;
          return true;
        },
        createdDate: (row, columnId, value) => {
          if (!value) return false;
          return true;
        },
        dueDate: (row, columnId, value) => {
          if (!value) return false;
          return true;
        },
      },
      meta: {},
      enableColumnResizing: false,
    },
  });

  const fetchBranchesData = async () => {
    try {
      const response = await axiosClient.get(`api/Branch/GetByShopId/${shopId}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.data;

      const transformedData = data.map((branch: any) => ({
        id: branch.id,
        name: branch.name,
        userName: branch.name,
        totalSales:
          lang === 'ar'
            ? `${branch.monthlyPrice || 0} جنيه`
            : `${branch.monthlyPrice || 0} EGP`,
        status:
          branch.isActive? lang === 'ar'
            ? `نشط`
            : `Active`:lang === 'ar'
            ? `غير نشط`
            : `Not Active`,
        isActive: branch.isActive? `Active`:`Inactive`,
        openAt: branch.openAt,
        closedAt: branch.closedAt,
        deliveryTime: branch.deliveryTime,
      }));

      setDefaultData(transformedData);
      setData(transformedData);
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching plans:', error);
    }
  };

  // useEffect(() => {
  //   fetchBranchesData();
  // }, [setData, lang]); 

  useEffect(() => {
    if (branchesData == true) {
      handleRefreshData();
      setBranchesData(false);
    }
  }, [branchesData]); 

  const handleRefreshData = () => {
    fetchBranchesData();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الفروع' : 'Branches Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center gap-2 sm:gap-6">
            <RoleExist PageRoles={['GetBranchByShopId']}>
              <Button onClick={()=>{handleRefreshData(); toast.success(lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully');}} className="w-auto flex justify-end items-center gap-0 sm:gap-1.5 ">
                <PiArrowsClockwiseBold className="h-[17px] w-[17px]" />
                <span className='hidden sm:block'>{lang == "en"?"Update Data":'تحديث البيانات'}</span>
              </Button>
            </RoleExist>
            <RoleExist PageRoles={['CreateBranch']}>
              <AddButton lang={lang} title={lang == "en"?"Add Branch":'إضافة فرع'} onSuccess={handleRefreshData} languages={languages}/>
            </RoleExist>
        </div>
        <TableToolbar nameEN="Branch" nameAr="الفرع" table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
