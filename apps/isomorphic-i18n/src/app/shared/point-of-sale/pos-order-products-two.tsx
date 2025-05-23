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

export default function POSOrderProductsTwo({
  className,
  lang,
  showControls,
  itemClassName,
  simpleBarClassName,
  orderedItems,
  removeItemFromCart,
  clearItemFromCart,
}: {
  className?: string;
  lang?: string;
  itemClassName?: string;
  simpleBarClassName?: string;
  showControls?: boolean;
  orderedItems: CartItem[];
  removeItemFromCart: (id: number | string) => void;
  clearItemFromCart: (id: number | string) => void;
}) {
  const { t, i18n } = useTranslation(lang!, "home");
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
            console.log("realProductData: ",realProductData);
            
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
                      <div className="text-xs font-medium text-gray-500">
                        {lang =='ar'?
                          <>
                            {' '}x{' '}{item.quantity}{' '}{toCurrency(item?.salePrice ?? item.price , lang)} 
                          </>
                          :
                          <>
                            {toCurrency(item?.salePrice ?? item.price , lang)} x{' '}
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
                      <div className="flex items-center gap-3 whitespace-nowrap font-semibold text-gray-900">
                        {toCurrency(
                          (item?.salePrice ?? item.price) * item.quantity
                          , lang
                        )}
                      </div>
                    </div>
                    <QuantityControl item={item} />
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

function QuantityControl({ item }: { item: CartItem }) {
  const { removeItemFromCart, addItemToCart } = useCart();
  return (
    <div className="inline-flex items-center gap-2.5 text-xs ">
      <button
        title="Decrement"
        className="grid h-7 w-7 place-content-center rounded-full bg-gray-50"
        onClick={() => removeItemFromCart(item.id)}
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

function RemoveItem({
  product,
  className,
  clearItemFromCart,
}: {
  product: CartItem;
  clearItemFromCart: (id: number | string) => void;
  className?: string;
}) {
  return (
    <button className={className} onClick={() => clearItemFromCart(product.id)}>
      <PiTrash className="h-6 w-6" />
    </button>
  );
}
