'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Element } from 'react-scroll';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Text } from 'rizzui';
import cn from '@utils/class-names';
import FormNav, {
  formParts,
} from '@/app/shared/ecommerce/product/create-edit/form-nav';
import ProductSummary from '@/app/shared/ecommerce/product/create-edit/product-summary';
import { defaultValues } from '@/app/shared/ecommerce/product/create-edit/form-utils';
import ProductMedia from '@/app/shared/ecommerce/product/create-edit/product-media';
import PricingInventory from '@/app/shared/ecommerce/product/create-edit/pricing-inventory';
import ProductSeo from '@/app/shared/ecommerce/product/create-edit/product-seo';
import ProductVariants from '@/app/shared/ecommerce/product/create-edit/product-variants';
import FormFooter from '@components/form-footer';
import {
  ButtonType,
  CreateProductInput,
  productFormSchema,
} from '@/validators/create-product.schema';
import { useLayout } from '@/layouts/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';
import axiosClient from '@/app/components/context/api';
import axios from 'axios';
import { Image_BASE_URL } from '@/config/base-url';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';

const shopId = GetCookiesClient('shopId');

const MAP_STEP_TO_COMPONENT = {
  [formParts.summary]: ProductSummary,
  [formParts.media]: ProductMedia,
  [formParts.pricing]: PricingInventory,
  // [formParts.productIdentifiers]: ProductIdentifiers,
  // [formParts.shipping]: ShippingInfo,
  [formParts.seo]: ProductSeo,
  // [formParts.deliveryEvent]: DeliveryEvent,
  [formParts.variantOptions]: ProductVariants,
  // [formParts.tagsAndCategory]: ProductTaxonomies,
};
interface IndexProps {
  lang?: string;
  className?: string;
  currencyAbbreviation?: string;
  initialProduct: any;
  allProducts?: any;
  languages: number;
}

