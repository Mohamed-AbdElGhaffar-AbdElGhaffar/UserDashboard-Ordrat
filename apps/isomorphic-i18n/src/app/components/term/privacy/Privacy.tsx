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
 const defaultPrivacyPolicy = `
<b>سياسة الخصوصية للمتجر</b><br/><br/>
<b>المعلومات التي نجمعها</b><br/>
بيانات التواصل (الاسم، البريد الإلكتروني، رقم الهاتف) عند إتمام الطلب.<br/>
تفاصيل الطلب (العنوان، المنتجات، طريقة الدفع).<br/><br/>

<b>كيفية الاستخدام</b><br/>
تنفيذ الطلبات وتنسيق التسليم.<br/>
التواصل مع العميل بخصوص حالة الطلب والعروض.<br/>
تحسين جودة الخدمة بناءً على ملاحظات الاستخدام.<br/><br/>

<b>مشاركة البيانات</b><br/>
مع منصة “أوردرات” لتشغيل المتجر.<br/>
مع مزوّدي الدفع والشحن لتنفيذ الطلبات.<br/>
عند الاقتضاء قانونياً مع الجهات المختصة.<br/><br/>

<b>مدة الاحتفاظ</b><br/>
تُحفظ البيانات حتى إتمام الطلب وفترة ما بعد البيع (٦ أشهر كحد أقصى)، أو حسب متطلبات القانون.<br/><br/>

<b>شروط الاستخدام للمتجر</b><br/><br/>

<b>الأهلية</b><br/>
للاستخدام يجب أن يكون عمرك 18 عاماً فأكثر.<br/><br/>

<b>الحساب والأمان</b><br/>
احفظ بياناتك الخاصة (مثل كلمة المرور) ولا تفصح عنها.<br/>
كل نشاط تحت حسابك هو مسؤوليتك.<br/><br/>

<b>إتمام الطلب</b><br/>
يتم تأكيد الطلب بعد الدفع بالسعر المعلن.<br/>
يحق للمتجر إلغاء أو تعديل الطلب لأسباب تقنية أو نادرة، مع إخطارك فوراً.<br/><br/>

<b>الإلغاء والاسترجاع</b><br/>
طبقاً لسياسة المتجر المعروضة عند الطلب، وفي حدود قانون حماية المستهلك.<br/><br/>

<b>المحتوى المقدم</b><br/>
أنت مسؤول عن صحة أي معلومات أو مراجعات تنشرها.<br/>
يمنع نشر محتوى ينتهك حقوق الغير أو يخالف القانون.<br/><br/>

<b>القانون الواجب التطبيق</b><br/>
تخضع هذه الشروط لقوانين جمهورية مصر العربية، وأي نزاع يفصل فيه أمام محاكم القاهرة.<br/><br/>

<i>ملاحظة: استبدل عناوين البريد أو التفاصيل حسب بيانات متجرك الخاصة.</i>
`;
const defaultPrivacyPolicyEn = `
<b>Information We Collect</b><br/>
Contact details (name, email, phone number) when placing an order.<br/>
Order details (address, products, payment method).<br/><br/>

<b>How We Use the Information</b><br/>
Processing orders and coordinating delivery.<br/>
Communicating with the customer regarding order status and offers.<br/>
Improving service quality based on usage feedback.<br/><br/>

<b>Data Sharing</b><br/>
With the “Ordrat” platform to operate the store.<br/>
With payment and shipping providers to fulfill orders.<br/>
With the competent authorities when legally required.<br/><br/>

<b>Data Retention</b><br/>
Data is retained until the order is fulfilled and for a post-sale period (up to 6 months), or as required by law.<br/><br/>

<b>Store Terms of Use</b><br/><br/>

<b>Eligibility</b><br/>
You must be at least 18 years old to use the store.<br/><br/>

<b>Account & Security</b><br/>
Keep your private data (such as your password) safe and do not disclose it.<br/>
You are responsible for all activities under your account.<br/><br/>

<b>Order Completion</b><br/>
Orders are confirmed after payment at the listed price.<br/>
The store has the right to cancel or modify the order for technical or exceptional reasons, with immediate notice to you.<br/><br/>

<b>Cancellation & Returns</b><br/>
According to the store's policy displayed at checkout, and within the bounds of consumer protection law.<br/><br/>

<b>User-Submitted Content</b><br/>
You are responsible for the accuracy of any information or reviews you submit.<br/>
Publishing content that violates the rights of others or breaks the law is prohibited.<br/><br/>

<b>Governing Law</b><br/>
These terms are governed by the laws of the Arab Republic of Egypt. Any dispute shall be resolved before the courts of Cairo.<br/><br/>

<i>Note: Replace any emails or personal details with your store-specific information.</i>
`;

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
      value={formik.values.titleAr||'سياسة الخصوصية للمتجر'}
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
        value={formik.values.titleEn||'Store Privacy Policy'}
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
        value={
    formik.values.descriptionAr?.trim()
      ? formik.values.descriptionAr
      : defaultPrivacyPolicy
  }
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
  value={
    formik.values.descriptionEn?.trim()
      ? formik.values.descriptionEn
      : defaultPrivacyPolicyEn
  }
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
