'use client';

import { useModal } from '@/app/shared/modal-views/use-modal';
import React, { useEffect, useState } from 'react';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import { useUserContext } from '../../context/UserContext';
import axiosClient from '../../context/api';
import ActionsCellTables from '../../tablesPage/actionsCellTables/ActionsCellTables';
import { Empty, Loader, Text } from 'rizzui';
import ActionsPosTables from './ActionsPosTables';
// import { GetCookiesClient } from '../ui/getCookiesClient/GetCookiesClient';
// import { useUserContext } from '../context/UserContext';
// import ActionsCellTables from './actionsCellTables/ActionsCellTables';
import { CartItem, CartItem as Item } from '@/types';
import { API_BASE_URL } from '@/config/base-url';

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

function TablesPosData({ lang='en', tables, languages, items, clearItemFromCart, addItemToCart }: { lang?: string; tables: any[]; languages: number; items: Item[]; clearItemFromCart: (id: number | string) => void; addItemToCart: (item: Item, quantity: number) => void;} ) {
  const shopId = GetCookiesClient('shopId');
  const { closeModal } = useModal();  
  const tableNumber = 3;
  const [defaultData, setDefaultData] = useState<any[]>(tables);
  const { tablesData, setTablesData, setPOSTableOrderId, mainBranch } = useUserContext();
  return <>
    <div className="py-0 pt-0">
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
        <div className="flex items-center justify-center min-h-[180px]">
          <Loader className="animate-spin text-[#e11d48]" width={60} height={60} />
        </div>
        :
        <>
          {defaultData.length == 0?
            <div className="py-5 text-center lg:py-8">
              <Empty /> <Text className="mt-3">{lang === 'ar' ? 'لا توجد طاولات' : 'No Tables'}</Text>
            </div>
            :
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 4xl:grid-cols-4 gap-0">
              {defaultData.map((table, index) => {
                // console.log("table: ",table);
                
                return (
                  <div
                    key={table.id}
                    className='flex flex-col gap-2 bg-white py-4 px-2 rounded-[20px] transition-colors hover:bg-[#f5f5f5] cursor-pointer'
                    onClick={async ()=>{
                      items.forEach(item => clearItemFromCart(item.id));
                      setPOSTableOrderId(table);
                      localStorage.setItem('posTableOrderId', JSON.stringify(table));
                      if(table.tableStatus == 1){
                        const cartItems: CartItem[] = table.order.items.map((item: any) => {
                          if (!item.cancelled) {
                            const variationsString = item.orderItemVariations.map((variation: any) => {
                              if (variation.choices[0].choiceId) {
                                const selectedChoice = variation.choices[0];
                                return `variations[${variation.variationId}].id:${variation.variationId}&&variations[${variation.variationId}].nameEn:${variation.variationNameEn}&&variations[${variation.variationId}].nameAr:${variation.variationNameAr}&&variations[${variation.variationId}].choiceId:${selectedChoice?.choiceId}&&variations[${variation.variationId}].choiceValueEn:${selectedChoice?.choiceNameEn || ""}&&variations[${variation.variationId}].choiceValueAr:${selectedChoice?.choiceNameAr || ""}`;
                              } else {
                                return `variations[${variation.variationId}].id:${variation.variationId}&&variations[${variation.variationId}].nameEn:${variation.variationNameEn}&&variations[${variation.variationId}].nameAr:${variation.variationNameAr}&&variations[${variation.variationId}].inputValue:${ variation.choices[0].inputValue || ""}`;
                              }
                            }).join('&&');
                        
                            const cartItem: CartItem = {
                              id: `id:${item.product.id}&&nameAr:${item.product.nameAr}&&nameEn:${item.product.nameEn}&&descriptionEn:${item.product.descriptionEn}&&descriptionAr:${item.product.descriptionAr}&&metaDescriptionEn:${item.product.metaDescriptionEn}&&metaDescriptionAr:${item.product.metaDescriptionAr}&&${variationsString}`,
                              name: lang=='ar'?item.product.nameAr:item.product.nameEn || "Default Item",
                              description: lang=='ar'?item.product.descriptionAr:item.product.descriptionEn,
                              image: item.product.images[0].imageUrl || "",
                              price: (item.itemPrice + item.totalChoicesPrice) || 0,
                              oldPrice: (item.originalPrice + item.totalChoicesPrice) || 0,
                              quantity: item.quantity,
                              notes: "",
                              orderItemVariations: item.orderItemVariations.map((variation: any) => {
                                if (variation.choices[0].choiceId) {
                                  const selectedChoice = variation.choices[0];
                                  return {
                                    variationId: variation.variationId,
                                    variationLable: lang=='ar'?variation.variationNameAr:variation.variationNameEn,
                                    choices: [
                                      {
                                        choiceId: variation.choices[0].choiceId || "",
                                        choiceValue: lang=='ar'?variation.choices[0].choiceNameAr:variation.choices[0].choiceNameEn || "",
                                      },
                                    ],
                                  };
                                } else {
                                  return {
                                    variationId: variation.variationId,
                                    variationLable: lang=='ar'?variation.variationNameAr:variation.variationNameEn,
                                    choices: [
                                      {
                                        inputValue: variation.choices[0].inputValue || "",
                                      },
                                    ],
                                  };
                                }
                              }),
                            };

                            addItemToCart(cartItem, item.quantity);
                          }
                        })
                      }
                      closeModal();
                    }}
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
                    <div className={`w-full p-2 rounded-[1rem] border-8 ${getBorderColorClass(table.tableStatus)} flex flex-col justify-center items-center gap-2`}>
                      <h2 className='text-lg font-bold'>T{table.tableNumber}</h2>
                      <p className='truncate w-full text-center'>{lang == 'ar'? table.descriptionAr : table.descriptionEn}</p>
                      {/* <ActionsPosTables data={table} lang={lang} languages={languages} items={items} clearItemFromCart={clearItemFromCart}/> */}
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
                )})}
            </div>
          }
        </>
      }
    </div>
  </>;
}

export default TablesPosData;