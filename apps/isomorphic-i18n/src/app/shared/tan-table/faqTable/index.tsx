'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import TableToolbar from '@/app/shared/tan-table/table-toolbar';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Faq } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';
import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import FaqsAddButton from '../../faqAddButtom';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import toast from 'react-hot-toast';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
const shopId = GetCookiesClient('shopId');

export default function FaqTable({lang = "en", languages, shopFAQs}:{lang?:string; languages: number; shopFAQs: Faq[];}) {
  const [defaultData, setDefaultData] = useState<Faq[]>(shopFAQs);
  const { updateFaq, setUpdateFaq } = useUserContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();

  const { table, setData } = useTanStackTable<Faq>({
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
      },
      meta: {
      },
      enableColumnResizing: false,
    },
  });

  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/api/FAQCategory/GetShopFAQs/${shopId}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
  
      const data = response.data;

      const transformedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        title: item.title,
        userName: item.name,
        metaDescription: item.metaDescription,
        image: item.imageUrl,
        faqNumber: item.faQs.length,
        faQs: item.faQs,
      }));

      setDefaultData(transformedData);
      setData(transformedData);
    } catch (error) {
      setGuard(false);
      localStorage.clear();
      router.push(`/${lang}/signin`);
      console.error('Error fetching faq:', error);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [setData, lang]); 

  useEffect(() => {
    if (updateFaq == true) {
      handleRefreshData();
      setUpdateFaq(false);
    }
  }, [updateFaq]); 

  const handleRefreshData = () => {
    fetchData();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الأسئلة الشائعة' : 'FAQ Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center gap-2 sm:gap-6">
            <Button onClick={()=>{handleRefreshData(); toast.success(lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully');}} className="w-auto">
              <PiArrowsClockwiseBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
              <span className='hidden sm:block'>{lang == "en"?"Update Data":'تحديث البيانات'}</span>
            </Button>
            <RoleExist PageRoles={['CreateFAQCategory']}>
              <FaqsAddButton lang={lang} buttonLabel={lang === 'ar' ? "إضافة قسم الأسئلة" : "Add Faq Category"}  onSuccess={handleRefreshData} languages={languages} /> 
            </RoleExist>
        </div>
        <TableToolbar nameEN="faq category" nameAr="قسم الأسئلة" table={table}  lang={lang}/>
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination table={table} lang={lang} select={false} />
      </WidgetCard>
    </>
  );
}
