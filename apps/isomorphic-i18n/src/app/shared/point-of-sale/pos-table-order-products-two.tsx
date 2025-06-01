'use client';

import Image from 'next/image';
import { PiMinus, PiPlus, PiTrash } from 'react-icons/pi';
import { useCart } from '@/store/quick-cart/cart.context';
import { toCurrency } from '@utils/to-currency';
import { Title } from 'rizzui';
import cn from '@utils/class-names';
import { CartItem } from '@/types';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { generateSlug } from '@utils/generate-slug';
import SimpleBar from '@ui/simplebar';
// import { useCart } from '../../../../../isomorphic/src/store/quick-cart/cart.context';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';
import { useUserContext } from '@/app/components/context/UserContext';
import { useModal } from '../modal-views/use-modal';
import ModalCancelOrderItem from '@/app/components/ui/modals/ModalCancelOrderItem';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

function parseProductData(productString: string) {
  const dataPairs = productString.split('&&');
  const productData: Record<string, string> = {};
  dataPairs.forEach(pair => {
    const [key, value] = pair.split(':');
    productData[key] = value;
  });

  return {
    id: productData['id'],
    nameAr: productData['nameAr'],
    nameEn: productData['nameEn'],
    descriptionEn: productData['descriptionEn'],
    descriptionAr: productData['descriptionAr'],
    metaDescriptionEn: productData['metaDescriptionEn'],
    metaDescriptionAr: productData['metaDescriptionAr'],
    variations: Object.keys(productData)
      .filter(key => key.startsWith('variations['))
      .reduce<Record<string, any>>((acc, key) => {
        const match = key.match(/variations\[(.+?)\]\.(.+)/);
        if (match) {
          const [, variationId, field] = match;
          acc[variationId] = acc[variationId] || { id: variationId };
          acc[variationId][field] = productData[key];
        }
        return acc;
      }, {})
  };
}

