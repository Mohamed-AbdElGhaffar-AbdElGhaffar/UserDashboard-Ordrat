'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Categories } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import AddButton from '../../categoryAddButtom';
import toast from 'react-hot-toast';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';

const shopId = GetCookiesClient('shopId');

export default function CategoriesTable({lang = "en", languages, categories}:{lang?:string; languages: number; categories: Categories[]; }) {
  const [defaultData, setDefaultData] = useState<Categories[]>(categories);
  const { categoriesData, setCategoriesData } = useUserContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const { table, setData } = useTanStackTable<Categories>({
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

  const fetchCategoriesData = async () => {
    try {
      const response = await axiosClient.get(`api/Category/GetAll/${shopId}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.data;

      const transformedData = data.map((category: any) => ({
        id: category.id,
        name: category.name,
        userName: category.name,
        bannerUrl: category.bannerUrl,
        status:
          category.isActive? lang === 'ar'
            ? `نشط`
            : `Active`:lang === 'ar'
            ? `غير نشط`
            : `Not Active`,
        isActive: category.isActive? `Active`:`Inactive`,
        priority: category.priority,
        numberOfColumns: lang === 'ar'? `الشكل ${ category.numberOfColumns}`
        : `Design ${ category.numberOfColumns}`,
        numberOfProducts: category.numberOfProducts,
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
  //   fetchCategoriesData();
  // }, [setData, lang]); 

  useEffect(() => {
    if (categoriesData == true) {
      handleRefreshData();
      setCategoriesData(false);
    }
  }, [categoriesData]); 

  const handleRefreshData = () => {
    fetchCategoriesData();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الأقسام' : 'Categories Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center gap-2 sm:gap-6">
            <Button onClick={()=>{handleRefreshData(); toast.success(lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully');}} className="w-auto">
              <PiArrowsClockwiseBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
              <span className='hidden sm:block'>{lang == "en"?"Update Data":'تحديث البيانات'}</span>
            </Button>
            <RoleExist PageRoles={['CreateCategory']}>
              <AddButton lang={lang} title={lang == "en"?"Add Category":'إضافة قسم'} onSuccess={handleRefreshData} languages={languages}/>
            </RoleExist>
        </div>
        <TableToolbar nameEN="Category" nameAr="القسم" table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} />
      </WidgetCard>
    </>
  );
}
