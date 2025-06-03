'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { FaPhone } from 'react-icons/fa';
import { Button, Empty, Loader, Text } from 'rizzui';
import usrbig1 from '@public/assets/usrbig1.jpg';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axiosClient from '../context/api';
import Link from 'next/link';
import axios from 'axios';
import { Star, Phone, Send, Calendar } from 'lucide-react';
import { 
  PiBicycle, 
  PiMotorcycle, 
  PiCar, 
  PiVan, 
  PiTruck, 
  PiJeep,
  PiArrowSquareOut
} from 'react-icons/pi';
import RoleExist from '../ui/roleExist/RoleExist';
import { RoleClientExist } from '../ui/roleClientExist/RoleClientExist';
import { GetCookiesClient } from '../ui/getCookiesClient/GetCookiesClient';
import { useUserContext } from '../context/UserContext';
import ActionsCellTables from './actionsCellTables/ActionsCellTables';
import PageHeader from "@/app/shared/page-header";
import TableAddButton from "@/app/shared/tableAddButtom";
import { NextStep, Tour, useNextStep } from "nextstepjs";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { getTablesSteps } from "../ui/steps/steps";
import { FiZap } from "react-icons/fi";
import CustomCard from "../ui/CustomCard/CustomCard";
import TablesForm from "./TablesForm/TablesForm";

interface PageHeaderType {
  title: string;
  breadcrumb: {href?: string; name: string;}[];
}
function getBorderColorClass(status: number) {
  switch (status) {
    case 0:
      return 'border-green-400';
    case 1:
      return 'border-yellow-400';
    case 2:
      return 'border-red-400';
    default:
      return 'border-gray-300';
  }
}

