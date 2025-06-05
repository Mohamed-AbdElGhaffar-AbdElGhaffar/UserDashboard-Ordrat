'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import AddButton from '../../categoryAddButtom';
import toast from 'react-hot-toast';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import { NextStep, Tour, useNextStep } from 'nextstepjs';
import { FiZap } from 'react-icons/fi';
import { getCategorySteps } from '@/app/components/ui/steps/steps';
import CustomCard from '@/app/components/ui/CustomCard/CustomCard';
import { useModal } from '../../modal-views/use-modal';
import CategoryTableForm from '@/app/components/tables/category/categoryTableForm/categoryTableForm';

const shopId = GetCookiesClient('shopId');

export default function CategoriesTable({lang = "en", languages, categories}:{lang?:string; languages: number; categories: Categories[]; }) {
  const [defaultData, setDefaultData] = useState<Categories[]>(categories);
  const { categoriesData, setCategoriesData } = useUserContext();
  const { setGuard } = useGuardContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startNextStep, currentStep, setCurrentStep, closeNextStep } = useNextStep();
  const { closeModal, openModal } = useModal();
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

  useEffect(() => {
    fetchCategoriesData();
  }, [setData, lang]); 

  useEffect(() => {
    if (categoriesData == true) {
      handleRefreshData();
      setCategoriesData(false);
    }
  }, [categoriesData]); 

  const steps: Tour[] = useMemo(() => {
    const stepsWithIcons = getCategorySteps(lang).map((tour) => ({
      ...tour,
      steps: tour.steps.map((step) => ({
        ...step,
        icon: <FiZap />,
        pointerPadding: 10,
        pointerRadius: 8,
      })),
    }));

    return stepsWithIcons;
  }, [lang]);

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setTimeout(() => {
        startNextStep('categoryTour');
      }, 300);
    }
  }, [searchParams, startNextStep]);
  
  useEffect(() => {
    const overlay = document.querySelector('[data-name="nextstep-overlay"]');
    if (overlay) {
      overlay.setAttribute('lang', 'en');
      overlay.setAttribute('dir', 'ltr');
    }
  
    const observer = new MutationObserver(() => {
      const updatedOverlay = document.querySelector('[data-name="nextstep-overlay"]');
      if (updatedOverlay) {
        updatedOverlay.setAttribute('lang', 'en');
        updatedOverlay.setAttribute('dir', 'ltr');
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  
    return () => observer.disconnect();
  }, []);

  const handleRefreshData = () => {
    fetchCategoriesData();
  };

  return (
    <NextStep 
      steps={steps} 
      cardComponent={(props) => 
        <CustomCard 
          {...props} 
          nextStep={()=>{
            if (currentStep == 0) {
              openModal({
                view: (
                  <CategoryTableForm lang={lang!} title={lang == "en"?"Add Category":'إضافة قسم'} onSuccess={handleRefreshData} languages={languages}/>
                ),
                customSize: '700px',
              });
              setTimeout(() => {
                setCurrentStep(1);
              }, 200)
            }else if(currentStep == 1 && languages == 1 ){
              setCurrentStep(3);
            }else if(currentStep == 2 && languages == 0 ){
              setCurrentStep(4);
            }else if(currentStep == 8 ){
              closeModal()
              setCurrentStep(9);
            }else if(currentStep == 10 ){
              closeNextStep();
            }
            // else if (currentStep === 11) {
            //   const el = document.querySelector('.custom-scrollbar');
            //   if (el) {
            //     el.scrollIntoView({ behavior: 'smooth', block: 'end' });
            //     setCurrentStep(12);
            //   } else {
            //     setCurrentStep(12);
            //   }
            // }else if(currentStep == 13 ){
            //   closeNextStep();
            // }
            else {
              setCurrentStep(currentStep + 1);
            }
          }} 
          prevStep={()=>{
            if(currentStep == 1 ){
              setCurrentStep(0);
              closeModal();
            }else if(currentStep == 3 && languages == 1 ){
              setCurrentStep(1);
            }else if(currentStep == 4 && languages == 0 ){
              setCurrentStep(2);
            }else if(currentStep == 9){
              openModal({
                view: (
                  <CategoryTableForm lang={lang!} title={lang == "en"?"Add Category":'إضافة قسم'} onSuccess={handleRefreshData} languages={languages}/>
                ),
                customSize: '700px',
              });
              setTimeout(() => {
                setCurrentStep(8);
              }, 200)
            }else {
              setCurrentStep(currentStep - 1);
            }
          }}
          lang={lang} 
        />
      }
      onStepChange={(step, tourName) => {
        if (step === 0) {
          closeModal();
        }
        console.log(`Step changed to ${step} in ${tourName}`);
      }}
    >
      <WidgetCard title={lang === 'ar' ? 'جدول الأقسام' : 'Categories Table'} className="flex flex-col gap-4">
        <div className="flex justify-end items-center gap-2 sm:gap-6">
            <Button id='update-data-category' onClick={()=>{handleRefreshData(); toast.success(lang === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Data updated successfully');}} className="w-auto">
              <PiArrowsClockwiseBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
              <span className='hidden sm:block'>{lang == "en"?"Update Data":'تحديث البيانات'}</span>
            </Button>
            <RoleExist PageRoles={['CreateCategory']}>
              <AddButton lang={lang} title={lang == "en"?"Add Category":'إضافة قسم'} onSuccess={handleRefreshData} languages={languages}/>
            </RoleExist>
        </div>
        <div id='view-data-category' className='flex flex-col gap-4'>
          <TableToolbar nameEN="Category" nameAr="القسم" table={table}  lang={lang}/>
          <MainTable table={table} variant={'modern'} lang={lang} />
          <TablePagination table={table} lang={lang} />
        </div>
      </WidgetCard>
    </NextStep>
  );
}
