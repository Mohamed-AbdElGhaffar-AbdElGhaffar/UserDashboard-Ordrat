import { Controller, useFormContext } from 'react-hook-form';
import { Input, Textarea } from 'rizzui';
import cn from '@utils/class-names';
import FormGroup from '@/app/shared/form-group';
// import {
//   categoryOption,
//   typeOption,
// } from '@/app/shared/ecommerce/product/create-edit/form-utils';
import dynamic from 'next/dynamic';
import SelectLoader from '@components/loader/select-loader';
import QuillLoader from '@components/loader/quill-loader';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';
import axiosClient from '@/app/components/context/api';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const QuillEditor = dynamic(() => import('@ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function ProductSummary({ className, lang }: { className?: string; lang?: string }) {
  const shopId = GetCookiesClient('shopId') as string;
  const text = {
    sectionTitle: lang === 'ar' ? "الملخص" : "Summary",
    sectionDescription: lang === 'ar' ? "أضف وصف المنتج والمعلومات الضرورية من هنا" : "Add your product description and necessary information from here",
    
    titleLabelEn: lang === 'ar' ? "الأسم (إنجليزي)" : "Title (English)",
    titleLabelAr: lang === 'ar' ? "الأسم (عربي)" : "Title (Arabic)",
    placeholderTitleLabelEn: lang === 'ar' ? "اسم المنتج (إنجليزي)" : "Product Title (English)",
    placeholderTitleLabelAr: lang === 'ar' ? "اسم المنتج (عربي)" : "Product Title (Arabic)",
    
    descriptionLabelEn: lang === "ar" ? "(إنجليزي) الوصف" : "Description (English)",
    descriptionLabelAr: lang === "ar" ? "(عربي) الوصف" : "Description (Arabic)",
    descriptionPlaceholderEn:
      lang === "ar" ? "(باللغة الإنجليزية) أدخل وصف المنتج هنا..." : "Enter product description here (in English)...",
    descriptionPlaceholderAr:
      lang === "ar" ? "(باللغة العربية) أدخل وصف المنتج هنا..." : "Enter product description here (in Arabic)...",
    
    categorieLable: lang === 'ar' ? "الأقسام" : "Categories",
    placeholderCategorie: lang === 'ar' ? "اختر قسم" : "Select Category",
  }
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation(lang!, 'form');
  // const categoryOption = [
  //   {
  //     value: 'fruits',
  //     label: 'Fruits',
  //   },
  //   {
  //     value: 'grocery',
  //     label: 'Grocery',
  //   },
  //   {
  //     value: 'meat',
  //     label: 'Meat',
  //   },
  //   {
  //     value: 'cat food',
  //     label: 'Cat Food',
  //   },
  // ];
  // console.log("errors: ",errors);

  const [categoryOption, setCategories] = useState([]);

  // Fetch categories using axiosClient
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await axiosClient.get(`/api/Category/GetAll/${shopId}`, {
          headers: { 'Accept-Language': lang },
        });

        // Transform response data to match Select options format
        setCategories(data.map((category: { id: any; name: any; }) => ({
          value: category.id,
          label: category.name,
        })));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, [lang]);
  
  
  return (
    <FormGroup
      title={text.sectionTitle}
      description={text.sectionDescription}
      className={cn(className)}
    >
      <Input
        label={text.titleLabelEn}
        placeholder={text.placeholderTitleLabelEn}
        {...register('titleEn')}
        error={t(errors.titleEn?.message as string)}
      />
      <Input
        label={text.titleLabelAr}
        placeholder={text.placeholderTitleLabelAr}
        {...register('titleAr')}
        error={t(errors.titleAr?.message as string)}
      />
      {/* <Input
        label="SKU"
        placeholder="Product sku"
        {...register('sku')}
        error={errors.sku?.message as string}
      />

      <Controller
        name="type"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            dropdownClassName="!z-0"
            options={typeOption}
            value={value}
            onChange={onChange}
            label="Product Type"
            error={errors?.type?.message as string}
            getOptionValue={(option) => option.value}
          />
        )}
      /> */}

      <Controller
        control={control}
        name="descriptionEn"
        render={({ field: { onChange, value } }) => (
          <Textarea
            value={value}
            onChange={onChange}
            label={text.descriptionLabelEn}
            placeholder={text.descriptionPlaceholderEn}
            className="col-span-full"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            error={errors.description?.message as string}
          />
        )}
      />
      <Controller
        control={control}
        name="descriptionAr"
        render={({ field: { onChange, value } }) => (
          <Textarea
            value={value}
            onChange={onChange}
            label={text.descriptionLabelAr}
            placeholder={text.descriptionPlaceholderAr}
            className="col-span-full"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            error={errors.description?.message as string}
          />
        )}
      />

      <Controller
        name="categories"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            options={categoryOption}
            value={categoryOption.find((option: any) => option.value === value)}
            onChange={onChange}
            label={text.categorieLable}
            placeholder={text.placeholderCategorie}
            className="col-span-full"
            error={t(errors?.categories?.message as string)}
            getOptionValue={(option) => option.value}
            inPortal={false}
          />
        )}
      />

      {/* <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <QuillEditor
            value={value}
            onChange={onChange}
            label="Description"
            className="col-span-full [&_.ql-editor]:min-h-[100px]"
            labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
          />
        )}
      /> */}
    </FormGroup>
  );
}
