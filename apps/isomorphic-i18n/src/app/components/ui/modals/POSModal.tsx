'use client';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm, useFormContext, Controller } from 'react-hook-form';
import {
    buildProductDetailsSchema,
    ProductDetailsInput,
} from '@/validators/product-details.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame, Star, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import QuantityHandler from '../item/QuantityHandler';
import ItemPrice from '../ItemPrice';
import Badge from '../Badge';
import Image from 'next/image';
import cn from '../../../../../../../packages/isomorphic-core/src/utils/class-names';
import { FullProduct, FoodId, CartItem } from '@/types';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Input } from 'rizzui';
import { useCart } from '@/store/quick-cart/cart.context';
import toast from 'react-hot-toast';
import { toCurrency } from '@utils/to-currency';
// import photo from '@public/assets/category-designs/theme-1.png'
import { PhoneNumber } from '@ui/phone-input';
import RoleSelect from '../inputs/selectInput/SelectInput';
import SpecialNotes from '@/app/components/ui/SpecialNotes';
import { useTranslation } from '@/app/i18n/client';
import GetRadio from '../get-radio';
import { API_BASE_URL } from '@/config/base-url';
import { GetCookiesClient } from '../getCookiesClient/GetCookiesClient';
import CustomImage from '../CustomImage';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUserContext } from '../../context/UserContext';
import sarIcon1 from '@public/assets/Saudi_Riyal_Symbol-white.svg.png'
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

const shopId = GetCookiesClient('shopId');
// import { useCart } from '../../../../../../isomorphic/src/store/quick-cart/cart.context';

// type Props = {

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

interface Variation {
  id: string;
  name: string;
  buttonType: number;
  isActive: boolean;
  isRequired: boolean;
  choices: Choice[];
}

interface Choice {
  id: string;
  name?: string;
  imageUrl?: string;
  price?: number;
  isActive: boolean;
  isDefault: boolean;
}

type Option = {
  label: string | JSX.Element;
  value: number | string;
};

type ModalProps = {
  currencyAbbreviation: string;
  data?: FullProduct;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  hasMoreDetails?: boolean;
  lang: string;
  handleUpdateCart?: () => void;
  itemId?: string;
  // setShowItem: (val: boolean) => void;
  type?: string;
  setIsModalOpen: (isOpen: boolean) => void;
  modalId: string;
  product: any;
};

