'use client';

import { PiXBold, PiArrowsClockwiseBold, PiPlusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from '../../branch/branchTableForm/TableForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader, Loader2 } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import RadioSelection from '@/app/components/ui/radioSelect/radioSelect';
import theme1 from '@public/assets/category-designs/theme-1.png';
import theme2 from '@public/assets/category-designs/theme-2.png';
import theme3 from '@public/assets/category-designs/theme-3.png';
import UploadZone from '@/app/components/ui/uploadZone/uploadZone';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import CustomSelect from '@/app/components/ui/customForms/CustomSelect';

type TableFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  id: string;
  languages: number;
};
export type Option = {
  label: string
  value: boolean
}

export default function UpdateCategoryForm({
  title,
  onSuccess,
  lang = 'en',
  id,
  languages
}: TableFormProps) {
  const shopId = GetCookiesClient('shopId');
  const { closeModal } = useModal();
  const text = {
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    TitleEn: lang === 'ar' ? 'عنوان صفحة القسم (انجليزي)' : 'Page Title (English)',
    TitleAr: lang === 'ar' ? 'عنوان صفحة القسم (عربي)' : 'Page Title (Arabic)',
    MetaDescriptionEn: lang === 'ar' ? 'وصف صفحة القسم (انجليزي)' : 'Meta Description (English)',
    MetaDescriptionAr: lang === 'ar' ? 'وصف صفحة القسم (عربي)' : 'Meta Description (Arabic)',
    Priority: lang === 'ar' ? 'الترتيب' : 'Priority',
    NumberOfColumns: lang === 'ar' ? 'شكل القسم' : 'Category Design',
    ShowAllProducts: lang === 'ar' ? 'اظهار جميع المنتجات' : 'Show All Products',
    manualSeo: lang === 'ar' ? 'تحرير يدوي ل محركات البحث' : 'Manual SEO',
    autoSeo: lang === 'ar' ? 'تحسين تلقائي ل محركات البحث' : 'Automatic SEO',
    active: lang === 'ar' ? 'مفعل' : 'Actived',
    deactive: lang === 'ar' ? 'غير مفعل' : 'Deactived',
    Banner: lang === 'ar' ? 'صورة البانر' : 'Banner Image',
    
    submit: lang === 'ar' ? 'تعديل' : 'Update',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const { setCategoriesData } = useUserContext();

  const mainFormSchema = Yup.object().shape({
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    TitleEn: Yup.string().required(text.TitleEn + ' ' + requiredMessage),
    TitleAr: Yup.string().required(text.TitleAr + ' ' + requiredMessage),
    MetaDescriptionEn: Yup.string().required(text.MetaDescriptionEn + ' ' + requiredMessage),
    MetaDescriptionAr: Yup.string().required(text.MetaDescriptionAr + ' ' + requiredMessage),
    Priority: Yup.number().required(text.Priority + ' ' + requiredMessage),
    NumberOfColumns: Yup.string().required(text.NumberOfColumns + ' ' + requiredMessage),
    productImages: Yup.array().of(
      Yup.mixed().test('is-string-or-file', 'Must be a string or file', value =>
        typeof value === 'string' || value instanceof File
      )
    ).min(1, lang === 'ar' ? 'يجب رفع صورة واحدة على الأقل' : 'At least one image is required'),
  });
  
  const mainFormik = useFormik({
    initialValues: {
      nameEn: '',
      nameAr: '',
      TitleEn: '',
      TitleAr: '',
      MetaDescriptionEn: '',
      MetaDescriptionAr: '',
      checkSeo: true,
      Priority: undefined,
      NumberOfColumns: '',
      ShowAllProducts: false,
      productImages: [] as (string | File)[],
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      console.log("values: ",values);
      setSubmit(true);
      try {
        // Create FormData
        const formData = new FormData();
        formData.append('NameEn', languages === 0? values.nameAr : values.nameEn);
        formData.append('NameAr', languages === 1? values.nameEn : values.nameAr);
        formData.append('TitleEn', languages === 0? values.TitleAr : values.TitleEn);
        formData.append('TitleAr', languages === 1? values.TitleEn : values.TitleAr);
        formData.append('MetaDescriptionEn', languages === 0? values.MetaDescriptionAr : values.MetaDescriptionEn);
        formData.append('MetaDescriptionAr', languages === 1? values.MetaDescriptionEn : values.MetaDescriptionAr);
        formData.append('Priority', String(values.Priority));
        formData.append('NumberOfColumns', values.NumberOfColumns);
        formData.append('ShowAllProducts',  String(values.ShowAllProducts));
  
        // ✅ Append the first image as "Banner" (only one image allowed)
        if (values.productImages.length > 0 && typeof values.productImages[0] != 'string' ) {
          const bannerFile = values.productImages[0];
          formData.append('Banner', bannerFile);
        }
  
  
        // ✅ Send data using axiosClient
        const response = await axiosClient.put(`/api/Category/Update/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        toast.success(lang === 'ar' ? 'تم تعديل القسم بنجاح!' : 'Category udated successfully!');
        setCategoriesData(true);
        closeModal();
        setSubmit(false);
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(lang === 'ar' ? 'فشل في تعديل القسم، حاول مرة أخرى.' : 'Failed to udate category. Please try again.');
        setSubmit(false);
      }
    },
  });

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(
        `/api/Category/GetCategoryById/${id}`,
        {
          headers: {
            'Accept-Language': lang,
          },
        }
      );
      const imageUrl = data.bannerUrl ? [data.bannerUrl] : [];
      const autoSeo =
      data.titleEn === data.nameEn &&
      data.metaDescriptionEn === data.nameEn &&
      data.titleAr === data.nameAr &&
      data.metaDescriptionAr === data.nameAr;

      mainFormik.setValues({
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        TitleAr: data.titleAr,
        TitleEn: data.titleEn,
        MetaDescriptionAr: data.metaDescriptionAr,
        MetaDescriptionEn: data.metaDescriptionEn,
        checkSeo: autoSeo,
        Priority: data.priority,
        ShowAllProducts: data.showAllProducts,
        NumberOfColumns: `${data.numberOfColumns}`,
        productImages: imageUrl || [],
      });
    } catch (error) {
      toast.error('Failed to load category data.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategory();
  }, [id]); 
  
  useEffect(() => {
    if (languages === 0) {
      mainFormik.setFieldValue('nameEn', 'no data');
      mainFormik.setFieldValue('TitleEn', 'no data');
      mainFormik.setFieldValue('MetaDescriptionEn', 'no data');
    } else if (languages === 1) {
      mainFormik.setFieldValue('nameAr', 'no data');
      mainFormik.setFieldValue('TitleAr', 'no data');
      mainFormik.setFieldValue('MetaDescriptionAr', 'no data');
    }
  }, [languages]);
  
  useEffect(() => {
    if (mainFormik.values.checkSeo) {
      mainFormik.setFieldValue('TitleEn', mainFormik.values.nameEn || '');
      mainFormik.setFieldValue('MetaDescriptionEn', mainFormik.values.nameEn || '');
    }
  }, [mainFormik.values.nameEn, mainFormik.values.checkSeo]);
  
  useEffect(() => {
    if (mainFormik.values.checkSeo) {
      mainFormik.setFieldValue('TitleAr', mainFormik.values.nameAr || '');
      mainFormik.setFieldValue('MetaDescriptionAr', mainFormik.values.nameAr || '');
    }
  }, [mainFormik.values.nameAr, mainFormik.values.checkSeo]);
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-primary" width={40} height={40} />
      </div>
    );
  }
  const ShowAllProducts: Option[] = [
    { label: text.active, value: true },
    { label: text.deactive, value: false },
  ];
  const categoryOptions = [
    { 
      value: lang === "ar" ?'1' : '1', 
      label: lang === "ar" ?'الشكل 1' : 'Design 1', 
      image: theme1, 
      class: 'border-blue-500 bg-blue-100', 
    },
    { 
      value: lang === "ar" ?'2' : '2', 
      label: lang === "ar" ?'الشكل 2' : 'Design 2', 
      image: theme2, 
      class: 'border-green-500 bg-green-100', 
      bgColor: 'green-100' 
    },
    { 
      value: lang === "ar" ?'3' : '3', 
      label: lang === "ar" ?'الشكل 3' : 'Design 3', 
      image: theme3, 
      class: 'border-red-500 bg-red-100', 
    },
  ];  
  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>
          <UploadZone
            className="col-span-full mb-3"
            name="productImages"
            files={mainFormik.values.productImages}
            setFiles={(files) => mainFormik.setFieldValue("productImages", files)}
            error={mainFormik.touched.productImages && mainFormik.errors.productImages ? mainFormik.errors.productImages : ""}
            lang={lang}
            multiple={false}
            label={text.Banner}
            recommendedDimensions="1000×500"
            recommendedDimensionsTitle={lang=='ar'?'الأبعاد المثلى: ':'Recommended dimensions: '}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages!=1 &&(
              <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            )}
            {languages!=0 &&(
              <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            )}
            <Input type='number' label={text.Priority} placeholder={text.Priority} name="Priority" value={mainFormik.values.Priority} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.Priority && mainFormik.errors.Priority ? mainFormik.errors.Priority : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            {/* NumberOfColumns Component Radio */}
            <div className="mt-0.5">
              <label className='font-medium'>{text.ShowAllProducts}</label>
              <CustomSelect
                id='isActive'
                name='isActive'
                lang={lang}
                InputClass='mt-1.5'
                options={ShowAllProducts}
                value={ShowAllProducts.find(option => option.value === mainFormik.values.ShowAllProducts as any)}
                placeholder={text.ShowAllProducts}
                onBlur={mainFormik.handleBlur}
                onChange={(option: Option) => mainFormik.setFieldValue('ShowAllProducts', option?.value)}
                styles={{
                  control: (provided: any, state: any) => ({
                    ...provided,
                    fontSize: '16px',
                    borderColor: state.isFocused ? '#E84654' : '#ccc',
                    boxShadow: state.isFocused ? '0 0 0 1px #E84654' : 'none',
                    '&:hover': {
                      borderColor: '#E84654',
                    },
                  }),
                  option: (provided: any, state: any) => ({
                    ...provided,
                    fontSize: '16px',
                    backgroundColor: state.isFocused
                      ? '#EF838D'
                      : state.isSelected
                        ? '#E84654'
                        : 'white',
                    color: state.isFocused || state.isSelected ? 'white' : 'black',
                    '&:active': {
                      backgroundColor: '#E84654',
                      color: 'white',
                    },
                  }),

                }}
              />
            </div>
            <div className="col-span-full relative">
              <Switch
                name="checkSeo"
                checked={mainFormik.values.checkSeo}
                onChange={(e) => {
                  const checked = e.target.checked;
                  mainFormik.setFieldValue('checkSeo', checked);

                  if (checked) {
                    // When switched to auto, sync fields again
                    mainFormik.setFieldValue('TitleEn', mainFormik.values.nameEn || '');
                    mainFormik.setFieldValue('TitleAr', mainFormik.values.nameAr || '');
                    mainFormik.setFieldValue('MetaDescriptionEn', mainFormik.values.nameEn || '');
                    mainFormik.setFieldValue('MetaDescriptionAr', mainFormik.values.nameAr || '');
                  }
                }}
                label={!mainFormik.values.checkSeo ? text.manualSeo : text.autoSeo}
                className="col-span-full"
              />
            </div>
            {!mainFormik.values.checkSeo && (
              <>
                {languages!=1 &&(
                  <Input label={text.TitleAr} placeholder={text.TitleAr} name="TitleAr" value={mainFormik.values.TitleAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.TitleAr && mainFormik.errors.TitleAr ? mainFormik.errors.TitleAr : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                )}
                {languages!=0 &&(
                  <Input label={text.TitleEn} placeholder={text.TitleEn} name="TitleEn" value={mainFormik.values.TitleEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.TitleEn && mainFormik.errors.TitleEn ? mainFormik.errors.TitleEn : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                )}
                {languages!=1 &&(
                  <Input label={text.MetaDescriptionAr} placeholder={text.MetaDescriptionAr} name="MetaDescriptionAr" value={mainFormik.values.MetaDescriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.MetaDescriptionAr && mainFormik.errors.MetaDescriptionAr ? mainFormik.errors.MetaDescriptionAr : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                )}
                {languages!=0 &&(
                  <Input label={text.MetaDescriptionEn} placeholder={text.MetaDescriptionEn} name="MetaDescriptionEn" value={mainFormik.values.MetaDescriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.MetaDescriptionEn && mainFormik.errors.MetaDescriptionEn ? mainFormik.errors.MetaDescriptionEn : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                )}
              </>
            )}
          </div>
          <div className='mt-4'>
            <RadioSelection
              options={categoryOptions}
              formik={mainFormik}
              name="NumberOfColumns"
              error={mainFormik.errors.NumberOfColumns}
              lang={lang}
            />
          </div>


          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" className="w-full" disabled={submit}>
              {submit ? <Loader2 className="h-5 w-5 animate-spin" /> :<>{text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" /></>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
