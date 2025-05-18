'use client';

import React, { useEffect, useState } from 'react';
import { defaultColumns } from './column';
import MainTable from '@/app/shared/table/main-table';
import WidgetCard from '@components/cards/widget-card';
import { Product } from '@/data/tan-table-data';
import TablePagination from '@/app/shared/table/table-pagination';
import { useTanStackTable } from '@/app/shared/tan-table/custom-table-components/use-TanStack-Table';

import { Button } from 'rizzui';
import { PiArrowsClockwiseBold, PiPlusBold } from 'react-icons/pi';
import TableToolbarFilter from '../table-toolbar-filter';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import ProductAddButton from '../productButtom';
import Link from 'next/link';
import toast from 'react-hot-toast';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
const shopId = GetCookiesClient('shopId');

export default function ProductTable({lang = "en", products}:{lang?:string; products: Product[];}) {

  const [inputName, setInputName] = useState('');

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(5);

  const options = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];

  const [defaultData, setDefaultData] = useState<Product[]>(products);
  const { productData, setProductData } = useUserContext();
  
  const { table, setData } = useTanStackTable<Product>({
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

  const fetchProduct = async () => {
    const queryParams = new URLSearchParams({
      // name: inputName,
      PageNumber: (pageIndex + 1).toString(),
      PageSize: pageSize.toString(),
    });
  
    try {
      let response;
      if (inputName.trim()) {
        response = await axiosClient.get(
          `/api/Products/SearchByName/${shopId}?SearchParamter=${encodeURIComponent(inputName)}&PageNumber=${pageIndex + 1}&PageSize=${pageSize}`,
          {
            headers: {
              Accept: "*/*",
              "Accept-Language": lang,
            },
          }
        );
      } else {
        const queryParams = new URLSearchParams({
          PageNumber: (pageIndex + 1).toString(),
          PageSize: pageSize.toString(),
        });
        response = await axiosClient.get(
          `/api/Products/GetAll/${shopId}?${queryParams}`,
          {
            headers: {
              Accept: "*/*",
              "Accept-Language": lang,
            },
          }
        );
      }
      const result = response.data;
      console.log("result: ",result);
      
      const transformedData = result.entities.map((item: any) => ({
        id: item.id,
        name: lang=='ar'? item.nameAr : item.nameEn || '----',
        categoryName: lang=='ar'? item.categoryNameAr : item.categoryNameEn || '----',
        oldPrice: `${item.oldPrice}` || 'NaN',
        price: `${item.finalPrice}` || 'NaN',
        status: item.isActive? lang === 'ar'
        ? `نشط`
        : `Active`:lang === 'ar'
        ? `غير نشط`
        : `Not Active`,
        isActive: item.isActive? `Active`:`Inactive`,
        isTopSelling: item.isTopSelling
        ? lang === 'ar' ? 'نعم' : 'Yes'
        : lang === 'ar' ? 'لا' : 'No',
      isTopRated: item.isTopRated
        ? lang === 'ar' ? 'نعم' : 'Yes'
        : lang === 'ar' ? 'لا' : 'No',
        numberOfSales: `${item.numberOfSales || 0}` || '----',
        userName: lang=='ar'? item.nameAr : item.nameEn || '----',
        description: lang=='ar'? item.descriptionAr : item.descriptionEn || '----',
        imageUrl: item.images.length > 0 ? item.images[0].imageUrl : 'https://via.placeholder.com/150',
        createdAt: item.createdAt,
        lastUpdatedAt: item.lastUpdatedAt,
        stocks: item.stocks || [],
      }));
      console.log("transformedData: ",transformedData);
      
      setDefaultData(transformedData);
      setData(transformedData);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };  

  // useEffect(() => {
  //   fetchProduct();
  // }, [setData, lang]); 

  useEffect(() => {
    if (productData == true) {
      handleRefreshData();
      setProductData(false);
    }
  }, [productData]); 

  const handleRefreshData = () => {
    fetchProduct();
  };

  return (
    <>
      <WidgetCard title={lang === 'ar' ? 'جدول المنتجات' : 'Products Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center gap-2 sm:gap-6">
            <Button onClick={()=>{handleRefreshData(); toast.success(lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully');}} className="">
              <PiArrowsClockwiseBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
              <span className='hidden sm:block'>{lang == "en"?"Update Data":'تحديث البيانات'}</span>
            </Button>
            <RoleExist PageRoles={['sellerDashboard-storeProducts-products-create']}>
              <Button className="p-0">
                <Link href={`/${lang}/storeProducts/products/create`} className='flex py-2 px-4' >
                  <PiPlusBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
                  <span className='hidden sm:block'>{lang === 'ar' ? "إضافة المنتج" : "Add Product"}</span>
                </Link>
              </Button>
            </RoleExist>
            {/* <ProductAddButton lang={lang} buttonLabel={lang === 'ar' ? "إضافة المنتج" : "Add Product"}  onSuccess={handleRefreshData} />  */}
        </div>
        <TableToolbarFilter
          nameEN="Product" 
          nameAr="المنتج" 
          table={table}
          lang={lang}
          search={inputName}
          setSearch={setInputName}
          filters={[]}
          onSuccess={()=>setProductData(true)}
        />
        <MainTable table={table} variant={'modern'} lang={lang} />
        <TablePagination options={options} table={table} lang={lang} pageIndex={pageIndex} totalPages={totalPages} setPageIndex={setPageIndex} setPageSize={setPageSize} setUpdate={setProductData} />
      </WidgetCard>
    </>
  );
}