async function fetchProductById(shopId: string, productId: string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Products/GetById/${shopId}/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default function EditProduct({
  lang = 'en',
  initialProduct,
  className,
  currencyAbbreviation,
  allProducts,
  languages,
}: IndexProps) {
  // console.log("product: ", product);
  // console.log("allProducts: ",allProducts);


  const text = {
    success: lang === 'ar' ? 'المنتج بنجاح' : 'Product successfully',
    updated: lang === 'ar' ? 'تم تعديل' : 'updated',
    update: lang === 'ar' ? 'تعديل منتج' : 'Update Product',
  }
  const { layout } = useLayout();
  const [isLoading, setLoading] = useState(false);
  const cookiebranches = GetCookiesClient('branches') as string;
  const cookiesBranches = JSON.parse(cookiebranches);
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    const loadLatestProduct = async () => {
      const latest = await fetchProductById(shopId as string, initialProduct.id);
      if (latest && JSON.stringify(latest) !== JSON.stringify(initialProduct)) {
        setProduct(latest);
      }
    };
    loadLatestProduct();
  }, [initialProduct]);
  
  const buttonTypeOptions = [
    { label: 'Radio', value: 0 },
    { label: 'Dropdown', value: 1 },
    { label: 'Checkbox', value: 2 },
    { label: 'Input', value: 3 },
    { label: 'Phone Number', value: 4 },
    { label: 'Email', value: 5 },
    { label: 'Date', value: 6 },
    { label: 'Image', value: 7 },
  ];
  const staticDefaultValues: CreateProductInput = {
    titleEn: product.nameEn,
    titleAr: product.nameAr,
    categories: product.categoryId,
    descriptionEn: product.descriptionEn,
    descriptionAr: product.descriptionAr,
    IsBarcode: product.barcode? true : false,
    Barcode: product.barcode,
    FrequentlyOrderedWith: product.frequentlyOrderedWith.map((product :any) => product.relatedProductId),
    productImages: product.images.map((image :any) => image.imageUrl),
    price: product.price,
    // oldPrice: product.oldPrice,
    IsDiscountActive: product.isDiscountActive,
    Discount: product.discount,
    DiscountType: product.discountType.toString(),
    HasStock: product.stocks.length == 0 ? false : true || false,
    StockNumber: product.stocks[0].stockNumber,
    BuyingPrice: product.buyingPrice || 0,
    // VAT: product.vat,
    // VATType: product.vatType.toString(),
    pageTitleEn: product.titleEn,
    pageTitleAr: product.titleAr,
    metaDescriptionEn: product.metaDescriptionEn,
    metaDescriptionAr: product.metaDescriptionAr,
    slugEn: product.slugEn,
    slugAr: product.slugAr,
    productVariants: product.variations.map((variation: any) => {
      const buttonTypeOption = buttonTypeOptions.find(option => option.value === variation.buttonType) || { label: 'Radio', value: 0 };
      return {
        id: variation.id,
        nameAr: variation.nameAr,
        nameEn: variation.nameEn,
        buttonType: buttonTypeOption,
        priority: variation.priority,
        isRequired: variation.isRequired,
        isActive: variation.isActive,
        choices: variation.choices.map((choice: any) => ({
          id: choice.id,
          nameAr: choice.nameAr,
          nameEn: choice.nameEn,
          price: choice.price,
          isDefault: choice.isDefault,
          isActive: choice.isActive,
          image: choice.imageUrl,
        })),
      };
    }),
  };  
  
  const methods = useForm<CreateProductInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: staticDefaultValues,
  });
  
  useEffect(() => {
    if (product) {
      methods.reset({
        titleEn: product.nameEn,
        titleAr: product.nameAr,
        categories: product.categoryId,
        descriptionEn: product.descriptionEn,
        descriptionAr: product.descriptionAr,
        IsBarcode: !!product.barcode,
        Barcode: product.barcode,
        FrequentlyOrderedWith: product.frequentlyOrderedWith.map((p: any) => p.relatedProductId),
        productImages: product.images.map((img: any) => img.imageUrl),
        price: product.price,
        BuyingPrice: product.buyingPrice || 0,
        HasStock: product.stocks.length !== 0,
        StockNumber: product.stocks[0].stockNumber,
        IsDiscountActive: product.isDiscountActive,
        Discount: product.discount,
        DiscountType: product.discountType?.toString() || '0',
        pageTitleEn: product.titleEn,
        pageTitleAr: product.titleAr,
        metaDescriptionEn: product.metaDescriptionEn,
        metaDescriptionAr: product.metaDescriptionAr,
        slugEn: product.slugEn,
        slugAr: product.slugAr,
        productVariants: product.variations.map((variation: any) => {
          const buttonTypeOption = buttonTypeOptions.find(opt => opt.value === variation.buttonType) || { label: 'Radio', value: 0 };
          return {
            id: variation.id,
            nameAr: variation.nameAr,
            nameEn: variation.nameEn,
            buttonType: buttonTypeOption,
            priority: variation.priority,
            isRequired: variation.isRequired,
            isActive: variation.isActive,
            choices: variation.choices.map((choice: any) => ({
              id: choice.id,
              nameAr: choice.nameAr,
              nameEn: choice.nameEn,
              price: choice.price,
              isDefault: choice.isDefault,
              isActive: choice.isActive,
              image: choice.imageUrl,
            })),
          };
        }),
      });
    }
  }, [product, methods.reset]);  

  const onSubmit: SubmitHandler<CreateProductInput> = async (values) => {
    setLoading(true);
    console.log("values: ",values);
    
    try {
      const formData = new FormData();
  
      if (languages === 0) {
        formData.append('NameAr', values.titleAr);
        formData.append('NameEn', values.titleAr);
        formData.append('TitleAr', values?.pageTitleAr || '');
        formData.append('TitleEn', values?.pageTitleAr || '');
        formData.append('DescriptionAr', values?.descriptionAr || '');
        formData.append('DescriptionEn', values?.descriptionAr || '');
        formData.append('MetaDescriptionAr', values?.metaDescriptionAr || '');
        formData.append('MetaDescriptionEn', values?.metaDescriptionAr || '');
        formData.append('SlugAr', values?.slugAr || '');
        formData.append('SlugEn', values?.slugAr || '');
      } else if (languages === 1) {
        formData.append('NameAr', values.titleEn);
        formData.append('NameEn', values.titleEn);
        formData.append('TitleAr', values?.pageTitleEn || '');
        formData.append('TitleEn', values?.pageTitleEn || '');
        formData.append('DescriptionAr', values?.descriptionEn || '');
        formData.append('DescriptionEn', values?.descriptionEn || '');
        formData.append('MetaDescriptionAr', values?.metaDescriptionEn || '');
        formData.append('MetaDescriptionEn', values?.metaDescriptionEn || '');
        formData.append('SlugAr', values?.slugEn || '');
        formData.append('SlugEn', values?.slugEn || '');
      }else {
        formData.append('NameAr', values.titleAr);
        formData.append('NameEn', values.titleEn);
        formData.append('TitleAr', values?.pageTitleAr || '');
        formData.append('TitleEn', values?.pageTitleEn || '');
        formData.append('DescriptionAr', values?.descriptionAr || '');
        formData.append('DescriptionEn', values?.descriptionEn || '');
        formData.append('MetaDescriptionAr', values?.metaDescriptionAr || '');
        formData.append('MetaDescriptionEn', values?.metaDescriptionEn || '');
        formData.append('SlugAr', values?.slugAr || '');
        formData.append('SlugEn', values?.slugEn || '');
      }
      if (values.IsBarcode) {
        formData.append('Barcode', values?.Barcode || '');
      }
      // formData.append('ShopId', shopId || "");
      formData.append("Price", values.price.toString());
      // formData.append("OldPrice", values.oldPrice.toString());
      formData.append("CategoryId", values.categories);
      formData.append('BuyingPrice', values?.BuyingPrice.toString());
      formData.append('HasStock', `${values?.HasStock}` || 'true');
      // if (values?.HasStock) {
      //   formData.append('StockNumber', values?.StockNumber? values?.StockNumber?.toString() : '0');
      // }
      formData.append('sourceChannel', '0');
      formData.append('IsDiscountActive', (!!values?.IsDiscountActive).toString());
      if (values.DiscountType && values?.IsDiscountActive) {
        formData.append('DiscountType', values.DiscountType);
      }
      if (values.Discount && values?.IsDiscountActive) {
        formData.append('Discount', values.Discount.toString());
      }
      // if (values.VATType) {
      //   formData.append('VATType', values.VATType);
      // }
      // if (values.VAT) {
      //   formData.append('VAT', values.VAT);
      // }
      formData.append("LastUpdatedAt", new Date().toISOString());

      values.productImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`Images[${index}].isPrimary`, index === 0 ? 'true' : 'false');
          formData.append(`Images[${index}].image`, image);
        } else if (typeof image === 'string') {
          const existingImage = product.images.find((img: any) => img.imageUrl === image);
          console.log("existingImage: ",existingImage);
          // const baseUrl = "https://ordratuserbucket.s3.eu-north-1.amazonaws.com/";
          
          
          if (existingImage) {
            const cleanImageUrl = existingImage.imageUrl.replace(Image_BASE_URL, "");
            formData.append(`Images[${index}].id`, existingImage.id);
            formData.append(`Images[${index}].ImageUrl`, cleanImageUrl);
          }
          formData.append(`Images[${index}].isPrimary`, index === 0 ? 'true' : 'false');
        }
      });

      values?.FrequentlyOrderedWith?.forEach((relatedProductId, index) => {
        if (relatedProductId) {
          formData.append(`FrequentlyOrderedWith[${index}].relatedProductId`, relatedProductId);
        }
      });
  
      values.productVariants?.forEach((variant, vIndex) => {
        console.log("variant: ",variant);
        if (!variant?.id) {
          formData.append(`Variations[${vIndex}].nameAr`, variant?.nameAr || "");
          formData.append(`Variations[${vIndex}].nameEn`, variant?.nameEn || "");
          formData.append(
            `Variations[${vIndex}].buttonType`,
            variant?.buttonType?.toString() || "0"
          );
          formData.append(
            `Variations[${vIndex}].priority`,
            variant?.priority?.toString() || "0"
          );
          formData.append(`Variations[${vIndex}].isRequired`, variant?.isRequired?.toString() || "true");
          formData.append(`Variations[${vIndex}].isActive`, variant?.isActive?.toString() || "true");
    
          variant?.choices?.forEach((choice, cIndex) => {
            formData.append(
              `Variations[${vIndex}].choices[${cIndex}].nameAr`,
              choice.nameAr
            );
            formData.append(
              `Variations[${vIndex}].choices[${cIndex}].nameEn`,
              choice.nameEn
            );
            formData.append(
              `Variations[${vIndex}].choices[${cIndex}].price`,
              choice.price.toString()
            );
            formData.append(
              `Variations[${vIndex}].choices[${cIndex}].isDefault`,
              choice.isDefault.toString()
            );
            formData.append(
              `Variations[${vIndex}].choices[${cIndex}].isActive`,
              choice.isActive.toString()
            );
            if (choice.image) {
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].image`,
                choice.image
              );
            }
          });
        }else{
          formData.append(`Variations[${vIndex}].id`, variant?.id || "");
          formData.append(`Variations[${vIndex}].nameAr`, variant?.nameAr || "");
          formData.append(`Variations[${vIndex}].nameEn`, variant?.nameEn || "");
          formData.append(
            `Variations[${vIndex}].buttonType`,
            variant?.buttonType?.toString() || "0"
          );
          formData.append(
            `Variations[${vIndex}].priority`,
            variant?.priority?.toString() || "0"
          );
          formData.append(`Variations[${vIndex}].isRequired`, variant?.isRequired?.toString() || "true");
          formData.append(`Variations[${vIndex}].isActive`, variant?.isActive?.toString() || "true");
    
          variant?.choices?.forEach((choice, cIndex) => {
            if (!choice?.id) {
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].nameAr`,
                choice.nameAr
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].nameEn`,
                choice.nameEn
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].price`,
                choice.price.toString()
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].isDefault`,
                choice.isDefault.toString()
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].isActive`,
                choice.isActive.toString()
              );
              if (choice.image) {
                formData.append(
                  `Variations[${vIndex}].choices[${cIndex}].image`,
                  choice.image
                );
              }
            }else{
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].id`,
                choice.id || ''
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].nameAr`,
                choice.nameAr
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].nameEn`,
                choice.nameEn
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].price`,
                choice.price.toString()
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].isDefault`,
                choice.isDefault.toString()
              );
              formData.append(
                `Variations[${vIndex}].choices[${cIndex}].isActive`,
                choice.isActive.toString()
              );
              
              if (choice.image instanceof File) {
                formData.append(
                  `Variations[${vIndex}].choices[${cIndex}].image`,
                  choice.image
                );
              } else if (typeof choice.image === 'string') {
                const existingVariant = product.variations.find((v: any) => v.id === variant.id);
                const existingChoice = existingVariant?.choices.find((c: any) => c.id === choice.id);

                if (existingChoice && existingChoice.imageUrl === choice.image) {
                  const cleanImageUrl = existingChoice.imageUrl.replace(Image_BASE_URL, "");
                  formData.append(`Variations[${vIndex}].choices[${cIndex}].ImageUrl`, cleanImageUrl);
                }

              }
              // if (choice.image) {
              //   formData.append(
              //     `Variations[${vIndex}].choices[${cIndex}].image`,
              //     choice.image
              //   );
              // }
            }
          });
        }
      });
      const entries = Array.from(formData.entries());
      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        console.log(`${key}:`, value);
      }       
      await axiosClient.put(
        `/api/Products/Update/${product.id}/${shopId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (cookiesBranches.length == 1 && values.HasStock == true) {
        const stockFormData = new FormData();
        stockFormData.append('StockNumber', values.StockNumber || '0');
        try {
          const responseStock = await axiosClient.put(`api/Stock/UpdateProductStock/${cookiesBranches[0].id}/${product.id}`, stockFormData);
          
          if (responseStock) {
            const updatedProduct = await fetchProductById(shopId as string, product.id);
            if (updatedProduct) {
              methods.reset({
                titleEn: updatedProduct.nameEn,
                titleAr: updatedProduct.nameAr,
                categories: updatedProduct.categoryId,
                descriptionEn: updatedProduct.descriptionEn,
                descriptionAr: updatedProduct.descriptionAr,
                IsBarcode: updatedProduct.barcode? true : false,
                Barcode: updatedProduct.barcode,
                FrequentlyOrderedWith: updatedProduct.frequentlyOrderedWith.map((product :any) => product.relatedProductId),
                productImages: updatedProduct.images.map((image :any) => image.imageUrl),
                price: updatedProduct.price,
                // oldPrice: updatedProduct.oldPrice,
                BuyingPrice: updatedProduct.buyingPrice || 0,
                HasStock: updatedProduct.stocks.length == 0 ? false : true || false,
                StockNumber: updatedProduct.stocks[0].stockNumber,
                IsDiscountActive: updatedProduct.isDiscountActive,
                Discount: updatedProduct.discount,
                DiscountType: updatedProduct.discountType.toString(),
                pageTitleEn: updatedProduct.titleEn,
                pageTitleAr: updatedProduct.titleAr,
                metaDescriptionEn: updatedProduct.metaDescriptionEn,
                metaDescriptionAr: updatedProduct.metaDescriptionAr,
                slugEn: updatedProduct.slugEn,
                slugAr: updatedProduct.slugAr,
                productVariants: updatedProduct.variations.map((variation: any) => {
                  const buttonTypeOption = buttonTypeOptions.find(option => option.value === variation.buttonType) || { label: 'Radio', value: 0 };
                  return {
                    id: variation.id,
                    nameAr: variation.nameAr,
                    nameEn: variation.nameEn,
                    buttonType: buttonTypeOption,
                    priority: variation.priority,
                    isRequired: variation.isRequired,
                    isActive: variation.isActive,
                    choices: variation.choices.map((choice: any) => ({
                      id: choice.id,
                      nameAr: choice.nameAr,
                      nameEn: choice.nameEn,
                      price: choice.price,
                      isDefault: choice.isDefault,
                      isActive: choice.isActive,
                      image: choice.imageUrl,
                    })),
                  };
                }),
              });
            }
        
            // Success message
            toast.success(lang === "ar" ? "تم تعديل المنتج بنجاح!" : "Product updated successfully!");  
          }  else {
            toast.error(
              lang === 'ar'
                ? `فشل في التغيير  `
                : `Failed to change `
            );
          }
        } catch (error) {
          console.error('Error Change Stock Number:', error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء تغيير عدد المخزون' : 'An error occurred while change stock number');
        }finally{
          setLoading(false);
        }
      }else {
        const updatedProduct = await fetchProductById(shopId as string, product.id);
        if (updatedProduct) {
          methods.reset({
            titleEn: updatedProduct.nameEn,
            titleAr: updatedProduct.nameAr,
            categories: updatedProduct.categoryId,
            descriptionEn: updatedProduct.descriptionEn,
            descriptionAr: updatedProduct.descriptionAr,
            IsBarcode: updatedProduct.barcode? true : false,
            Barcode: updatedProduct.barcode,
            FrequentlyOrderedWith: updatedProduct.frequentlyOrderedWith.map((product :any) => product.relatedProductId),
            productImages: updatedProduct.images.map((image :any) => image.imageUrl),
            price: updatedProduct.price,
            // oldPrice: updatedProduct.oldPrice,
            BuyingPrice: updatedProduct.buyingPrice || 0,
            HasStock: updatedProduct.stocks.length == 0 ? false : true || false,
            StockNumber: updatedProduct.stocks[0].stockNumber,
            IsDiscountActive: updatedProduct.isDiscountActive,
            Discount: updatedProduct.discount,
            DiscountType: updatedProduct.discountType.toString(),
            pageTitleEn: updatedProduct.titleEn,
            pageTitleAr: updatedProduct.titleAr,
            metaDescriptionEn: updatedProduct.metaDescriptionEn,
            metaDescriptionAr: updatedProduct.metaDescriptionAr,
            slugEn: updatedProduct.slugEn,
            slugAr: updatedProduct.slugAr,
            productVariants: updatedProduct.variations.map((variation: any) => {
              const buttonTypeOption = buttonTypeOptions.find(option => option.value === variation.buttonType) || { label: 'Radio', value: 0 };
              return {
                id: variation.id,
                nameAr: variation.nameAr,
                nameEn: variation.nameEn,
                buttonType: buttonTypeOption,
                priority: variation.priority,
                isRequired: variation.isRequired,
                isActive: variation.isActive,
                choices: variation.choices.map((choice: any) => ({
                  id: choice.id,
                  nameAr: choice.nameAr,
                  nameEn: choice.nameEn,
                  price: choice.price,
                  isDefault: choice.isDefault,
                  isActive: choice.isActive,
                  image: choice.imageUrl,
                })),
              };
            }),
          });
        }
    
        // Success message
        toast.success(lang === "ar" ? "تم تعديل المنتج بنجاح!" : "Product updated successfully!");  
        setLoading(false);
      }      
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        lang === "ar"
          ? "فشل في تعديل المنتج، حاول مرة أخرى."
          : "Failed to update product. Please try again."
      );
      setLoading(false);
    }
  };  

  return (
    <div className="@container bg-white border border-muted rounded-lg p-1">
      <FormNav
        className={cn(
          layout === LAYOUT_OPTIONS.BERYLLIUM && 'z-[999] 2xl:top-[72px]'
        )}
        lang={lang}
      />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn(
            'relative z-[19] [&_label.block>span]:font-medium px-3',
            className
          )}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
              >
                {<Component className="pt-7 @2xl:pt-9 @3xl:pt-11" lang={lang} allProducts={allProducts} languages={languages} currencyAbbreviation={currencyAbbreviation} />}
              </Element>
            ))}
          </div>

          <FormFooter
            isLoading={isLoading}
            submitBtnText={text.update}
            cancel={true}
            hrefCancel={`/${lang}/storeProducts/products`}
            altBtnText={lang === 'ar' ? 'الغاء' : 'Cancel'}
          />
        </form>
      </FormProvider>
    </div>
  );
}
