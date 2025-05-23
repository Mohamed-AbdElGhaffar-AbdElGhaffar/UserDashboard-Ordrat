'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { PhoneNumberOrder } from '@/data/tan-table-data';
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

export default function AbandonedOrdersTable({ lang = "en",shopId}: { lang?: string;shopId:string }) {
  const [defaultData, setDefaultData] = useState<PhoneNumberOrder[]>([]);
  const { couponData, setCouponData } = useUserContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<PhoneNumberOrder>({
    tableData: defaultData,
    columnConfig: defaultColumns(lang),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 5,
        },
      },
      meta: {},
      enableColumnResizing: false,
    },
  });

  const fetchBranchesData = async () => {
    try {
      const response = await fetch(`https://testapi.ordrat.com/api/Analytics/abandoned-checkouts/phones?shopId=${shopId}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.json();

      const transformedData = data.phoneNumbers.map((branch: any) => ({
        orderCost: branch.orderCost,
        phoneNumber: branch.phoneNumber,
        visitTime: branch.visitTime,
      }));

      setDefaultData(transformedData);
      setData(transformedData);

      console.log('Fetched Data:', transformedData);
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      console.error('Error fetching phone numbers:', error);
    }
  };

  useEffect(() => {
    fetchBranchesData();
  }, [setData, lang]);

  useEffect(() => {
    if (couponData) {
      handleRefreshData();
      setCouponData(false);
    }
  }, [couponData]);

  const handleRefreshData = () => {
    fetchBranchesData();
    toast.success(lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully');
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الطلبات المهجورة' : 'Abandoned Orders Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center gap-6">
          <Button onClick={handleRefreshData} className="w-auto">
            <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" />
            {lang === "en" ? "Update Data" : 'تحديث البيانات'}
          </Button>
          {/* <RoleExist PageRoles={['CreateCoupon']}>
            <AddButton lang={lang} title={lang === "en" ? "Add Coupon" : 'إضافة كوبون'} onSuccess={handleRefreshData} />
          </RoleExist> */}
        </div>
        <TableToolbar nameEN="Abandoned Order" nameAr="طلب مهجور" table={table} lang={lang} />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