export default function POSTableOrderProductsTwo({
  className,
  lang,
  orderId,
  showControls,
  itemClassName,
  simpleBarClassName,
  orderedItems,
  removeItemFromCart,
  clearItemFromCart,
  currencyAbbreviation
}: {
  className?: string;
  lang?: string;
  orderId: string;
  itemClassName?: string;
  simpleBarClassName?: string;
  currencyAbbreviation?: string;
  showControls?: boolean;
  orderedItems: CartItem[];
  removeItemFromCart: (id: number | string) => void;
  clearItemFromCart: (id: number | string) => void;
}) {
  const { t, i18n } = useTranslation(lang!, "home");
  const { openModal } = useModal();
  const { posTableOrderId, setPOSTableOrderId, mainBranch } = useUserContext();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  
  return (
    <div className={className}>
      <SimpleBar
        className={cn('h-[calc(100vh_-_495px)] pb-3', simpleBarClassName)}
      >
        <div className="divide-y divide-gray-100">
          {orderedItems.map((item) => {
            const realProductData = parseProductData(item.id as string);
            // console.log("realProductData: ",realProductData);
            // console.log("item: ",item);
            
            return <div key={item.id} className={cn('group py-5', itemClassName)}>
              <div className="flex items-start pe-2">
                <figure className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw"
                    className="h-full w-full object-cover"
                  />

                  {showControls && (
                    <>
                      <span className="absolute inset-0 grid place-content-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100" />
                      <RemoveItem
                        clearItemFromCart={clearItemFromCart}
                        product={item}
                        item={realProductData}
                        lang={lang}
                        orderId={orderId}
                        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform rounded text-white opacity-0 transition duration-300 group-hover:opacity-100"
                      />
                    </>
                  )}
                </figure>
                <div className="w-full truncate ps-3">
                  <Title
                    as="h3"
                    className="mb-1 truncate font-inter text-sm font-semibold text-gray-900"
                  >
                    {/* <Link
                      href={routes.eCommerce.productDetails(
                        generateSlug(item.name)
                      )}
                    >
                      {item.name}
                    </Link> */}
                    {lang =='ar'? realProductData.nameAr : realProductData.nameEn}
                  </Title>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-gray-500 flex gap-1 items-center">
                        {lang =='ar'?
                          <>
                            {' '}x{' '}{item.quantity}{' '}{item?.salePrice ?? item.price }{currencyAbbreviation === 'ر.س' ? (
                                    <Image src={sarIcon} alt="SAR" width={16} height={16} />
                                  ) : (
                                    <span>{currencyAbbreviation}</span>
                                  )}  
                          </>
                          :
                          <>
                            {item?.salePrice ?? item.price}{currencyAbbreviation === 'ر.س' ? (
                                    <Image src={sarIcon} alt="SAR" width={16} height={16} />
                                  ) : (
                                    <span>{currencyAbbreviation}</span>
                                  )}  x{' '}
                            {item.quantity}
                          </>
                        }
                      </div>
                      <ul className={`grid grid-cols-1 sm:grid-cols-1 gap-x-4 gap-y-3 sm:gap-x-8`}>                    
                        <div className="flex flex-wrap gap-2">
                          {item.orderItemVariations?.map((variation, index) =>
                            (variation.choices?.[0]?.choiceValue || variation.choices?.[0]?.inputValue) && (
                              <div 
                                key={variation.variationId} 
                                className="flex items-center gap-3 text-gray-500"
                              >
                                {realProductData.variations?.[variation.variationId]?.choiceId && (
                                  <span 
                                    className="bg-gray-100 text-gray-700 px-1 py-[2px] rounded-[3px] max-w-[200px] truncate overflow-hidden inline-block"
                                    title={lang == 'ar' ? realProductData.variations?.[variation.variationId]?.choiceValueAr : realProductData.variations?.[variation.variationId]?.choiceValueEn}
                                  >
                                    {lang == 'ar' 
                                      ? realProductData.variations?.[variation.variationId]?.choiceValueAr 
                                      : realProductData.variations?.[variation.variationId]?.choiceValueEn}
                                  </span>
                                )}
                                {realProductData.variations?.[variation.variationId]?.inputValue && (
                                  <span 
                                    className="bg-gray-100 text-gray-700 px-1 py-[2px] rounded-[3px] max-w-[200px] truncate overflow-hidden inline-block"
                                    title={realProductData.variations?.[variation.variationId]?.inputValue}
                                  >
                                    {realProductData.variations?.[variation.variationId]?.inputValue}
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </ul>
                      <div className="flex items-center gap-1 whitespace-nowrap font-semibold text-gray-900">
                        {(item?.salePrice ?? item.price) * item.quantity} {currencyAbbreviation === 'ر.س' ? (
                                    <Image src={sarIcon} alt="SAR" width={16} height={16} />
                                  ) : (
                                    <span>{currencyAbbreviation}</span>
                                  )} 
                      </div>
                    </div>
                    <QuantityControl item={item} clearItemFromCart={clearItemFromCart} lang={lang}/>
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </SimpleBar>
    </div>
  );
}

function QuantityControl({ item, clearItemFromCart, lang = 'en' }: { item: CartItem; clearItemFromCart: (id: number | string) => void; lang?: string; }) {
  const { removeItemFromCart, addItemToCart } = useCart();
  const { openModal } = useModal();
  const realProductData = parseProductData(item.id as string)
  const { posTableOrderId, setPOSTableOrderId, setTablesData } = useUserContext();
  const itemId = findMatchingOrderItem(posTableOrderId.order.items, realProductData);
  // console.log("Matched Item ID: ", itemId);

  if (itemId) {
    // console.log(`Item found: ${itemId}`);
  } else {
    // console.log("No matching item found.");
  }
  const isNotCancelled = posTableOrderId.order.items.some(
    (item: any) => item.id === itemId && item.cancelled === false
  );
  const cancelledWithGreaterQuantity = posTableOrderId.order.items.some(
    (orderItem: any) => orderItem.id === itemId && orderItem.cancelled === false && item.quantity > orderItem.quantity
  );
  // console.log(`item (${item.name})--> cancelledWithGreaterQuantity: ${cancelledWithGreaterQuantity} --> isNotCancelled: ${isNotCancelled}`);
  
  return (
    <div className="inline-flex items-center gap-2.5 text-xs ">
      <button
        title="Decrement"
        className="grid h-7 w-7 place-content-center rounded-full bg-gray-50"
        onClick={() => { 
          if (itemId && isNotCancelled && !cancelledWithGreaterQuantity) {
            openModal({
              view: <ModalCancelOrderItem
                lang={lang} 
                orderId={posTableOrderId.order.id}
                itemId={itemId}
                quantity={item.quantity - 1}
                onSuccess={()=>{
                  setTablesData(true);
                  if (item.quantity == 1) {
                    clearItemFromCart(item.id);
                    const updatedOrder = updateOrderWithCancelledItem(posTableOrderId, itemId);
                    setPOSTableOrderId(updatedOrder);
                  }else {
                    removeItemFromCart(item.id);
                    const updatedOrder = updateOrderWithQuantityItem(posTableOrderId, itemId, item.quantity - 1);
                    setPOSTableOrderId(updatedOrder);
                  }
                }}
              />,
              customSize: '480px',
            });
          }else {
            removeItemFromCart(item.id);
          }
        }}
      >
        <PiMinus className="h-3 w-3 text-gray-600" />
      </button>
      <span className="font-medium text-gray-900">{item.quantity}</span>
      <button
        title="Decrement"
        className="grid h-7 w-7 place-content-center rounded-full bg-gray-50"
        onClick={() => addItemToCart(item, 1)}
      >
        <PiPlus className="h-3 w-3 text-gray-600" />
      </button>
    </div>
  );
}

function variationsMatch(orderVariations: any[], realVariations: any): boolean {
  return orderVariations.every((orderVar) => {
    const realVar = realVariations[orderVar.variationId];
    if (!realVar) return false;

    return orderVar.choices.every((choice: any) => {
      // Check for input-based variation (e.g., inputValue)
      if (choice.inputValue) {
        return realVar.inputValue === choice.inputValue;
      }

      // Check for choice-based variation (e.g., choiceId)
      return realVar.choiceId === choice.choiceId;
    });
  });
}

function findMatchingOrderItem(orderItems: any[], realProductData: any): string | null {
  const matchingItem = orderItems.find((item) => {
    // Check if product ID matches
    if (item.product.id !== realProductData.id) return false;
    if (item.cancelled == true) return false;

    // Check if variations match
    const orderVariations = item.orderItemVariations || [];
    const realVariations = realProductData.variations || {};

    return variationsMatch(orderVariations, realVariations);
  });

  // Return the item ID if found, otherwise null
  return matchingItem ? matchingItem.id : null;
}

function updateOrderWithCancelledItem(posTableOrderId: any, itemId: string): any {
  const updatedOrder = { ...posTableOrderId };

  updatedOrder.order.items = updatedOrder.order.items.map((item: any) => {
    if (item.id === itemId) {
      return { ...item, cancelled: true };
    }
    return item;
  });

  // Check if all items are now cancelled
  const allItemsCancelled = updatedOrder.order.items.every((item: any) => item.cancelled === true);

  if (allItemsCancelled) {
    // Remove the order and update tableStatus
    delete updatedOrder.order;
    updatedOrder.tableStatus = 0;
  }

  return updatedOrder;
}

function updateOrderWithQuantityItem(posTableOrderId: any, itemId: string, quantity: number): any {
  const updatedOrder = { ...posTableOrderId };

  updatedOrder.order.items = updatedOrder.order.items.map((item: any) => {
    if (item.id === itemId) {
      return { ...item, quantity: quantity };
    }
    return item;
  });

  return updatedOrder;
}

function RemoveItem({
  product,
  className,
  clearItemFromCart,
  lang = 'en',
  orderId,
  item,
}: {
  product: CartItem;
  clearItemFromCart: (id: number | string) => void;
  className?: string;
  lang?: string;
  orderId: string;
  item: any;
}) {
  const { openModal } = useModal();
  const realProductData = parseProductData(product.id as string)
  const { posTableOrderId, setPOSTableOrderId, setTablesData } = useUserContext();
  // console.log("orderId: ",orderId);
  // console.log("posTableOrderId: ",posTableOrderId);
  // // console.log("item: ",item);

  const itemId = findMatchingOrderItem(posTableOrderId.order.items, realProductData);
  // console.log("Matched Item ID: ", itemId);

  if (itemId) {
    // console.log(`Item found: ${itemId}`);
  } else {
    // console.log("No matching item found.");
  }
  const isAlreadyCancelled = posTableOrderId.order.items.some(
    (item: any) => item.id === itemId && item.cancelled === false
  );
  return (
    <button className={className} 
      onClick={() => {
        if (itemId && isAlreadyCancelled) {
          openModal({
            view: <ModalCancelOrderItem
              lang={lang} 
              orderId={orderId}
              itemId={itemId}
              onSuccess={()=>{
                setTablesData(true);
                clearItemFromCart(product.id);
                const updatedOrder = updateOrderWithCancelledItem(posTableOrderId, itemId);
                setPOSTableOrderId(updatedOrder);
              }}
            />,
            customSize: '480px',
          });
        }else {
          clearItemFromCart(product.id);
        }
        console.log("isAlreadyCancelled: ",isAlreadyCancelled);
        console.log("item.id: ",item.id);
        console.log("itemId: ",itemId);
        
      }}
    >
      <PiTrash className="h-6 w-6" />
    </button>
  );
}
