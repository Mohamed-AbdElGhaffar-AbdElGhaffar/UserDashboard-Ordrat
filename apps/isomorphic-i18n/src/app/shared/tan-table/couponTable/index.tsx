'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Branches, CouponEntity } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import AddButton from '../../CouponAddButtom';
import toast from 'react-hot-toast';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
const shopId = GetCookiesClient('shopId');
import RoleExist from '@/app/components/ui/roleExist/RoleExist';

export default function CouponTable({lang = "en"}:{lang?:string;}) {
  const [defaultData, setDefaultData] = useState<CouponEntity[]>([]);
  const { couponData, setCouponData } = useUserContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<CouponEntity>({
    tableData: defaultData,
    columnConfig: defaultColumns(lang),
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
      const response = await axiosClient.get(`api/Coupon/GetAll/${shopId}?PageNumber=1&PageSize=100`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.data;

      const transformedData = data.entities.map((branch: any) => ({
        id: branch.id,
        usageNumbers: branch.usageNumbers,
        code: branch.code,
      
        isActive: branch.isActive,
        isBanner: branch.isBanner,
        discountType: branch.discountType,
        discountValue: branch.discountValue,
        expireDate: branch.expireDate,
        createdAt: branch.createdAt,
        usageLimit: branch.usageLimit,
      }));

      setDefaultData(transformedData);
      setData(transformedData);
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      // router.push(`/${lang}/signin`);
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    fetchBranchesData();
  }, [setData, lang]); 

  useEffect(() => {
    if (couponData == true) {
      handleRefreshData();
      setCouponData(false);
    }
  }, [couponData]); 

  const handleRefreshData = () => {
    fetchBranchesData();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الكوبونات' : 'Coupons Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center gap-2 sm:gap-6">
            <Button onClick={()=>{handleRefreshData(); toast.success(lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully');}} className="w-auto">
              <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
              {lang == "en"?"Update Data":'تحديث البيانات'}
            </Button>
            <RoleExist PageRoles={['CreateCoupon']}>
              <AddButton lang={lang} title={lang == "en"?"Add Coupon":'إضافة كوبون'} onSuccess={handleRefreshData} />
            </RoleExist>
        </div> 
        <TableToolbar nameEN="Coupon" nameAr="كوبون" table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
