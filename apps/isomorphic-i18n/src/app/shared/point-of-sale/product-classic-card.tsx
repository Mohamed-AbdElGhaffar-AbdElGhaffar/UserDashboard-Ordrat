'use client';

import Image from 'next/image';
import { Title, Text, Button } from 'rizzui';
import { PiMinus, PiPlus } from 'react-icons/pi';
import { SetStateAction, useEffect, useState } from 'react';
import POSModal from '@/app/components/ui/modals/POSModal';
import cn from '@utils/class-names';
import { CartItem } from '@/types';
// import { useCart } from '../../../../../isomorphic/src/store/quick-cart/cart.context';
import { useCart } from '@/store/quick-cart/cart.context';
import { toCurrency } from '@utils/to-currency';
import { useTranslation } from '@/app/i18n/client';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'
import toast from 'react-hot-toast';
export type PosProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  finalPrice: number;
  quantity: number;
  size: number;
  discount?: number;
};

interface ProductProps {
  product: any;
  className?: string;
  lang?: string;
  currencyAbbreviation: string;
}

export default function ProductClassicCard({
  product,
  className,
  lang,
  currencyAbbreviation
}: ProductProps) {
  const { finalPrice } = product;
  const discount = product.discount ?? 0;
  const discountType = product.discountType ?? 0; // 0 = %, 1 = real amount
  const isDiscountActive = product.isDiscountActive ?? false;

  let price = finalPrice;
  let discountValue = 0;

  if (isDiscountActive) {
    if (discountType === 0) {
      price = finalPrice / (1 - discount / 100);
    } else if (discountType === 1) {
      price = finalPrice + discount;
    }

    price = Math.round(price * 100) / 100;

    discountValue = discountType === 0
      ? discount
      : Math.round((discount / price) * 100);
  } else {
    price = 0;
    discountValue = 0;
  }
  const { t, i18n } = useTranslation(lang!, "home");
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const { addItemToCart, isInCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);


  //
  const currency =
  currencyAbbreviation === 'ر.س'
    ? <Image src={sarIcon} width={15} height={15} alt='sarIcon'/>
    : currencyAbbreviation || '';

  const productData = {
    id: product.id,
    name: lang === 'ar' ? product.nameAr : product.nameEn,
    description: lang === 'ar' ? product.descriptionAr : product.descriptionEn,
    nameEn: product.nameEn,
    nameAr: product.nameAr,
    descriptionEn: product.descriptionEn,
    descriptionAr: product.descriptionAr,
    vat: product.vat,
    vatType: product.vatType,
    isDiscountActive: product.isDiscountActive,
    discount: product.discount,
    discountType: product.discountType,
    isActive: product.isActive,
    createdAt: product.createdAt,
    lastUpdatedAt: product.lastUpdatedAt,
    isTopSelling: product.isTopSelling,
    isTopRated: product.isTopRated,
    metaDescriptionEn: product.metaDescriptionEn,
    metaDescriptionAr: product.metaDescriptionAr,
    imageUrl: product.images?.length > 0 ? product.images[0].imageUrl : 'https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/public/food/1.webp',
    categoryId: product.categoryId,
    numberOfSales: product.numberOfSales,
    variations: product.variations,
    frequentlyOrderedWith: product.frequentlyOrderedWith,
    reviews: product.reviews,
    price: product.finalPrice,
    oldPrice: product.price,
  };

  const cartItem: CartItem = {
    id: `id:${productData.id}&&nameAr:${productData.nameAr}&&nameEn:${productData.nameEn}&&descriptionEn:${productData.descriptionEn}&&descriptionAr:${productData.descriptionAr}&&metaDescriptionEn:${productData.metaDescriptionEn}&&metaDescriptionAr:${productData.metaDescriptionAr}&&${''}`,
    name: productData.name || "Default Item",
    description: productData.description,
    image: productData.imageUrl || "",
    price: (productData.price) || 0,
    oldPrice: (productData.oldPrice) || 0,
    quantity,
    orderItemVariations: [],
  };
  
  const handleOpenModal = () => {
    if(product.variations.length == 0){
      addItemToCart(cartItem, 1);
      toast.success(lang == 'ar'? `تم اضافة ${productData.nameAr || 'المنتج'} الي السلة` : `${productData.nameEn || 'Product'} added to cart!`);
    }else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={handleOpenModal} className={cn('pb-0.5 cursor-pointer', className)}>
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            alt={lang === 'ar' ? product.nameAr : product.nameEn}
            src={product.images?.length > 0 
              ? product.images[0].imageUrl 
              : 'https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/public/food/1.webp'}
            className="h-full w-full object-cover"
            loading="eager"
          />
          </div>
          {discountValue ? (
            <Text
              as="span"
              className="absolute start-5 top-5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold dark:bg-gray-200 dark:text-gray-700"
            >
              {discountValue}% {t("discount")}
            </Text>
          ) : null}
        </div>

        <div className="pt-3">
          <Title as="h6" className="mb-1 truncate font-inter font-semibold">
            {lang == 'ar'?product.nameAr:product.nameEn}
          </Title>

          <Text as="p" className="truncate">
            {lang == 'ar'?product.descriptionAr:product.descriptionEn}
          </Text>
          <div className="mt-2 flex items-center font-semibold text-gray-900 gap-1">
            {Number(finalPrice)} {currency}
            {price != 0 && (
              <del className="ps-1.5 text-[13px] font-normal text-gray-500 flex items-center gap-1">
                {Number(price)} {currency}
              </del>
            )}
          </div>
          {/* <div className="mt-3">
            {isInCart(product.id) ? (
              <QuantityControl item={product} />
            ) : (
              <Button
                onClick={handleOpenModal}
                className="w-full"
                variant="outline"
              >
                {t("order")}
              </Button>
            )}
              <Button
                onClick={handleOpenModal}
                className="w-full"
                variant="outline"
              >
                {t("order")}
              </Button>
          </div> */}
        </div>
      </div>
      {isModalOpen && (
        <POSModal
          lang={lang!}
          modalId={`${product.id}`}
          setIsModalOpen={setIsModalOpen}
          quantity={quantity}
          setQuantity={setQuantity} 
          product={product} 
          currencyAbbreviation={currencyAbbreviation}
          // setShowItem={function (val: boolean): void {
          //   throw new Error('Function not implemented.');
          // } }
        />
      )}
    </>
  );
}

function QuantityControl({ item }: { item: CartItem }) {
  const { addItemToCart, removeItemFromCart, getItemFromCart } = useCart();
  return (
    <div className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 px-1 duration-200 hover:border-gray-900">
      <button
        title="Decrement"
        className="flex items-center justify-center rounded p-2 duration-200 hover:bg-gray-100 hover:text-gray-900"
        onClick={() => removeItemFromCart(item.id)}
      >
        <PiMinus className="h-3.5 w-3.5" />
      </button>
      <span className="grid w-8 place-content-center font-medium">
        {getItemFromCart(item.id).quantity}
      </span>
      <button
        title="Decrement"
        className="flex items-center justify-center rounded p-2 duration-200 hover:bg-gray-100 hover:text-gray-900"
        onClick={() => addItemToCart(item, 1)}
      >
        <PiPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
