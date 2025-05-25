'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Printer } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import toast from 'react-hot-toast';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import AddButton from '../../printerAddButtom';

export default function PrinterTable({lang = "en", printers, categories}:{lang?:string; printers: Printer[]; categories: any[];}) {
  const shopId = GetCookiesClient('shopId');
  const [defaultData, setDefaultData] = useState<Printer[]>(printers);
  const { printersData, setPrintersData, mainBranch } = useUserContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<Printer>({
    tableData: defaultData,
    columnConfig: defaultColumns(lang, categories),
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

  const fetchPrintersData = async () => {
    try {
      const response = await axiosClient.get(`/api/Printer/GetAllShopPrinters/${mainBranch}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.data;
  
      const transformedData = data.map((printer: any) => ({
        id: printer.id,
        name: printer.name,
        ip: printer.ip,
        branch: printer.branchName,
        totalCategories: printer.categoryPrinterDtos?.length ?? 0,
        categoryPrinterDtos: printer.categoryPrinterDtos || [],
        userName: printer.name,
      }));
  
      setDefaultData(transformedData);
      setData(transformedData);
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching printers:', error);
    }
  };
  
  useEffect(() => {
    fetchPrintersData();
  }, [setData, lang, mainBranch]); 

  useEffect(() => {
    if (printersData == true) {
      handleRefreshData();
      setPrintersData(false);
    }
  }, [printersData]); 

  const handleRefreshData = () => {
    fetchPrintersData();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الطابعات' : 'Printers Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center gap-2 sm:gap-6">
            <RoleExist PageRoles={['sellerDashboard-printer']}>
              <Button onClick={()=>{handleRefreshData(); toast.success(lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully');}} className="w-auto flex justify-end items-center gap-0 sm:gap-1.5 ">
                <PiArrowsClockwiseBold className="h-[17px] w-[17px]" />
                <span className='hidden sm:block'>{lang == "en"?"Update Data":'تحديث البيانات'}</span>
              </Button>
            </RoleExist>
            <RoleExist PageRoles={['CreatePrinter']}>
              <AddButton lang={lang} title={lang == "en"?"Add Printer":'إضافة طابعة'} onSuccess={handleRefreshData} />
            </RoleExist>
        </div>
        <TableToolbar nameEN="printer" nameAr="الطابعة" table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
