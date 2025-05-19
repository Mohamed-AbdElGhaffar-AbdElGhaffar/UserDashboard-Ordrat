'use client';

import { useState } from 'react';
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
import ProductIdentifiers from '@/app/shared/ecommerce/product/create-edit/product-identifiers';
import ShippingInfo from '@/app/shared/ecommerce/product/create-edit/shipping-info';
import ProductSeo from '@/app/shared/ecommerce/product/create-edit/product-seo';
import DeliveryEvent from '@/app/shared/ecommerce/product/create-edit/delivery-event';
import ProductVariants from '@/app/shared/ecommerce/product/create-edit/product-variants';
import ProductTaxonomies from '@/app/shared/ecommerce/product/create-edit/product-tags';
import FormFooter from '@components/form-footer';
import {
  CreateProductInput,
  productFormSchema,
} from '@/validators/create-product.schema';
import { useLayout } from '@/layouts/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';
import axiosClient from '@/app/components/context/api';
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
  slug?: string;
  className?: string;
  product?: CreateProductInput;
  allProducts?: any;
  languages: number;
}

export default function CreateEditProduct({
  slug,
  product,
  className,
  lang,
  allProducts,
  languages
}: IndexProps) {  

  const text = {
    success: lang === 'ar' ? 'المنتج بنجاح' : 'Product successfully',
    created: lang === 'ar' ? 'تم إنشاء' : 'created',
    updated: lang === 'ar' ? 'تم تعديل' : 'updated',
    add: lang === 'ar' ? 'اضافة منتج' : 'Add Product',
    update: lang === 'ar' ? 'تعديل منتج' : 'Update Product',
  }
  const { layout } = useLayout();
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<CreateProductInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues(product),
  });

  const onSubmit: SubmitHandler<CreateProductInput> = async (values) => {
    setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   console.log('product_values', values);
    //   toast.success(
    //     <Text as="b">{text.success} {slug ? text.updated : text.created}</Text>
    //   );
    //   methods.reset();
    // }, 600);
    console.log("values: ",values);
    
    const formData = new FormData();

    // Append basic product information
    formData.append('NameAr', values.titleAr);
    formData.append('NameEn', values.titleEn);
    formData.append('TitleAr', values?.pageTitleAr || '');
    formData.append('TitleEn', values?.pageTitleEn || '');
    formData.append('DescriptionAr', values?.descriptionAr || '');
    formData.append('DescriptionEn', values?.descriptionEn || '');
    if (values.IsBarcode) {
      formData.append('Barcode', values?.Barcode || '');
    }
    formData.append('MetaDescriptionAr', values?.metaDescriptionAr || '');
    formData.append('MetaDescriptionEn', values?.metaDescriptionEn || '');
    formData.append('Price', values?.price.toString());
    // formData.append('OldPrice', values?.oldPrice.toString());
    formData.append('BuyingPrice', values?.BuyingPrice.toString());
    formData.append('HasStock', `${values?.HasStock}` || 'false');
    // if (values?.HasStock) {
    //   formData.append('StockNumber', values?.StockNumber? values?.StockNumber?.toString() : '0');
    // }
    formData.append('sourceChannel', '0');
    
    // formData.append('CategoryId', values.categories);
    // formData.append('ShopId', '');
    formData.append('IsDiscountActive', (!!values?.IsDiscountActive).toString());
    if (values.DiscountType && values?.IsDiscountActive) {
      formData.append('DiscountType', values.DiscountType);
    }
    if (values.Discount && values?.IsDiscountActive) {
      formData.append('Discount', values.Discount);
    }
    // if (values.VATType) {
    //   formData.append('VATType', values.VATType);
    // }
    // if (values.VAT) {
    //   formData.append('VAT', values.VAT);
    // }
    // formData.append('Discount', '0'); // Assuming no discount
    // formData.append('VATType', '0'); // Adjust as needed
    // formData.append('VAT', '0'); // Adjust as needed

    // Append product images
    values.productImages.forEach((image, index) => {
      console.log("image: ",image);
      
      formData.append(`Images[${index}].isPrimary`, index === 0 ? 'true' : 'false');
      if (image instanceof File) {
        formData.append(`Images[${index}].image`, image);
      }
    });
    
    values?.FrequentlyOrderedWith?.forEach((relatedProductId, index) => {
      if (relatedProductId) {
        formData.append(`FrequentlyOrderedWith[${index}].relatedProductId`, relatedProductId);
      }
    });

    // Append product variations
    values.productVariants?.forEach((variant, vIndex) => {

      formData.append(`Variations[${vIndex}].nameAr`, variant?.nameAr || '');
      formData.append(`Variations[${vIndex}].nameEn`, variant?.nameEn || '');
      formData.append(`Variations[${vIndex}].buttonType`, variant?.buttonType?.toString() || '');
      formData.append(`Variations[${vIndex}].priority`, variant?.priority?.toString() || '');
      formData.append(`Variations[${vIndex}].isRequired`, variant?.isRequired? `${variant?.isRequired}` : 'false');
      formData.append(`Variations[${vIndex}].isActive`, variant?.isActive? `${variant?.isActive}` : 'false');

      // Append variant choices
      variant?.choices?.forEach((choice, cIndex) => {
        formData.append(`Variations[${vIndex}].choices[${cIndex}].nameAr`, choice.nameAr);
        formData.append(`Variations[${vIndex}].choices[${cIndex}].nameEn`, choice.nameEn);
        formData.append(`Variations[${vIndex}].choices[${cIndex}].price`, choice.price.toString());
        formData.append(`Variations[${vIndex}].choices[${cIndex}].isDefault`, choice.isDefault? choice.isDefault.toString() : 'false');
        formData.append(`Variations[${vIndex}].choices[${cIndex}].isActive`, choice.isActive? choice.isActive.toString() : 'false');
        if (choice.image) {
          formData.append(`Variations[${vIndex}].choices[${cIndex}].image`, choice.image);
        }
      });
    });

    try {
      const response = await axiosClient.post(`/api/Products/Create/${shopId}/${values.categories}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(
        lang === 'ar' ? 'تم إنشاء المنتج بنجاح!' : 'Product created successfully!'
      );
      setLoading(false);
      methods.reset();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
    
      if (errorMessage === "Sorry, You have exceed the limit of add product") {
        toast.error(
          lang === 'ar'
            ? 'عذراً، لقد تجاوزت الحد المسموح به لإضافة المنتجات'
            : 'Sorry, you have exceeded the product addition limit.'
        );
      } else {
        toast.error(
          lang === 'ar'
            ? 'فشل في إنشاء المنتج. حاول مجدداً.'
            : 'Failed to create product. Please try again.'
        );
      }
    
      console.error('API Error:', errorMessage || error);
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
                {<Component className="pt-7 @2xl:pt-9 @3xl:pt-11" lang={lang} allProducts={allProducts} languages={languages} />}
              </Element>
            ))}
          </div>

          <FormFooter
            isLoading={isLoading}
            submitBtnText={slug ? text.update : text.add}
          />
        </form>
      </FormProvider>
    </div>
  );
}