async function GetProduct({ lang, id }: { lang: string, id: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Products/GetById/${shopId}/${id}`, {
      headers: {
        'Accept-Language': lang,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

const photo = 'https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/public/food/1.webp';

function POSModal({
  setIsModalOpen,
  currencyAbbreviation,
  modalId,
  data,
  quantity,
  setQuantity,
  lang,
  hasMoreDetails,
  handleUpdateCart,
  itemId,
  type,
  product
}: ModalProps) {
  console.log("product details: ",product);
  
  const [isOpen, setIsOpen] = useState(true);
  const [prodId, setProdId] = useState<FoodId | any>(null)
  const [productData, setProductData] = useState<FoodId | any>(null)
  const [prodCartItem, setProdCartItem] = useState<CartItem | any>(null)
  const [isLoading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const { t, i18n } = useTranslation(lang!, "home");
  const errorMassages = useTranslation(lang!, 'form');
  
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const { addItemToCart, items } = useCart();
  const [isImageVisible, setImageVisible] = useState(true);
  const [isScroll, setIsScroll] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLImageElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [randomViewers, setRandomViewers] = useState<number | null>(null);
  const [totalSoldQuantity, setTotalSoldQuantity] = useState<number>(0);
  const { mainBranch } = useUserContext();

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setImageVisible(scrollTop < 150);
    }
  };
  const handleScrollPc = () => {
      setIsScrolled(window.scrollY > 0);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScrollPc);
    return () => window.removeEventListener("scroll", handleScrollPc);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      console.log("data: ",product);
      
      console.log("id الحالي:", product);
      console.log("items الحالي:", items);
      setTotalSoldQuantity(0);
      let totalQuantity = 0;
      if (product.stocks.length != 0) {
        items.forEach((item) => {
          const realProductData = parseProductData(item.id as string);
          if (realProductData.id === product.id) {
            totalQuantity += item.quantity;
          }
        });
        setTotalSoldQuantity(totalQuantity);

        console.log(`✅ Total quantity sold for product ${product.id}:`, totalSoldQuantity);
        console.log(`✅ Total quantity - totalSoldQuantity ${product.id}:`, totalSoldQuantity - quantity);
      }

      let hasStock = false;
      let stockNumber = 0;

      if (product?.stocks?.length > 0) {
        hasStock = product.stocks.some((s: any) => s.stockNumber > 0);
        const mainBranchStock = product.stocks.find((s: any) => s.branchId === mainBranch);
        stockNumber = mainBranchStock ? mainBranchStock.stockNumber : 0;
      } else {
        hasStock = false;
        stockNumber = 0;
      }
      
      // const data = await GetProduct({ lang, id: productIdToFetch });
      const formattedData: any = {
        id: product.id,
        name: lang === 'ar' ? product.nameAr : product.nameEn,
        description: lang === 'ar' ? product.descriptionAr : product.descriptionEn,
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
        seoDescription: lang === 'ar' ? product.metaDescriptionAr : product.metaDescriptionEn,
        imageUrl: product.images?.length > 0 ? product.images[0].imageUrl : 'https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/public/food/1.webp',
        categoryId: product.categoryId,
        numberOfSales: product.numberOfSales,
        category: null,
        variations: product.variations.filter((variation: any) => variation.isActive).map((variation: any) => ({
          id: variation.id,
          name: lang === 'ar' ? variation.nameAr : variation.nameEn,
          buttonType: variation.buttonType,
          isActive: variation.isActive,
          isRequired: variation.isRequired,
          choices: variation.choices.filter((choice: any) => choice.isActive).map((choice: any) => ({
            id: choice.id,
            name: lang === 'ar' ? choice.nameAr : choice.nameEn,
            price: choice.price,
            isDefault: choice.isDefault,
            isActive: choice.isActive,
            imageUrl: choice.imageUrl,
          })),
        })),
        frequentlyOrderedWith: product.frequentlyOrderedWith,
        reviews: product.reviews,
        price: product.finalPrice,
        oldPrice: product.price,
        stockNumber,
        hasStock
      };

      const formattedData2 = {
        id: product.id,
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
        variations: product.variations.filter((variation: any) => variation.isActive).map((variation: any) => ({
          id: variation.id,
          nameEn: variation.nameEn,
          nameAr: variation.nameAr,
          buttonType: variation.buttonType,
          isActive: variation.isActive,
          isRequired: variation.isRequired,
          choices: variation.choices.filter((choice: any) => choice.isActive).map((choice: any) => ({
            id: choice.id,
            nameEn: choice.nameEn,
            nameAr: choice.nameAr,
            price: choice.price,
            isDefault: choice.isDefault,
            isActive: choice.isActive,
            imageUrl: choice.imageUrl,
          })),
        })),
        frequentlyOrderedWith: product.frequentlyOrderedWith,
        reviews: product.reviews,
        price: product.finalPrice,
        oldPrice: product.price,
        stockNumber,
        hasStock
      };

      setProdId(formattedData);
      setProductData(formattedData2);
      setProdCartItem({
        id: formattedData.id,
        name: formattedData.name,
        slug: formattedData.name,
        description: formattedData.description,
        imageUrl: formattedData.imageUrl,
        isDiscountActive: formattedData.isDiscountActive,
        stockNumber: formattedData.stockNumber || 0,
        hasStock: formattedData.hasStock || false,
        price: formattedData.price,
        quantity: 1,
        sizeFood: "small",
        color: {
          name: "Purple Heart",
          code: "#5D30DD",
        },
      });
    };

    fetchData();
  }, [GetProduct, modalId, lang]);

  const handleAddToCart = () => {
    if (!prodCartItem) return;
    const cartItem: CartItem = {
      id: prodCartItem.id,
      name: prodCartItem.name || "Default Item",
      slug: prodCartItem.slug || "",
      description: prodCartItem.description || "Default Description",
      image: prodCartItem.imageUrl,
      price: prodCartItem.price || 100,
      quantity,
      sizeFood: "small",
      discount: prodCartItem.discount,
      stock: 10,
    };
    addItemToCart(cartItem, quantity);
    setIsModalOpen(false);
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  const handleClose = () => {
    setIsModalOpen(false);
  };
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  const methods = useForm<ProductDetailsInput>({
    mode: 'onChange',
    resolver: zodResolver(buildProductDetailsSchema(prodId?.variations || [])),
  });
  
  useEffect(() => {
    if (prodId) {
      const defaults: Record<string, any> = {};
      prodId.variations.forEach((variation: any) => {
        if (variation.buttonType === 0 || variation.buttonType === 1) {
          const defaultChoice = variation.choices.find((choice: any) => choice.isDefault);
          if (defaultChoice) {
            defaults[variation.id] = defaultChoice.id;
          }
        }
      });

      methods.reset(defaults);
    }
  }, [prodId, methods]);

  const { watch, setValue, register, handleSubmit, control } = methods;

  useEffect(() => {
    const subscription = watch((values) => {
      Object.keys(values).forEach((key) => {
        const value = values[key];
        const matchingFields = Object.keys(values).filter(
          (field) => field === key
        );
        matchingFields.forEach((field) => {
          if (values[field] !== value) {
            setValue(field, value);
          }
        });
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Calculate total price
  const selectedChoicePrices = prodId?.variations?.reduce((total: number, variation: Variation) => {
    const selectedChoiceId = watch(variation.id);
    const selectedChoice = variation.choices.find((choice: Choice) => choice.id === selectedChoiceId);
    return total + (selectedChoice?.price || 0);
  }, 0) || 0;

  const finalPrice = prodId ? (prodId.price * quantity) + (selectedChoicePrices * quantity) : 0;
  const finalOldPrice = (data?.oldPrice && prodId) ? (prodId.oldPrice * quantity) + (selectedChoicePrices * quantity) : undefined;

  const onSubmit: SubmitHandler<ProductDetailsInput> = (data) => {
    if (!productData || !prodId) return;

    const variationsString = productData.variations.map((variation: any) => {
      const variationData = data[variation.id];
      if (variation.buttonType === 0 || variation.buttonType === 1) {
        const selectedChoice = variation.choices.find((choice: any) => choice.id === variationData);
        return `variations[${variation.id}].id:${variation.id}&&variations[${variation.id}].nameEn:${variation.nameEn}&&variations[${variation.id}].nameAr:${variation.nameAr}&&variations[${variation.id}].choiceId:${variationData}&&variations[${variation.id}].choiceValueEn:${selectedChoice?.nameEn || ""}&&variations[${variation.id}].choiceValueAr:${selectedChoice?.nameAr || ""}`;
      } else {
        return `variations[${variation.id}].id:${variation.id}&&variations[${variation.id}].nameEn:${variation.nameEn}&&variations[${variation.id}].nameAr:${variation.nameAr}&&variations[${variation.id}].inputValue:${variationData || ""}`;
      }
    }).join('&&');

    const cartItem: CartItem = {
      id: `id:${prodId.id}&&nameAr:${productData.nameAr}&&nameEn:${productData.nameEn}&&descriptionEn:${productData.descriptionEn}&&descriptionAr:${productData.descriptionAr}&&metaDescriptionEn:${productData.metaDescriptionEn}&&metaDescriptionAr:${productData.metaDescriptionAr}&&${variationsString}`,
      name: prodId.name || "Default Item",
      description: prodId.description,
      image: prodId.imageUrl || "",
      price: (prodId.price + selectedChoicePrices) || 0,
      oldPrice: (prodId.oldPrice + selectedChoicePrices) || 0,
      quantity,
      notes: notes || "",
      orderItemVariations: prodId.variations.map((variation: Variation) => {
        const variationData = data[variation.id];
        // Skip choice-based variation if it's not required and has no selected value
        if ((variation.buttonType === 0 || variation.buttonType === 1) && !variationData && !variation.isRequired) {
          return [];
        }
        if (variation.buttonType === 0 || variation.buttonType === 1) {
          const selectedChoice = variation.choices.find(choice => choice.id === variationData);
          return {
            variationId: variation.id,
            variationLable: variation.name,
            choices: [
              {
                choiceId: variationData || "",
                choiceValue: selectedChoice?.name || "",
              },
            ],
          };
        } else {
          return {
            variationId: variation.id,
            variationLable: variation.name,
            choices: [
              {
                inputValue: variationData || "",
              },
            ],
          };
        }
      }),
    };

    let isItemAdded = false;

    prodId.variations.forEach((variation: Variation) => {
      const variationData = data[variation.id];
      if (variation.buttonType === 0 || variation.buttonType === 1) {
        if (variationData || !variation.isRequired) {
          isItemAdded = true;
        }
      } else {
        isItemAdded = true;
      }
    });

    if (prodId.variations.length === 0) {
      isItemAdded = true;
    }

    if (isItemAdded) {
      addItemToCart(cartItem, quantity);
      handleClose();
      toast.success(t("addtoCart"));
    }
  };
  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {/* Desktop Modal */}
      <div className="hidden md:block">
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 blur-md z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />

        <FormProvider {...methods}>
          <form className="pb-8 pt-5" onSubmit={methods.handleSubmit(onSubmit)}>
            <motion.div
              onClick={handleOutsideClick}
              className="fixed inset-0 flex z-[999] items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg b-4 w-[600px] 4xl:w-[800px] min-h-auto max-h-[650px]"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: isOpen ? 1 : 0.9, y: isOpen ? 0 : 20, opacity: isOpen ? 1 : 0 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div
                  className={cn('grid grid-cols-3 rounded-lg gap-2 relative', {
                    'grid-cols-1': !hasMoreDetails,
                  })}
                >
                  <div className="relative rounded-t-lg z-50 bg-white">
                    {/* PC Product Image */}
                    <div className={`sticky mb-5 rounded-t-lg ${isScrolled ? `secShadow` : `shadow-none`} top-0 bg-white z-50 `}>
                      <div className={`flex mb-4 `}>
                        <div className="relative">
                          <img
                            src={prodId?.imageUrl || photo}
                            width={500}
                            height={300}
                            alt="s"
                            className="w-52 h-52 p-1 rounded-lg object-cover"
                          />
                          <X
                            onClick={handleClose}
                            className="bg-white rounded-full p-2 absolute top-3 start-2 hover:cursor-pointer"
                            size={36}
                          />
                          {prodId?.isDiscountActive &&
                          <p
                          className="bg-white rounded-xl py-2 px-3 absolute top-3 font-semibold end-2 hover:cursor-pointer"
                          
                          >
                              {lang==='ar'?'خصم':'save'}{" "}

                            {prodId.discountType ===0 ?
                           ` ${prodId.discount} %`
                           :
                            `${prodId.discount} ${currencyAbbreviation === 'ر.س' ? (
                              <Image src={sarIcon} alt="SAR" width={12} height={12} />
                            ) : (
                              <span>{currencyAbbreviation}</span>
                            )}`
                          }
                          </p>
                          }
                        </div>
                        <div className="px-4 pt-2 flex flex-col">
                          <div className="flex items-center gap-2">
                            {prodId?.isTopSelling && <Badge Icon={Flame} title={lang === 'ar' ? "الأعلى مبيعًا" : "Top Sale"} className="-ms-1" />}
                            {prodId?.isTopRated && <Badge Icon={Star} title={lang === 'ar' ? "الأعلى تقييمًا" : "Top Rated"} className="-ms-1" />}
                          </div>
                          <h3 className="text-xl font-bold leading-10">{prodId?.name}</h3>
                          <p className="text-sm font-medium text-black/75">{prodId?.description}</p>
                          <SpecialNotes lang={lang!} notes={notes} setNotes={setNotes} className="gap-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PC Product Variations */}
                  <div className="overflow-y-auto  max-h-[350px]">
                    <div className="">
                      {prodId?.variations && (
                        <>
                          <div className="flex flex-col gap-3 pb-4">
                            {prodId.variations.filter((variation: any) => variation.isActive).map((variation: Variation) => {
                              {/* PC Product Variation buttonType 0 */ }
                              if (variation.buttonType === 0 && (variation.isActive)) {
                                const options: Option[] = variation.choices.map((choice: Choice) => ({
                                  label: (
                                    <>
                                      {/* PC Product Variation Choices */}
                                      <div className="flex flex-col justify-center items-center">
                                        {choice.imageUrl ? (
                                          <>
                                            <CustomImage
                                              src={choice.imageUrl}
                                              alt={choice.name || "Radio"}
                                              width={600}
                                              height={350}
                                              className="w-20 h-20 object-cover"
                                            />
                                            <div className="">
                                              <p className='text-center'>{choice.name}</p>
                                              {/* {choice.price && <small>{abbreviation && toCurrency(\\ */}
                                              <p className='flex items-center gap-1'>

                                                {choice.price}{" "}{currencyAbbreviation === 'ر.س' ? (
                              <Image src={sarIcon} alt="SAR" width={12} height={12} />
                            ) : (
                              <span>{currencyAbbreviation}</span>
                            )}
                                              </p>    
                                              {/* , lang, abbreviation)}</small>} */}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="h-10">
                                            <p className='text-center'>{choice.name}</p>
                                            <p className='flex items-center gap-1'>

                                            {choice.price}{" "}{currencyAbbreviation === 'ر.س' ? (
                              <Image src={sarIcon} alt="SAR" width={12} height={12} />
                            ) : (
                              <span>{currencyAbbreviation}</span>
                            )}
                                            </p>

                                            {/* {choice.price && <small>{abbreviation && toCurrency(choice.price, lang, abbreviation)}</small>} */}
                                          </div>

                                        )
                                        }
                                      </div>
                                    </>
                                  ),
                                  value: choice.id,
                                }));
                                console.log("variation: ",variation);
                                
                                return (
                                  <div key={variation.id} className="flex px-4">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-center gap-2">
                                        {/* PC Product Variation Name */}
                                        <strong>{t('choiceof')} {variation.name}</strong>
                                        {/* PC Product Variation isRequired */}
                                        {variation.isRequired && (
                                          <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                            {t('req')}
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-black/75">{t('Choose1')}</span>
                                      {/* PC Product Variation choice */}
                                      <div className='mt-2'>
                                        <GetRadio lang={lang} name={variation.id} options={options} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              {/* PC Product Variation buttonType 1 */ }
                              if (variation.buttonType === 1 && (variation.isActive)) {
                                return <>
                                  <div key={variation.id} className="flex z-10 px-4 pt-0">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        {/* PC Product Variation Name */}
                                        <strong>{t('choiceof')} {variation.name}</strong>
                                        {variation.isRequired && (
                                          <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                            {t('req')}
                                          </div>
                                        )}
                                      </div>
                                      <Controller
                                        key={variation.id}
                                        name={variation.id}
                                        control={methods.control}
                                        render={({ field, fieldState }) => (
                                          <RoleSelect
                                            // label={variation.name}
                                            options={variation.choices as { id: string; name: string }[]}

                                            field={{
                                              ...field,
                                              value: typeof field.value === "string" ? field.value : "",
                                            }}
                                            error={errorMassages.t(String(methods.formState.errors[variation.id]?.message || ''))}
                                            placeholder={variation.name}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </>
                              }
                              {/* PC Product Variation buttonType 3 */ }
                              if (variation.buttonType === 3 && (variation.isActive)) {
                                return (
                                  <div key={variation.id} className="flex px-4 pt-0">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <strong>{variation.name}</strong>
                                        {variation.isRequired && (
                                          <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                            {t('req')}
                                          </div>
                                        )}
                                      </div>
                                      {/* <Input
                                              key={variation.id}
                                              label={variation.name}
                                              placeholder={variation.name}
                                              inputClassName="text-sm [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                              className="w-full"
                                              {...methods.register(variation.id)}
                                              error={String(methods.formState.errors[variation.id]?.message || '')}
                                          /> */}
                                      <Controller
                                        control={control}
                                        name={variation.id}
                                        render={({ field }) => (
                                          <Input
                                            // label={variation.name}
                                            {...register(variation.id)}
                                            {...field}
                                            placeholder={variation.name}
                                            inputClassName="text-[16px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                            className="input-placeholder text-[16px] w-full"
                                            error={errorMassages.t(String(methods.formState.errors[variation.id]?.message || ''))}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                              if (variation.buttonType === 4 && (variation.isActive)) {
                                return (
                                  <div key={variation.id} className="flex px-4 pt-0">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <strong>{t('phoneNumber')}</strong>
                                        {variation.isRequired && (
                                          <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                            {t('req')}

                                          </div>
                                        )}
                                      </div>
                                      <Controller
                                        key={variation.id}
                                        name={variation.id}
                                        control={methods.control}
                                        render={({ field: { value, onChange } }) => (
                                          <PhoneNumber
                                            // label={t('phoneNumber')}
                                            country="us"
                                            value={value}
                                            labelClassName='font-medium'
                                            inputClassName="text-[16px] hover:!border-primary focus:!border-primary focus:!ring-primary text-sm [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                            className="input-placeholder text-[16px] w-full"
                                            {...methods.register(variation.id)}
                                            onChange={onChange}
                                            // @ts-ignore
                                            error={errorMassages.t(methods.formState.errors[variation.id]?.message)}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                              if (variation.buttonType === 5 && (variation.isActive)) {
                                return (
                                  <div key={variation.id} className="flex px-4 pt-0">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <strong>{variation.name}</strong>
                                        {variation.isRequired && (
                                          <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                            {t('req')}
                                          </div>
                                        )}
                                      </div>
                                      {/* <Input
                                              key={variation.id}
                                              label={variation.name}
                                              placeholder={variation.name}
                                              inputClassName="text-sm [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                              className="w-full"
                                              {...methods.register(variation.id)}
                                              error={String(methods.formState.errors[variation.id]?.message || '')}
                                          /> */}
                                      <Controller
                                        control={control}
                                        name={variation.id}
                                        render={({ field }) => (
                                          <Input
                                            // label={variation.name}
                                            {...register(variation.id)}
                                            {...field}
                                            placeholder={variation.name}
                                            inputClassName="text-[16px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                            className="input-placeholder text-[16px] w-full"
                                            error={errorMassages.t(String(methods.formState.errors[variation.id]?.message || ''))}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-3 justify-between items-center gap-5 p-3 bg-white w-full">
                      <div className={cn('bg-white rounded-bl-lg col-span-1 secShadow rtl:rounded-br-lg h-full', { 'rtl:rounded-bl-none': hasMoreDetails })}>
                        <QuantityHandler quantity={quantity} plusClassName={`${!(prodId?.hasStock || false) || (prodId.stockNumber - totalSoldQuantity > 0 && prodId.stockNumber - totalSoldQuantity - quantity >= 0) ? 'text-primary' : 'cursor-no-drop text-Color30 pointer-events-none'}`} setQuantity={setQuantity} className='w-full h-full rounded-lg' />
                      </div>
                      <div className={'col-span-2'}>
                        <ItemPrice
                          type={type}
                          buttonType="submit"
                          price={<div className={` items-center gap-1 ${lang === 'ar' ? 'flex' : 'flex'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            <span>{finalPrice}</span>
                            {currencyAbbreviation === 'ر.س' ? (
                              <Image src={sarIcon1} alt="SAR" width={16} height={16} />
                            ) : (
                              <span>{currencyAbbreviation}</span>
                            )}
                            </div>
                          }
                          // oldPrice={` ${finalOldPrice}` ? `${finalOldPrice} ${currencyAbbreviation}`:''}
                          // oldPrice={finalOldPrice ? abbreviation && toCurrency(finalOldPrice, lang, abbreviation) : ''}
                          className={`${!(prodId?.hasStock || false) || (prodId.stockNumber - totalSoldQuantity > 0 && prodId.stockNumber - totalSoldQuantity - quantity >= 0) ? '' : 'cursor-no-drop bg-slate-400'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </form>
        </FormProvider>
      </div>

      {/* Mobile Modal */}
      <div className="md:hidden">
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50  z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.015 }}
          onClick={handleOutsideClick}

        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: isOpen ? 0 : '100%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', duration: 0.2 }}
          className="fixed bottom-0 right-0 left-0 flex items-end z-[10000] overflow-hidden"
        >
          {/* > */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="bg-white rounded-lg b-4 w-full max-h-svh flex flex-col overflow-y-auto custom-scroll"
          >
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="relative">

                  {isImageVisible ? (
                    <div className="w-full h-60">
                      {prodId?.imageUrl ?
                      <>
                        <div className="relative w-full h-full">
                          <img
                            src={prodId?.imageUrl}
                            alt="Product Image"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                        {prodId.isDiscountActive===true &&
                         <p
                         className="bg-white rounded-xl py-2 px-3 absolute top-3 font-semibold end-2 hover:cursor-pointer"
                            
                            >
                              {lang==='ar'?'خصم':'save'}{" "}
                            {prodId.discountType ===0 ?
                           ` ${prodId.discount} %`
                           :
                           `${prodId.discount} ${currencyAbbreviation === 'ر.س' ? (
                              <Image src={sarIcon} alt="SAR" width={12} height={12} />
                            ) : (
                              <span>{currencyAbbreviation}</span>
                            )}`
                          }
                          </p>
                        }
                          </>
                        :
                        <div className="bg-white shadow-md rounded-lg p-2">
                          <Skeleton height={200} className="w-full rounded-lg " />
                        </div>

                      }
                    </div>
                  ) : (
                    <div className="w-full h-16 fixed top-0 start-0 right-0 flex items-center bg-white secShadow z-50">
                      <h3 className="text-xl font-bold leading-10 text-start ps-14">{prodId?.name}</h3>
                    </div>
                  )}
                  <X
                    onClick={handleClose}
                    className={`bg-white rounded-full p-2 ${isImageVisible ? 'fixed top-2 start-2' : 'fixed top-3.5 start-2 z-[100]'}`}
                    size={36}
                  />
                </div>

                <div className={`flex-1 px-4 pb-20 ${isImageVisible ? 'pt-4' : 'pt-60'}`}>
                  <div className="flex items-center gap-2">
                    {prodId?.isTopSelling && <Badge Icon={Flame} title={lang === 'ar' ? "الأعلى مبيعًا" : "Top Sale"} className="-ms-1" />}
                    {prodId?.isTopRated && <Badge Icon={Star} title={lang === 'ar' ? "الأعلى تقييمًا" : "Top Rated"} className="-ms-1" />}
                  </div>
                  <h3 className="text-xl font-bold leading-10">{prodId?.name}</h3>
                  <p className="text-sm font-medium text-black/75">{prodId?.description}</p>

                  {/* Variations rendering for mobile */}
                  <div className="pt-6">
                    {prodId?.variations && (
                      <>
                        <div className="flex flex-col gap-3">
                          {prodId.variations.map((variation: Variation) => {
                            {/* PC Product Variation buttonType 0 */ }
                            if (variation.buttonType === 0 && (variation.isActive)) {
                              const options: Option[] = variation.choices.map((choice: Choice) => ({
                                label: (
                                  <div className="flex flex-col justify-center items-center">
                                    {choice.imageUrl ? (
                                      <>
                                        <CustomImage
                                          src={choice.imageUrl}
                                          alt={choice.name || "Radio"}
                                          width={600}
                                          height={350}
                                          className="w-20 h-20 object-cover"
                                        />
                                        <div className="">
                                          <p className='text-center'>{choice.name}</p>
                                          {/* {choice.price && <small>{abbreviation && toCurrency(\\ */}
                                          <p className='flex items-center gap-1'>

                                            {choice.price}{" "}{currencyAbbreviation === 'ر.س' ? (
                              <Image src={sarIcon} alt="SAR" width={12} height={12} />
                            ) : (
                              <span>{currencyAbbreviation}</span>
                            )}
                                          </p>
                                          {/* {choice.price && <small>{abbreviation && toCurrency(choice.price, lang, abbreviation)}</small>} */}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="h-10">
                                        <p className='text-center'>{choice.name}</p>
                                        {/* {choice.price && <small>{abbreviation && toCurrency(\\ */}
                                        <p className='flex items-center gap-1'>

                                          {choice.price}{" "}{currencyAbbreviation === 'ر.س' ? (
                              <Image src={sarIcon} alt="SAR" width={12} height={12} />
                            ) : (
                              <span>{currencyAbbreviation}</span>
                            )}
                                        </p>
                                        {/* {choice.price && <small>{abbreviation && toCurrency(choice.price, lang, abbreviation)}</small>} */}
                                      </div>
                                    )
                                    }
                                  </div>
                                ),
                                value: choice.id,
                              }));
                              return (
                                <div key={variation.id} className="flex">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <strong>{t('choiceof')} {variation.name}</strong>
                                      {variation.isRequired && (
                                        <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-black/75">{t('Choose1')}</span>
                                    <div>
                                      <GetRadio lang={lang} name={variation.id} options={options} />
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            if (variation.buttonType === 1 && (variation.isActive)) {
                              return <>
                                <div key={variation.id} className="flex pt-0">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      {/* <strong>Your choice of: {variation.name}</strong> */}
                                      <strong>{t('choiceof')} {variation.name}</strong>
                                      {variation.isRequired && (
                                        <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    <Controller
                                      key={variation.id}
                                      name={variation.id}
                                      control={methods.control}
                                      render={({ field, fieldState }) => (
                                        <RoleSelect
                                          // label={variation.name}

                                          options={variation.choices as { id: string; name: string }[]}
                                          field={{
                                            ...field,
                                            value: typeof field.value === "string" ? field.value : "", // Ensure field.value is a string
                                          }}
                                          error={errorMassages.t(String(methods.formState.errors[variation.id]?.message || ''))}
                                          placeholder={variation.name}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              </>
                            }
                            if (variation.buttonType === 3 && (variation.isActive)) {
                              return (
                                <div key={variation.id} className="flex pt-0">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <strong>{variation.name}</strong>
                                      {variation.isRequired && (
                                        <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    {/* <Input
                                      key={variation.id}
                                      label={variation.name}
                                      placeholder={variation.name}
                                      inputClassName="text-sm [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                      className="w-full"
                                      {...methods.register(variation.id)}
                                      error={String(methods.formState.errors[variation.id]?.message || '')}
                                    /> */}
                                    <Controller
                                      control={control}
                                      name={variation.id}
                                      render={({ field }) => (
                                        <Input
                                          // label={variation.name}
                                          {...register(variation.id)}
                                          {...field}
                                          placeholder={variation.name}
                                          inputClassName="text-[16px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                          className="input-placeholder text-[16px] w-full"
                                          error={errorMassages.t(String(methods.formState.errors[variation.id]?.message || ''))}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              );
                            }
                            if (variation.buttonType === 4 && (variation.isActive)) {
                              return (
                                <div key={variation.id} className="flex pt-0">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <strong>{t('phoneNumber')}</strong>
                                      {variation.isRequired && (
                                        <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    <Controller
                                      key={variation.id}
                                      name={variation.id}
                                      control={methods.control}
                                      render={({ field: { value, onChange } }) => (
                                        <PhoneNumber
                                          // label={t('phoneNumber')}
                                          country="us"
                                          value={value}
                                          inputClassName="text-sm hover:!border-primary focus:!border-primary focus:!ring-primary text-sm [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                          className="w-full"
                                          {...methods.register(variation.id)}
                                          onChange={onChange}
                                          // @ts-ignore
                                          error={errorMassages.t(methods.formState.errors[variation.id]?.message)}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              );
                            }
                            if (variation.buttonType === 5 && (variation.isActive)) {
                              return (
                                <div key={variation.id} className="flex pt-0">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <strong>{variation.name}</strong>
                                      {variation.isRequired && (
                                        <div className="text-white bg-primary px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    {/* <Input
                                      key={variation.id}
                                      label={variation.name}
                                      placeholder={variation.name}
                                      inputClassName="text-sm [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                      className="w-full"
                                      {...methods.register(variation.id)}
                                      error={String(methods.formState.errors[variation.id]?.message || '')}
                                    /> */}
                                    <Controller
                                      control={control}
                                      name={variation.id}
                                      render={({ field }) => (
                                        <Input
                                          // label={variation.name}
                                          {...register(variation.id)}
                                          {...field}
                                          placeholder={variation.name}
                                          inputClassName="text-[16px] [&.is-hover]:border-primary [&.is-focus]:border-primary [&.is-focus]:ring-primary"
                                          className="input-placeholder w-full text-[16px]"
                                          error={errorMassages.t(String(methods.formState.errors[variation.id]?.message || ''))}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  <SpecialNotes
                    lang={lang!}
                    className="pt-4 pb-2 col-span-full gap-2"
                    notes={notes}
                    setNotes={setNotes}
                  />
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-5 secShadow bg-white rounded-b-lg z-[10001]">
                  <div className="grid grid-cols-3 justify-between items-center gap-5 w-full">
                    <div className={cn('bg-white rounded-bl-lg col-span-1 secShadow rtl:rounded-br-lg h-full', { 'rtl:rounded-bl-none': hasMoreDetails })}>
                      <QuantityHandler plusClassName={`${!(prodId?.hasStock || false) || (prodId.stockNumber - totalSoldQuantity > 0 && prodId.stockNumber - totalSoldQuantity - quantity >= 0) ? 'text-primary' : 'cursor-no-drop text-Color30 pointer-events-none'}`} quantity={quantity} setQuantity={setQuantity} className='w-full h-full rounded-lg' />
                    </div>
                    <div className={'col-span-2'}>
                       <ItemPrice
                          type={type}
                          buttonType="submit"
                          price={<div className={` items-center gap-1 ${lang === 'ar' ? 'flex' : 'flex'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            <span>{finalPrice}</span>
                            {currencyAbbreviation === 'ر.س' ? (
                              <Image src={sarIcon1} alt="SAR" width={16} height={16} />
                            ) : (
                              <span>{currencyAbbreviation}</span>
                            )}
                            </div>
                          }
                          // oldPrice={` ${finalOldPrice}` ? `${finalOldPrice} ${currencyAbbreviation}`:''}
                          // oldPrice={finalOldPrice ? abbreviation && toCurrency(finalOldPrice, lang, abbreviation) : ''}
                          className={`${!(prodId?.hasStock || false) || (prodId.stockNumber - totalSoldQuantity > 0 && prodId.stockNumber - totalSoldQuantity - quantity >= 0) ? '' : 'cursor-no-drop bg-slate-400'}`}
                        />
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

export default POSModal;