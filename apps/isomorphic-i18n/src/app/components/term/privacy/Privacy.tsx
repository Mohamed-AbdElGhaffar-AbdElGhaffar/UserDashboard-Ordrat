'use client'
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

function Privacy({ lang ,languages}: { lang: string ,languages:number}) {
  const shopId = GetCookiesClient('shopId');
  const { t } = useTranslation(lang!, 'policy');
  const [privacy, setPrivacy] = useState<termInfo | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
const languageValue = Number(languages);

  const fetchContact = async () => {
    try {
      const response = await fetch(`https://testapi.ordrat.com/api/Term/GetByShopId/${shopId}?termType=0`);

      if (response.status === 204) {
        // No data returned
        setPrivacy(null);
        setIsCreateMode(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        setPrivacy(data);
        setIsCreateMode(false);
        formik.setValues({
          titleAr: data.titleAr || '',
          titleEn: data.titleEn || '',
          descriptionAr: data.descriptionAr || '',
          descriptionEn: data.descriptionEn || '',
          termType: 0,
          shopId,
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error(lang === 'ar' ? 'فشل تحميل البيانات' : 'Failed to load data');
    }
  };

  useEffect(() => {
    fetchContact();
    console.log('skjshkj',languages);
    
  }, []);

  const formik = useFormik({
    initialValues: {
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      termType: 0,
      shopId,
    },
    onSubmit: async (values: any) => {
      const payload = {
        ...values,
        termType: 0,
        shopId,
      };

      try {
        if (isCreateMode) {
          // 🟢 Create Mode
          const response = await axiosClient.post('/api/Term/Create', payload);
          toast.success(
            lang === 'ar'
              ? 'تم إضافة سياسة الخصوصية بنجاح!'
              : 'Privacy Policy created successfully!'
          );
          setIsCreateMode(false);
          fetchContact();
        } else {
          // 🟡 Update Mode
          if (!privacy) return;

          const isChanged =
            payload.titleAr !== privacy.titleAr ||
            payload.titleEn !== privacy.titleEn ||
            payload.descriptionAr !== privacy.descriptionAr ||
            payload.descriptionEn !== privacy.descriptionEn;

          if (!isChanged) {
            toast.error(lang === 'ar' ? 'لم يتم إجراء أي تغييرات' : 'No changes were made');
            return;
          }

          await axiosClient.put(`/api/Term/Update/${shopId}`, payload);
          toast.success(
            lang === 'ar'
              ? 'تم تحديث سياسة الخصوصية بنجاح!'
              : 'Privacy Policy updated successfully!'
          );
          fetchContact();
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          toast.error(
            lang === 'ar'
              ? 'تم تسجيل خروجك. يرجى تسجيل الدخول مرة أخرى.'
              : 'You have been logged out. Please sign in again.'
          );
        } else {
          toast.error(
            lang === 'ar'
              ? 'حدث خطأ أثناء العملية. حاول مجددًا.'
              : 'Something went wrong. Please try again.'
          );
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <WidgetCard title={t('privacy')}>
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
          <Button type="submit" className="w-20 text-white transition-all duration-300 ease-in-out">
            {t('save')}
          </Button>
        </div>
      </WidgetCard>
    </form>
  );
}

export default Privacy;
