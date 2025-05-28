import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Checkbox, Input, Switch, Textarea } from 'rizzui';
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
import ReactSelect from 'react-select';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
const shopId = GetCookiesClient('shopId');
const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
const QuillEditor = dynamic(() => import('@ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[143px]" />,
});

export default function ProductSummary({ className, lang, allProducts, languages }: { className?: string; lang?: string; allProducts?: any; languages?: number; }) {
  const text = {
    sectionTitle: lang === 'ar' ? "الملخص" : "Summary",
    sectionDescription: lang === 'ar' ? "أضف وصف المنتج والمعلومات الضرورية من هنا" : "Add your product description and necessary information from here",
    
    titleLabelEn: lang === 'ar' ? "الأسم (باللغة الإنجليزية)" : "Title (English)",
    titleLabelAr: lang === 'ar' ? "الأسم (باللغة العربية)" : "Title (Arabic)",
    placeholderTitleLabelEn: lang === 'ar' ? "اسم المنتج (باللغة الإنجليزية)" : "Product Title (English)",
    placeholderTitleLabelAr: lang === 'ar' ? "اسم المنتج (باللغة العربية)" : "Product Title (Arabic)",
    
    descriptionLabelEn: lang === "ar" ? "الوصف (باللغة الإنجليزية)" : "Description (English)",
    descriptionLabelAr: lang === "ar" ? "الوصف (باللغة العربية)" : "Description (Arabic)",
    descriptionPlaceholderEn:
      lang === "ar" ? "(باللغة الإنجليزية) أدخل وصف المنتج هنا..." : "Enter product description here (in English)...",
    descriptionPlaceholderAr:
      lang === "ar" ? "(باللغة العربية) أدخل وصف المنتج هنا..." : "Enter product description here (in Arabic)...",
    
    FrequentlyOrderedWith: lang === 'ar' ? "المنتجات ذات الصلة" : "Related Products",
    selectRelatedProducts: lang === 'ar' ? "اختر المنتجات ذات الصلة" : "Select related products",

    IsBarcode: lang === 'ar' ? "هل تريد اضافة باركود؟" : "Do you want to add Barcode?",
    Barcode: lang === 'ar' ? "الباركود" : "Barcode",
    HasStock: lang === 'ar' ? "لديها مخزون؟" : "Has Stock?",
    StockNumber: lang === 'ar' ? "عدد منتجات المخزون" : "Number of stock products",
    
    categorieLable: lang === 'ar' ? "الأقسام" : "Categories",
    placeholderCategorie: lang === 'ar' ? "اختر قسم" : "Select Category",
  }
  const {
    register,
    control,
    formState: { errors },
    setValue,
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
  console.log("errors: ",errors);

  const [categoryOption, setCategories] = useState([]);
  const [relatedProductsOptions, setRelatedProductsOptions] = useState<any[]>([]);

  // Transform allProducts to options format for ReactSelect
  useEffect(() => {
    if (allProducts && Array.isArray(allProducts)) {
      setRelatedProductsOptions(allProducts.map(product => ({
        value: product.id,
        label: lang=='ar'? product.nameAr : product.nameEn || product.title
      })));
    }
  }, [allProducts]);

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
  
  // console.log("errors: ",errors);
  const IsBarcode = useWatch({ name: 'IsBarcode' });
  const HasStock = useWatch({ name: 'HasStock' });
  const Barcode = useWatch({ name: 'Barcode' });
  const StockNumber = useWatch({ name: 'StockNumber' });
  // console.log("IsBarcode: ",IsBarcode);
  useEffect(() => {
    if (!IsBarcode && Barcode) {
      setValue('Barcode', null, { shouldValidate: true, shouldDirty: true });
    }
    if (!HasStock && StockNumber) {
      setValue('StockNumber', null, { shouldValidate: true, shouldDirty: true });
    }
  }, [IsBarcode, HasStock]);

  useEffect(() => {
    if (languages === 0) {
      setValue('titleEn', 'no data');
      setValue('descriptionEn', 'no data');
    } else if (languages === 1) {
      setValue('titleAr', 'no data');
      setValue('descriptionAr', 'no data');
    }
  }, [languages]);
  
  return (
    <FormGroup
      title={text.sectionTitle}
      description={text.sectionDescription}
      className={cn(className)}
    >
      {languages!=1 &&(
        <Input
          label={text.titleLabelAr}
          placeholder={text.placeholderTitleLabelAr}
          {...register('titleAr')}
          error={t(errors.titleAr?.message as string)}
        />
      )}
      {languages!=0 &&(
        <Input
          label={text.titleLabelEn}
          placeholder={text.placeholderTitleLabelEn}
          {...register('titleEn')}
          error={t(errors.titleEn?.message as string)}
        />
      )}
      {(languages==0 || languages==1) &&(
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
              // className="col-span-full"
              error={t(errors?.categories?.message as string)}
              getOptionValue={(option) => option.value}
              inPortal={false}
            />
          )}
        />
      )}
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
      {languages!=1 &&(
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
              error={t(errors.descriptionAr?.message as string)}
            />
          )}
        />
      )}
      {languages!=0 &&(
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
              error={t(errors.descriptionEn?.message as string)}
            />
          )}
        />
      )}
      {languages!=0 && languages!=1 &&(
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
              // className="col-span-full"
              error={t(errors?.categories?.message as string)}
              getOptionValue={(option) => option.value}
              inPortal={false}
            />
          )}
        />
      )}
      {relatedProductsOptions.length != 0 && (
        <div className={`${(languages==0 || languages==1)? 'col-span-full':'' }`}>
          <Controller
            name="FrequentlyOrderedWith"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-600 mb-1.5">
                  {text.FrequentlyOrderedWith}
                </label>
                <ReactSelect
                  isMulti
                  options={relatedProductsOptions}
                  value={relatedProductsOptions.filter((option) => 
                    value && Array.isArray(value) && value.includes(option.value)
                  )}
                  onChange={(selected) => {
                    const selectedValues = selected ? selected.map((item) => item.value) : [];
                    onChange(selectedValues);
                  }}
                  placeholder={text.selectRelatedProducts}
                  className="text-sm bg-[#f8f9fa]"
                  classNamePrefix="react-select"
                  // styles={{
                  //   control: (base) => ({
                  //     ...base,
                  //     backgroundColor: '#f8f9fa',
                  //   }),
                  // }}
                />
                {errors?.FrequentlyOrderedWith?.message && (
                  <span className="mt-1 text-xs text-red-500">
                    {t(errors.FrequentlyOrderedWith.message as string)}
                  </span>
                )}
              </div>
            )}
          />
        </div>
      )}
      <div className=''>
        <div className='flex items-center gap-4'>
          <label className='rizzui-input-label block text-sm font-medium'>
            {text.IsBarcode}
          </label>
          <Controller
            name="IsBarcode"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch
                // label={text.HasStock}
                className="h-full flex items-center"
                value={value}
                checked={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        {IsBarcode &&(
          <Input
            // label={text.Barcode}
            placeholder={text.Barcode}
            {...register('Barcode')}
            error={t(errors.Barcode?.message as string)}
          />
        )}
      </div>
      <div className=''>
        <div className='flex items-center gap-4'>
          <label className='rizzui-input-label block text-sm font-medium'>
            {text.StockNumber}
          </label>
          <Controller
            name="HasStock"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch
                // label={text.HasStock}
                className="h-full flex items-center"
                value={value}
                checked={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        {/* {HasStock && (
          <Input
            type="number"
            // label={text.StockNumber}
            placeholder={text.StockNumber}
            className='w-full'
            {...register('StockNumber', { valueAsNumber: true })}
            error={t(errors.StockNumber?.message as string)}
          />
        )} */}
      </div>

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
