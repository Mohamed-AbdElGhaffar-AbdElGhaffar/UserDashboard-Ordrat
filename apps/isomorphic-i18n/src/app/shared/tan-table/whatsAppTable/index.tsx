'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { whatsApp } from '@/data/tan-table-data';
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
const shopId = GetCookiesClient('shopId');

export default function WhatsAppTable({lang = "en"}:{lang?:string;}) {
  const nothing = lang=='ar'?'لا يوجد':'nothing';
  const [defaultData, setDefaultData] = useState<whatsApp[]>([]);
  const { whatsAppData, setWhatsAppData } = useUserContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<whatsApp>({
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

  const fetchwhatsAppData = async () => {
    try {
      const response = await axiosClient.get(`/api/WhatsappMessage/GetWhatsappMessagesByshopId/${shopId}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.data;

      const transformedData = data.map((whatsApp: any) => ({
        id: whatsApp.id,
        name: whatsApp.name || nothing,
        phoneNumber: whatsApp.phoneNumber || nothing,
        massage: whatsApp.text || nothing,
        sendingTime: whatsApp.sendingTime,
      }));

      setDefaultData(transformedData);
      setData(transformedData);
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching whatsAppData:', error);
    }
  };

  useEffect(() => {
    fetchwhatsAppData();
  }, [setData, lang]); 

  useEffect(() => {
    if (whatsAppData == true) {
      handleRefreshData();
      setWhatsAppData(false);
    }
  }, [whatsAppData]); 

  const handleRefreshData = () => {
    fetchwhatsAppData();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول رسائل الواتساب' : 'WhatsApp Massages Table'} className="flex flex-col gap-4" titleClassName='text-[#e11d48] text-lg md:text-xl font-semibold'>
        <TableToolbar nameEN="Phone Number" nameAr="رقم الهاتف" table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
