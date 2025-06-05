'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/store/quick-cart/cart.context';
import FloatingCartButton from '@/app/shared/floating-cart-button';
import POSDrawerView from '@/app/shared/point-of-sale/pos-drawer-view';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
// import { useCart } from '../../../../../isomorphic/src/store/quick-cart/cart.context';
const Drawer = dynamic(() => import('rizzui').then((module) => module.Drawer), {
  ssr: false,
});

type PosDrawerProps = {
  className?: string;
  lang?: string;
  tables: { value: string; label: string }[];
  branchOption: any[];
  allDatatables: any[];
  languages: number;
  branchZones: { id:string; lat: number; lng: number; zoonRadius: number }[]; 
  freeShppingTarget: number;
  defaultUser: string;
  shopData: any;
  currencyAbbreviation: string;
};

export default function POSDrawer({ className, lang, tables, branchOption, allDatatables, languages, branchZones, freeShppingTarget, defaultUser, shopData,currencyAbbreviation }: PosDrawerProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { totalItems, items, removeItemFromCart, clearItemFromCart, resetCart } = useCart();
  const [defaultData, setDefaultData] = useState<any[]>(allDatatables);
  const { posTableOrderId, setPOSTableOrderId, tablesData, setTablesData, mainBranch } = useUserContext();
  const shopId = GetCookiesClient('shopId') as string;

  useEffect(() => {
    const localPOSTableOrderId = localStorage.getItem('posTableOrderId');
    const posTableOrderIdLocal = localPOSTableOrderId ? JSON.parse(localPOSTableOrderId) : null;
    if (posTableOrderId != posTableOrderIdLocal) {
      setPOSTableOrderId(posTableOrderIdLocal);
    }
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
    if (tablesData == true) {
      fetchTablesData();
    }
  }, [tablesData]);
  return (
    <>
      <FloatingCartButton
        onClick={() => setOpenDrawer(true)}
        className={className}
        lang={lang}
        totalItems={totalItems}
      />

      <Drawer
        isOpen={openDrawer ?? false}
        onClose={() => setOpenDrawer(false)}
        overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
        containerClassName="dark:bg-gray-100"
        className="z-[9999]"
      >
        <POSDrawerView
          removeItemFromCart={removeItemFromCart}
          clearItemFromCart={clearItemFromCart}
          onOrderSuccess={() => setOpenDrawer(false)}
          onSuccess={resetCart}
          orderedItems={items}
          className="h-[100svh] border-none"
          lang={lang}
          simpleBarClassName="h-[calc(100svh_-_420px)] sm:h-[calc(100svh_-_430px)]"
          defaultUser={defaultUser}
          tables={tables}
          branchOption={branchOption}
          allDatatables={defaultData}
          languages={languages}
          branchZones={branchZones}
          freeShppingTarget={freeShppingTarget}
          shopData={shopData}
          currencyAbbreviation={currencyAbbreviation}
        />
      </Drawer>
    </>
  );
}
