  'use client';
  import { useTranslation } from '@/app/i18n/client';
  import WidgetCard from '@components/cards/widget-card';
  import { useFormik } from 'formik';
  import dynamic from 'next/dynamic';
  import React, { useEffect, useState } from 'react';
  import CustomInput from '../../ui/customForms/CustomInput';
  import { Button } from 'rizzui';
  import axiosClient from '../../context/api';
  import toast from 'react-hot-toast';
  import { AxiosError } from 'axios';
  import { termInfo } from '@/types';
  import { useUserContext } from '../../context/UserContext';
  import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';


  const QuillEditor = dynamic(() => import('@ui/quill-editor'), {
    ssr: false,
  });

  function Refund({ lang,languages }: { lang: string;languages:any }) {
    const shopId = GetCookiesClient('shopId');
    const { t } = useTranslation(lang!, 'policy');
    const [refundData, setRefundData] = useState<termInfo | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
const languageValue = Number(languages);

    const fetchContact = async () => {
      try {
        const response = await fetch(
          `https://testapi.ordrat.com/api/Term/GetByShopId/${shopId}?termType=1`
        );

        if (response.status === 204) {
          setIsCreateMode(true); // مفيش بيانات → هنبدأ بكرييت
          setRefundData(null);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          setRefundData(data);
          setIsCreateMode(false);
          formik.setValues({
            titleAr: data.titleAr || '',
            titleEn: data.titleEn || '',
            descriptionAr: data.descriptionAr || '',
            descriptionEn: data.descriptionEn || '',
            termType: 1,
            shopId,
          });
        }
      } catch (error) {
        console.error('Fetch error', error);
        toast.error(lang === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data');
      }
    };

    useEffect(() => {
      fetchContact();
    }, []);

    const formik = useFormik({
      initialValues: {
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        termType: 1,
        shopId,
      },
      onSubmit: async (values) => {
        const payload = {
          ...values,
          termType: 1,
          shopId,
        };

        try {
          if (isCreateMode) {
            // 🟢 Create
            const response = await axiosClient.post('/api/Term/Create', payload);
            toast.success(
              lang === 'ar'
                ? 'تم إنشاء سياسة الاسترجاع بنجاح!'
                : 'Refund Policy created successfully!'
            );
            setIsCreateMode(false); // بعد أول كرييت، نتحول لأبديت
            fetchContact();
          } else {
            // 🟡 Update
            if (!refundData) return;

            const isChanged =
              payload.titleAr !== refundData.titleAr ||
              payload.titleEn !== refundData.titleEn ||
              payload.descriptionAr !== refundData.descriptionAr ||
              payload.descriptionEn !== refundData.descriptionEn;

            if (!isChanged) {
              toast.error(lang === 'ar' ? 'لم يتم إجراء أي تغييرات' : 'No changes were made');
              return;
            }

            await axiosClient.put(`/api/Term/Update/${shopId}`, payload);
            toast.success(
              lang === 'ar'
                ? 'تم تحديث سياسة الاسترجاع بنجاح!'
                : 'Refund Policy updated successfully!'
            );
            fetchContact(); // جدد البيانات بعد التحديث
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            toast.error(
              lang === 'ar'
                ? 'تم تسجيل خروجك. الرجاء تسجيل الدخول مرة أخرى.'
                : 'You have been logged out. Please sign in again.'
            );
          } else {
            toast.error(
              lang === 'ar'
                ? 'حدث خطأ أثناء العملية. حاول مرة أخرى.'
                : 'Something went wrong. Please try again.'
            );
          }
        }
      },
    });

    return (
      <form onSubmit={formik.handleSubmit}>
        <WidgetCard title={t('Refund')}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-5">
           {(languageValue === 0 || languageValue === 2) && (
             <div className={languageValue === 0 ? 'md:col-span-2 order-first md:order-none' : ''}>
             <CustomInput
               label={t('titleAr')}
               placeholder={t('titleAr')}
               name="titleAr"
               value={formik.values.titleAr}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               className="input-placeholder text-[16px]"
               inputClassName="text-[16px]"
             />
             </div>
           )}
         
           {(languageValue === 1 || languageValue === 2) && (
             <div className={languageValue === 1 ? 'md:col-span-2 order-first md:order-none' : ''}>
               <CustomInput
                 label={t('titleEn')}
                 placeholder={t('titleEn')}
                 name="titleEn"
                 value={formik.values.titleEn}
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 className="input-placeholder text-[16px]"
                 inputClassName="text-[16px]"
               />
             </div>
           )}
         
           {(languageValue === 0 || languageValue === 2) && (
             
             <div className={languageValue === 0 ? 'md:col-span-2 order-first md:order-none' : ''}>
             <QuillEditor
               label={t('descAr')}
               value={formik.values.descriptionAr}
               placeholder={t('descAr')}
               onChange={(value) => formik.setFieldValue('descriptionAr', value)}
               className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px] w-full input-placeholder text-[16px]"
               labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5 text-[16px]"
               modules={{
                 toolbar: [
                   [{ direction: 'rtl' }],
                   ['bold', 'italic', 'underline', 'strike'],
                   [{ list: 'ordered' }, { list: 'bullet' }],
                   [{ align: [] }],
                   [{ color: [] }, { background: [] }],
                   ['clean'],
                 ],
               }}
               />
               </div>
           )}
         
           {(languageValue === 1 || languageValue === 2) && (
             <div className={languageValue === 1 ? 'md:col-span-2 order-first md:order-none' : ''}>
               <QuillEditor
                 label={t('descEn')}
                 value={formik.values.descriptionEn}
                 placeholder={t('descEn')}
                 onChange={(value) => formik.setFieldValue('descriptionEn', value)}
                 className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px] w-full input-placeholder text-[16px]"
                 labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5 text-[16px]"
                 modules={{
                   toolbar: [
                     [{ direction: 'rtl' }],
                     ['bold', 'italic', 'underline', 'strike'],
                     [{ list: 'ordered' }, { list: 'bullet' }],
                     [{ align: [] }],
                     [{ color: [] }, { background: [] }],
                     ['clean'],
                   ],
                 }}
               />
             </div>
           )}
         </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="submit"
              className="w-20 text-white transition-all duration-300 ease-in-out"
            >
              {t('save')}
            </Button>
          </div>
        </WidgetCard>
      </form>
    );
  }

  export default Refund;