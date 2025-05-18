'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPhone } from 'react-icons/fa';
import { Button, Empty, Loader, Text } from 'rizzui';
import usrbig1 from '@public/assets/usrbig1.jpg';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axiosClient from '../context/api';
import { useSearchParams } from 'next/navigation';
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

function TablesPage({ lang='en', tables, languages }: { lang?: string; tables: any[]; languages: number;}) {
  const tableNumber = 3;
  const [defaultData, setDefaultData] = useState<any[]>(tables);
  const { tablesData, setTablesData, mainBranch } = useUserContext();
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
    if (tablesData == true) {
      fetchTablesData();
    }
  }, [tablesData]);

  return (
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
  );
}

export default TablesPage;