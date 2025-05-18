'use client';

import dynamic from 'next/dynamic';
import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea, Text } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from '../POSOrderForm/POSOrderForm.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import TablesPosData from './TablesPosData';
import { CartItem as Item } from '@/types';
// import { useCart } from '@/store/quick-cart/cart.context';

type POSTablesFormProps = {
  title?: string;
  lang: string;
  items: Item[];
  clearItemFromCart: (id: number | string) => void;
  addItemToCart: (item: Item, quantity: number) => void;
  allDatatables: any[];
  languages: number;
};

export default function POSTablesForm({
  title,
  lang = 'en',
  items,
  clearItemFromCart,
  addItemToCart,
  allDatatables,
  languages
}: POSTablesFormProps) {
  // console.log("allDatatables: ",allDatatables);
  
  const shopId = GetCookiesClient('shopId');
  const { closeModal } = useModal();
  const { shipping, setPOSTableOrderId } = useUserContext();
  const [loading, setLoading] = useState(false);
  // const { items, clearItemFromCart } = useCart();
  const text = {
    submit: lang === 'ar' ? 'اطلب' : 'Order',
  };

  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" 
            onClick={()=>{
              closeModal();
              setPOSTableOrderId('');
              localStorage.removeItem('posTableOrderId');
            }} className="p-0 text-gray-500 hover:!text-gray-900"
          >
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        <TablesPosData lang={lang} languages={languages} tables={allDatatables} items={items} clearItemFromCart={clearItemFromCart} addItemToCart={addItemToCart}/>
      </div>
    </div>
  );
}
