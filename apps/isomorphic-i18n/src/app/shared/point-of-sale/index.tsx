'use client';

import POSProductCategory from '@/app/shared/point-of-sale/pos-product-category';
import POSProductsFeed from '@/app/shared/point-of-sale/pos-product-feed';
import PostSidebar from './pos-sidebar';
import { useCart } from '@/store/quick-cart/cart.context';
import cn from '@utils/class-names';
import { useUserContext } from '@/app/components/context/UserContext';
import { useEffect, useState } from 'react';
import axiosClient from '@/app/components/context/api';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
// import { useCart } from '../../../../../isomorphic/src/store/quick-cart/cart.context';

export default function POSPageView({ lang = 'en', filterOptions, tables, branchOption, allDatatables, languages, branchZones, freeShppingTarget, currencyAbbreviation, defaultUser, shopData }:{ lang: string; filterOptions: { id: string; name: string; value: string; icon: any; }[]; 
  tables: { value: string; label: string }[]; branchOption: any[]; allDatatables: any[]; languages: number; branchZones: { id:string; lat: number; lng: number; zoonRadius: number }[]; freeShppingTarget: number; currencyAbbreviation: string; defaultUser: string; shopData: any;}) {
  const { items, removeItemFromCart, clearItemFromCart, addItemToCart } = useCart();
  const [defaultData, setDefaultData] = useState<any[]>(allDatatables);
  const [shopGateways, setShopGateways] = useState<any[]>([]);
  const { posTableOrderId, setPOSTableOrderId, tablesData, setTablesData, mainBranch } = useUserContext();
  const shopId = GetCookiesClient('shopId') as string;
  
  const fetchShopPaymentGatewayData = async () => {
    try {
      const response = await axiosClient.get(`/api/ShopPaymentGateway/GetByShopId/${shopId}`, {
        headers: {
          'Accept-Language': lang,
        },
      });
      console.log("ShopPaymentGateway: ",response.data);
      
      setShopGateways(response.data);
    } catch (error) {
      console.error('Error loading shop gateways:', error);
      setShopGateways([]);
    }
  };
  useEffect(() => {
    const localPOSTableOrderId = localStorage.getItem('posTableOrderId');
    const posTableOrderIdLocal = localPOSTableOrderId ? JSON.parse(localPOSTableOrderId) : null;
    if (posTableOrderId != posTableOrderIdLocal) {
      setPOSTableOrderId(posTableOrderIdLocal);
    }
    fetchShopPaymentGatewayData();
  }, [lang]);
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
        console.log("Server-side tables prop:", allDatatables);
  
        // Optional deep comparison if needed
        const areEqual = JSON.stringify(data) === JSON.stringify(allDatatables);
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
  return (
    <div className="grid grid-cols-12 gap-6 pb-10 @container xl:min-h-[745px]">
      <div
        className={cn(
          'col-span-full',
          'xl:col-span-8 2xl:col-span-9'
          // !!items?.length && 'xl:col-span-8 2xl:col-span-9'
        )}
      >
        <div className="relative mb-6 flex items-center justify-between gap-3">
          <POSProductCategory lang={lang} filterOptions={filterOptions}/>
        </div>
        <POSProductsFeed lang={lang} filterOptions={filterOptions} currencyAbbreviation={currencyAbbreviation}/>
      </div>
      {/* {!!items?.length && ( */}
        <aside className="sticky bg-white hidden self-start rounded-lg border border-muted xl:top-24 xl:col-span-4 xl:block 2xl:top-[98px] 2xl:col-span-3">
          <PostSidebar
            removeItemFromCart={removeItemFromCart}
            clearItemFromCart={clearItemFromCart}
            orderedItems={items}
            simpleBarClassName="pe-3 xl:pe-7 bg-white"
            lang={lang}
            defaultUser={defaultUser}
            tables={tables}
            branchOption={branchOption}
            allDatatables={defaultData}
            languages={languages}
            branchZones={branchZones}
            freeShppingTarget={freeShppingTarget}
            shopData={shopData}
            currencyAbbreviation={currencyAbbreviation}
            shopGateways={shopGateways}
          />
        </aside>
      {/* )} */}
    </div>
  );
}
