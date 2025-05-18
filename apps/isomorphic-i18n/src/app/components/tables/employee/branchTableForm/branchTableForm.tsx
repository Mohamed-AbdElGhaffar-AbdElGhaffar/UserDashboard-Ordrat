'use client';

import { PiXBold, PiPlusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './TableForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';
import axiosClient from '@/app/components/context/api';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useUserContext } from '@/app/components/context/UserContext';
import LocationPicker from '@/app/components/ui/map/LocationPicker';
import { DateTimePicker } from '@/app/components/ui/DatePickerTime/dateJustTimePicker';
import { format } from "date-fns";
import { DateDurationPicker } from '@/app/components/ui/DatePickerTime/dateDurationPicker';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import { PhoneNumber } from '@ui/phone-input';

type TableFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  languages: number;
};

export default function BranchTableForm({
  title,
  onSuccess,
  lang = 'en',
  languages
}: TableFormProps) {
  const shopId = GetCookiesClient('shopId');
  const { closeModal } = useModal();
  const text = {
    nameEn: lang === 'ar' ? 'الأسم (انجليزي)' : 'Name (English)',
    nameAr: lang === 'ar' ? 'الأسم (عربي)' : 'Name (Arabic)',
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    openAt: lang === 'ar' ? 'وقت الفتح' : 'Opening At',
    closedAt: lang === 'ar' ? 'وقت الإغلاق' : 'Closed At',
    deliveryTime: lang === 'ar' ? 'مده التوصيل' : 'Delivery Time',
    location: lang === 'ar' ? 'العنوان' : 'Location',
    storeType: lang === 'ar' ? 'نوع المتجر' : 'Store Type',
    extraPhone: lang === 'ar' ? 'هاتف إضافي' : 'Extra Phone',
    notes: lang === 'ar' ? 'ملاحظات هامة' : 'Important Notes',
    isFixedDelivery: lang === 'ar' ? 'توصيل بسعر ثابت؟' : 'Fixed Delivery?',
    deliveryCharge: lang === 'ar' ? 'رسوم التوصيل الثابتة' : 'Fixed Delivery Charge',
    deliveryPerKilo: lang === 'ar' ? 'رسوم لكل كيلومتر' : 'Charge Per Kilo',
    minimumDeliveryCharge: lang === 'ar' ? 'الحد الأدنى لرسوم التوصيل' : 'Minimum Delivery Charge',
    currency: lang === 'ar' ? "ج.م" : "EGP",
    wrongPhone: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number',

    submit: lang === 'ar' ? 'انشاء' : 'Create',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [radius, setRadius] = useState<number | ''>('');
  const { setGuard } = useGuardContext();
  const { setBranchesData } = useUserContext();

  useEffect(() => {
    if (languages === 0) {
      mainFormik.setFieldValue('nameEn', 'no data');
    } else if (languages === 1) {
      mainFormik.setFieldValue('nameAr', 'no data');
    }
  }, [languages]);
  
  const mainFormSchema = Yup.object().shape({
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    phoneNumber: Yup.string().required(`${text.phoneNumber} ${requiredMessage}`).matches(/^20(1[0-2,5][0-9]{8})$/, text.wrongPhone),
    openAt: Yup.date().required(text.openAt + ' ' + requiredMessage),
    closedAt: Yup.date().required(text.closedAt + ' ' + requiredMessage),
    deliveryTime: Yup.date().required(text.deliveryTime + ' ' + requiredMessage),
    location: Yup.string().required(text.location + ' ' + requiredMessage),
    // isFixedDelivery: Yup.boolean(),

    deliveryCharge: Yup.number().when('isFixedDelivery', {
      is: true,
      then: (schema) => schema.required(text.deliveryCharge + ' ' + requiredMessage),
      otherwise: (schema) => schema.notRequired(),
    }),

    deliveryPerKilo: Yup.number().when('isFixedDelivery', {
      is: false,
      then: (schema) =>
        schema
          .required(text.deliveryPerKilo + ' ' + requiredMessage)
          .min(1, lang === 'ar' ? 'يجب أن يكون 1 على الأقل' : 'Must be at least 1')
          .max(100, lang === 'ar' ? 'يجب ألا يتجاوز 100' : 'Must not exceed 100'),
      otherwise: (schema) => schema.notRequired(),
    }),

    minimumDeliveryCharge: Yup.number().when('isFixedDelivery', {
      is: false,
      then: (schema) =>
        schema
          .required(text.minimumDeliveryCharge + ' ' + requiredMessage)
          .min(1, lang === 'ar' ? 'يجب أن يكون 1 على الأقل' : 'Must be at least 1')
          .max(100, lang === 'ar' ? 'يجب ألا يتجاوز 100' : 'Must not exceed 100'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const mainFormik = useFormik({
    initialValues: {
      nameEn: '',
      nameAr: '',
      phoneNumber: '',
      openAt: null,
      closedAt: null,
      deliveryTime: null,
      location: '',
      lat: 30.0444,
      lng: 31.2357,
      radius: radius,
      isFixedDelivery: true,
      deliveryCharge: null,
      deliveryPerKilo: 1,
      minimumDeliveryCharge: 1,
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      setIsSubmit(true);
      const formatTime = (date: Date | null): string =>
        date ? format(date, "HH:mm:ss") : "";

      const userId = localStorage.getItem('userId');
      const payload = {
        openAt: formatTime(values.openAt),
        closedAt: formatTime(values.closedAt),
        deliveryTime: formatTime(values.deliveryTime),
        nameEn: values.nameEn,
        nameAr: values.nameAr,
        phoneNumber: values.phoneNumber,
        zoneName: values.nameAr,
        coverageRadius: radius,
        centerLatitude: values.lat,
        centerLongitude: values.lng,
        addressText: values.location,
        // shopId: "952e762c-010d-4e2b-8035-26668d99e23e"
        isFixedDelivery: values.isFixedDelivery,
        deliveryCharge: values.deliveryCharge,
        deliveryPerKilo: values.deliveryPerKilo,
        minimumDeliveryCharge: values.minimumDeliveryCharge,
      };
      
      try {
        const response = await axiosClient.post(`/api/Branch/Create/${shopId}`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', response.data);
        toast.success(
          lang === 'ar' ? 'تم انشاء الفرع بنجاح!' : 'Branch created successfully!'
        );
        setIsSubmit(false);
        closeModal();
        setBranchesData(true);
        
      } catch (error) {
        const axiosError = error as AxiosError;
        setIsSubmit(false);

        if (axiosError.response && axiosError.response.status === 401) {
          setGuard(false);
          toast.error(
            lang === 'ar'
              ? 'تم تسجيل خروجك. يرجى تسجيل الدخول مرة أخرى.'
              : 'You have been logged out. Please sign in again.'
          );
        } else {
          toast.error(
            lang === 'ar'
              ? 'فشل في انشاء الفرع. حاول مجددا.'
              : 'Failed to create branch. Please try again.'
          );
        }
      }
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-blue-500" width={40} height={40} />
      </div>
    );
  }

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    mainFormik.setFieldValue('location', address || '');
    mainFormik.setFieldValue('lat', lat || '');
    mainFormik.setFieldValue('lng', lng || '');
    mainFormik.setFieldValue('radius', radius || 0);    
  };

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
          <LocationPicker 
            apiKey='AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA' 
            onLocationSelect={handleLocationSelect} 
            lang={lang} 
            setRadius={setRadius}
            radius={radius}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages!=1 &&(
              <Input label={text.nameAr} placeholder={text.nameAr} name="nameAr" value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            )}
            {languages!=0 &&(
              <Input label={text.nameEn} placeholder={text.nameEn} name="nameEn" value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            )}
            <PhoneNumber
              country={'eg'}
              onlyCountries={['eg']}
              value={mainFormik.values.phoneNumber}
              onChange={(value) => mainFormik.setFieldValue('phoneNumber', value)}
              onBlur={mainFormik.handleBlur}
              label={text.phoneNumber}
              error={mainFormik.touched.phoneNumber && mainFormik.errors.phoneNumber ? mainFormik.errors.phoneNumber : ''}
            />
            <Input label={text.location} placeholder={text.location} name="location" value={mainFormik.values.location} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.location && mainFormik.errors.location ? mainFormik.errors.location : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            {/* <Input prefix={text.currency} type="number" step="any" label={text.deliveryCharge} placeholder={text.deliveryCharge} name="deliveryCharge" value={mainFormik.values.deliveryCharge as any} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.deliveryCharge && mainFormik.errors.deliveryCharge ? mainFormik.errors.deliveryCharge : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            <Input prefix={text.currency} type="number" step="any" label={text.deliveryPerKilo} placeholder={text.deliveryPerKilo} name="deliveryPerKilo" value={mainFormik.values.deliveryPerKilo} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.deliveryPerKilo && mainFormik.errors.deliveryPerKilo ? mainFormik.errors.deliveryPerKilo : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            <Input prefix={text.currency} type="number" step="any" label={text.minimumDeliveryCharge} placeholder={text.minimumDeliveryCharge} name="minimumDeliveryCharge" value={mainFormik.values.minimumDeliveryCharge} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.minimumDeliveryCharge && mainFormik.errors.minimumDeliveryCharge ? mainFormik.errors.minimumDeliveryCharge : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' /> */}
            {/* openAt Time */}
            <div className='w-full'>
              <DateTimePicker 
                lable={text.openAt}
                lang={lang}
                selectedDate={mainFormik.values.openAt}
                onChange={(date) => mainFormik.setFieldValue('openAt', date)}
              />
              {mainFormik.touched.openAt && mainFormik.errors.openAt && (
                <div className="text-red-500 text-sm mt-1">{mainFormik.errors.openAt}</div>
              )}
            </div>
            {/* closedAt Time */}
            <div className='w-full'>
              <DateTimePicker 
                lable={text.closedAt}
                lang={lang}
                selectedDate={mainFormik.values.closedAt}
                onChange={(date) => mainFormik.setFieldValue('closedAt', date)}
              />
              {mainFormik.touched.closedAt && mainFormik.errors.closedAt && (
                <div className="text-red-500 text-sm mt-1">{mainFormik.errors.closedAt}</div>
              )}
            </div>
            {/* deliveryTime Time */}
            <div className='w-full'>
              <DateDurationPicker 
                lable={text.deliveryTime}
                lang={lang}
                selectedDate={mainFormik.values.deliveryTime}
                onChange={(date) => mainFormik.setFieldValue('deliveryTime', date)}
              />
              {mainFormik.touched.deliveryTime && mainFormik.errors.deliveryTime && (
                <div className="text-red-500 text-sm mt-1">{mainFormik.errors.deliveryTime}</div>
              )}
            </div>
            <div className="col-span-full relative">
              <Switch
                name="isFixedDelivery"
                checked={mainFormik.values.isFixedDelivery}
                onChange={(e) => mainFormik.setFieldValue('isFixedDelivery', e.target.checked)}
                label={text.isFixedDelivery}
                className="col-span-full"
              />
            </div>
            {mainFormik.values.isFixedDelivery ? (

              <Input prefix={text.currency} type="number" step="any" label={text.deliveryCharge} placeholder={text.deliveryCharge} name="deliveryCharge" value={mainFormik.values.deliveryCharge || undefined} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.deliveryCharge && mainFormik.errors.deliveryCharge ? mainFormik.errors.deliveryCharge : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            ):(<>
              <Input prefix={text.currency} type="number" step="any" label={text.deliveryPerKilo} placeholder={text.deliveryPerKilo} name="deliveryPerKilo" value={mainFormik.values.deliveryPerKilo} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.deliveryPerKilo && mainFormik.errors.deliveryPerKilo ? mainFormik.errors.deliveryPerKilo : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
              <Input prefix={text.currency} type="number" step="any" label={text.minimumDeliveryCharge} placeholder={text.minimumDeliveryCharge} name="minimumDeliveryCharge" value={mainFormik.values.minimumDeliveryCharge} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.minimumDeliveryCharge && mainFormik.errors.minimumDeliveryCharge ? mainFormik.errors.minimumDeliveryCharge : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            </>)
            }
          </div>


          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" isLoading={isSubmit} disabled={isSubmit} className="w-full">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