function TablesPage({ lang='en', tables, languages, pageHeader }: { lang?: string; tables: any[]; languages: number; pageHeader:PageHeaderType; }) {
  const tableNumber = 3;
  const [defaultData, setDefaultData] = useState<any[]>(tables);
  const { tablesData, setTablesData, mainBranch } = useUserContext();
  const searchParams = useSearchParams();
  const { startNextStep, currentStep, setCurrentStep, closeNextStep } = useNextStep();
  const { closeModal, openModal } = useModal();

  const addTable = RoleClientExist([
    'sellerDashboard-tables-create',
  ]);
  
  const steps: Tour[] = useMemo(() => {
    const stepsWithIcons = getTablesSteps(lang, defaultData, languages).map((tour) => ({
      ...tour,
      steps: tour.steps.map((step) => ({
        ...step,
        pointerPadding: 10,
        pointerRadius: 8,
      })),
    }));

    return stepsWithIcons;
  }, [lang, defaultData, languages]);

  const fetchTablesData = async () => {
    try {
      const response = await axiosClient.get(`api/Table/GetAllShopTables/${mainBranch}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      const data = await response.data;
      setDefaultData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setTablesData(false);
    }
  };
  
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosClient.get(`api/Table/GetAllShopTables/${mainBranch}`, {
          headers: {
            'Accept-Language': lang,
          },
        });
        const data = response.data;
  
        console.log("Fetched client-side tables:", data);
        console.log("Server-side tables prop:", tables);
  
        // Optional deep comparison if needed
        const areEqual = JSON.stringify(data) === JSON.stringify(tables);
        console.log("Is same data as server:", areEqual);
  
        if (!areEqual) {
          setDefaultData(data);
        }
      } catch (error) {
        console.error('❌ Error fetching client-side tables:', error);
      }
    })();
  }, []);  

  useEffect(() => {
    if (tablesData == true) {
      fetchTablesData();
    }
  }, [tablesData]);
  useEffect(() => {
    if (tablesData == true) {
      fetchTablesData();
    }
  }, [tablesData]);

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setTimeout(() => {
        startNextStep('TablesTour');
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
  return (
    <NextStep
      steps={steps} 
      cardComponent={(props) => <CustomCard 
        {...props} 
        lang={lang} 
        nextStep={()=>{
          if (defaultData.length > 0) {
            if (languages === 0 || languages === 1) {
              if (currentStep == 0) {
                openModal({
                  view: (
                    <TablesForm title={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} lang={lang!} languages={languages}/>
                  ),
                  customSize: '700px',
                })
                setTimeout(() => {
                  setCurrentStep(1);
                }, 200)
              }else if(currentStep == 3 ){
                closeModal();
                setCurrentStep(4);
              }else if(currentStep == 6 ){
                closeNextStep();
              }else {
                setCurrentStep(currentStep + 1);
              }
            }else {
              if (currentStep == 0) {
                openModal({
                  view: (
                    <TablesForm title={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} lang={lang!} languages={languages}/>
                  ),
                  customSize: '700px',
                })
                setTimeout(() => {
                  setCurrentStep(1);
                }, 200)
              }else if(currentStep == 4 ){
                closeModal();
                setCurrentStep(5);
              }else if(currentStep == 7 ){
                closeNextStep();
              }else {
                setCurrentStep(currentStep + 1);
              }
            }
          }else {
            if (languages === 0 || languages === 1) {
              if (currentStep == 0) {
                openModal({
                  view: (
                    <TablesForm title={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} lang={lang!} languages={languages}/>
                  ),
                  customSize: '700px',
                })
                setTimeout(() => {
                  setCurrentStep(1);
                }, 200)
              }else if(currentStep == 3 ){
                closeModal();
                setCurrentStep(4);
              }else if(currentStep == 4 ){
                closeNextStep();
              }else {
                setCurrentStep(currentStep + 1);
              }
            }else {
              if (currentStep == 0) {
                openModal({
                  view: (
                    <TablesForm title={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} lang={lang!} languages={languages}/>
                  ),
                  customSize: '700px',
                })
                setTimeout(() => {
                  setCurrentStep(1);
                }, 200)
              }else if(currentStep == 4 ){
                closeModal();
                setCurrentStep(5);
              }else if(currentStep == 5 ){
                closeNextStep();
              }else {
                setCurrentStep(currentStep + 1);
              }
            }
          }
        }} 
        prevStep={()=>{
          if (languages === 0 || languages === 1) {
            if(currentStep == 1 ){
              setCurrentStep(0);
              closeModal();
            }else if(currentStep == 4) {
              openModal({
                view: (
                  <TablesForm title={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} lang={lang!} languages={languages}/>
                ),
                customSize: '700px',
              })
              setTimeout(() => {
                setCurrentStep(3);
              }, 200)
            }else {
              setCurrentStep(currentStep - 1);
            }
          }else {
            if(currentStep == 1 ){
              setCurrentStep(0);
              closeModal();
            }else if(currentStep == 5) {
              openModal({
                view: (
                  <TablesForm title={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} lang={lang!} languages={languages}/>
                ),
                customSize: '700px',
              })
              setTimeout(() => {
                setCurrentStep(4);
              }, 200)
            }else {
              setCurrentStep(currentStep - 1);
            }
          }
        }}
      />} 
    >
      <div className='px-4'>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} >
          {addTable && (
            <TableAddButton id="add-table-step" className="mt-4 w-full @lg:mt-0 @lg:w-auto" buttonLabel={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} languages={languages} lang={lang}/>
          )}
        </PageHeader>
      </div>
      <div id="view-data-tables">
        <div className="py-6 pt-5">
          <div className="flex gap-6 mb-6">
            <div className="flex flex-col items-center text-sm">
              <div className="w-4 h-4 bg-green-400 rounded-sm mb-1" />
              <span>{lang === 'ar' ? 'متاحة' : 'Available'}</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <div className="w-4 h-4 bg-yellow-400 rounded-sm mb-1" />
              <span>{lang === 'ar' ? 'مشغولة' : 'Occupied'}</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <div className="w-4 h-4 bg-red-400 rounded-sm mb-1" />
              <span>{lang === 'ar' ? 'محجوزة' : 'Reserved'}</span>
            </div>
          </div>
          {tablesData == true?
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
            </div>
            :
            <>
              {defaultData.length == 0 ?
                <div className="py-5 text-center lg:py-8">
                  <Empty /> <Text className="mt-3">{lang === 'ar' ? 'لا توجد طاولات' : 'No Tables'}</Text>
                </div>
                :
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 gap-6">
                  {defaultData.map((table, index) => {
                    // console.log("table: ",table);
                    
                    return (
                      <div
                        key={table.id}
                        className='flex flex-col gap-2 bg-white py-4 px-2 rounded-[20px] transition-colors hover:bg-[#f5f5f5]'
                      >
                        <div className='flex justify-center items-center px-6 gap-2 w-full'>
                          {[...Array(table.count ?? tableNumber)].map((_, i) => (
                            <div
                              key={i}
                              className='bg-gray-300 h-4 rounded-[100vh]'
                              style={{
                                width: `${100 / (table.count ?? tableNumber)}%`,
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className={`w-full p-2 rounded-[2rem] border-8 ${getBorderColorClass(table.tableStatus)} flex flex-col justify-center items-center gap-2`}>
                          <h2 className='text-lg font-bold'>T{table.tableNumber}</h2>
                          <p className='truncate w-full text-center'>{lang == 'ar'? table.descriptionAr : table.descriptionEn}</p>
                          <ActionsCellTables data={table} lang={lang} languages={languages}/>
                        </div>
                        <div className='flex justify-center items-center gap-2 px-6 w-full'>
                          {[...Array(table.count ?? tableNumber)].map((_, i) => (
                            <div
                              key={i}
                              className='bg-gray-300 h-4 rounded-[100vh]'
                              style={{
                                width: `${100 / (table.count ?? tableNumber)}%`,
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              }
            </>
          }
        </div>
      </div>
    </NextStep>
  );
}

export default TablesPage;