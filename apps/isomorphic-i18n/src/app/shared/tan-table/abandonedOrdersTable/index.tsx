'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import TableToolbarFilter from '../table-toolbar-filter';
import TableToolbarFilterAccounts from '../table-toolbar-filter-AbandonedOrders';
import { API_BASE_URL } from '@/config/base-url';
import { PhoneNumberOrder } from '@/data/tan-table-data';
import { useUserContext } from '@/app/components/context/UserContext';
import TableToolbarFilterAbandonedOrders from '../table-toolbar-filter-AbandonedOrders';
import Link from 'next/link';

export default function AbandonedOrdersTable1({ lang = "en",shopId,currencyAbbreviation}: { lang?: string;shopId:string;currencyAbbreviation:string }) {

  const [inputFromTo, setInputFromTo] = useState<string[]>(['', '']);
  const [accountIdSelectedValue, setAccountIdSelectedValue] = useState<string>('');
  const [isApprovedSelectedValue, setIsApprovedSelectedValue] = useState<string>('');
  const [isPaidSelectedValue, setIsPaidSelectedValue] = useState<string>('');
  const [transactionTypeSelectedValue, setTransactionTypeSelectedValue] = useState<string>('');
  const [stockTypeIdSelectedValue, setStockTypeIdSelectedValue] = useState<string>('');
  const [toFromDate, setToFromDate] = useState<[Date | null, Date | null]>([null, null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const { couponData, setCouponData } = useUserContext();
  
  const [totalPages, setTotalPages] = useState(5);
  // const totalPages = 5;

  const options = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];
  console.log("pageIndex: ",pageIndex);
  console.log("filter data: ",{

    "inputFromTo":inputFromTo,
    "accountIdSelectedValue":accountIdSelectedValue,
    "transactionTypeSelectedValue":transactionTypeSelectedValue,
    "toFromDate":toFromDate,
  });

  const [defaultData, setDefaultData] = useState<PhoneNumberOrder[]>([]);
    
  const { table, setData } = useTanStackTable<PhoneNumberOrder>({
    tableData: defaultData,
  columnConfig: defaultColumns(lang, currencyAbbreviation),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 5,
        },
      },
      filterFns: {
        activatedFilter: (row, columnId, value) => {
          if (!value) return false;
          let status =
            row.original[columnId].toLowerCase() === value.toLowerCase()
              ? true
              : false;
          return status;
        },
        priceFilter: (row, columnId, value) => {
          if (!value) return false;
          console.log('custom filter conditions', row, columnId, value);
          return true;
        },
        createdDate: (row, columnId, value) => {
          if (!value) return false;
          console.log('custom filter conditions', row, columnId, value);
          return true;
        },
        dueDate: (row, columnId, value) => {
          if (!value) return false;
          console.log('custom filter conditions', row, columnId, value);
          return true;
        },
      },
      meta: {
      },
      enableColumnResizing: false,
    },
  });

  const formatDate = (date: Date | null): string => {
    return date ? date.toISOString().split('T')[0] : '';
  };

function formatToEgyptTimeString(date: Date, type: 'start' | 'end') {
  const target = new Date(date);

  if (type === 'start') {
    target.setDate(target.getDate() - 1); 
    target.setHours(23, 59, 0, 0);
  } else if (type === 'end') {
    target.setHours(23, 59, 59, 999);
  }

  // توليد التاريخ بصيغة YYYY-MM-DDTHH:mm:ss بدون UTC
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  const hours = String(target.getHours()).padStart(2, '0');
  const minutes = String(target.getMinutes()).padStart(2, '0');
  const seconds = String(target.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

  const fetchReviews = async () => {

const queryParams = new URLSearchParams();

  if (toFromDate[0] && toFromDate[1]) {
    queryParams.append('startDate', formatToEgyptTimeString(toFromDate[0]!, 'start'));
    queryParams.append('endDate', formatToEgyptTimeString(toFromDate[1]!, 'end'));
  }
    try {
      const response = await fetch(`https://testapi.ordrat.com/api/Analytics/abandoned-checkouts/phones?shopId=${shopId}&${queryParams}`, {
        method: 'GET',
        headers: {
          Accept: '*/*',
          'Accept-Language': lang,
        },
      });
  
      if (response.ok) {
        const result = await response.json();
  
        // Transforming API data to match `defaultData` structure
      const transformedData = result.phoneNumbers.map((phone: any) => ({
          orderCost: phone.orderCost,
          phoneNumber: phone.phoneNumber,
          visitTime: phone.visitTime,
          startDate: phone.startDate,
          endDate: phone.endDate,
          currencyAbbreviation,
          userName:''
        }));
  console.log('currencyAbbreviation',currencyAbbreviation);
  
        setDefaultData(transformedData);
        setData(transformedData);
        setTotalPages(result.totalPages);
      } else {
        console.error('Failed to fetch reviews:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };  

  useEffect(() => {
    fetchReviews();
  }, [setData, lang]); 

  useEffect(() => {
    if (couponData == true) {
      handleRefreshData();
      setCouponData(false)
    }
  }, [couponData]); 

  const handleRefreshData = () => {
    fetchReviews();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول الطلبات المهجورة' : 'Abandoned Orders Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center">
            {/* <AddAccountsButton lang={lang} title={lang == "en"?"Add Admin Assistant":' اضافة مساعد ادمن'} buttonLabel={lang == "en"?"Add Admin Assistant":' اضافة مساعد ادمن'} modalBtnLabel={lang == "en"?"Add Admin Assistant":' اضافة مساعد ادمن'} onSuccess={handleRefreshData} /> */}
          <Link href={`/${lang}/marketingtools/whatsapp`}>
            <Button onClick={handleRefreshData} className="w-auto">
              {/* <PiArrowsClockwiseBold className="me-1.5 h-[17px] w-[17px]" /> */}
              {lang == "en"?"Launch Your WhatsApp Ad Campaign":'أطلق حملتك الإعلانية على واتساب'}
            </Button>
          </Link>
        </div>
        <TableToolbarFilterAbandonedOrders 
          nameEN="Phone Number" 
          nameAr="رقم الهاتف" 
          table={table}  
          lang={lang}
          inputFromTo={inputFromTo}
          setInputFromTo={setInputFromTo}
          accountIdSelectedValue={accountIdSelectedValue}
          setAccountIdSelectedValue={setAccountIdSelectedValue}
          isApprovedSelectedValue={isApprovedSelectedValue}
          setIsApprovedSelectedValue={setIsApprovedSelectedValue}
          isPaidSelectedValue={isPaidSelectedValue}
          setIsPaidSelectedValue={setIsPaidSelectedValue}
          stockTypeIdSelectedValue={stockTypeIdSelectedValue}
          setStockTypeIdSelectedValue={setStockTypeIdSelectedValue}
          transactionTypeSelectedValue={transactionTypeSelectedValue}
          setTransactionTypeSelectedValue={setTransactionTypeSelectedValue}
          toFromDate={toFromDate}
          setToFromDate={setToFromDate}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setCouponData} />
      </WidgetCard> 
    </>
  );
}
