'use client';

import { PiXBold, PiArrowsClockwiseBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from '../branchTableForm/TableForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';
import axiosClient from '@/app/components/context/api';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useUserContext } from '@/app/components/context/UserContext';
import { DateTimePicker } from '@/app/components/ui/DatePickerTime/dateJustTimePicker';
import { format } from "date-fns";
import { DateDurationPicker } from '@/app/components/ui/DatePickerTime/dateDurationPicker';
import UpdateLocationPicker from '@/app/components/ui/map/UpdateLocationPicker';
import { PhoneNumber } from '@ui/phone-input';

const parseDurationString = (durationStr: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const [days, hours, minutes, seconds] = durationStr.split(':').map(Number);
  return {
    days: days || 0,
    hours: hours || 0,
    minutes: minutes || 0,
    seconds: seconds || 0,
  };
};

type TableFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  id: string;
  languages: number;
};

export default function UpdateBranchForm({
  title,
  onSuccess,
  lang = 'en',
  id,
  languages
}: TableFormProps) {
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

    submit: lang === 'ar' ? 'تعديل' : 'Update',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [radius, setRadius] = useState<number | ''>('');
  const { setGuard } = useGuardContext();
  const { setBranchesData } = useUserContext();
  const [initLat, setInitLat] = useState<number>(30.0444);
  const [initLng, setInitLng] = useState<number>(31.2357);
  const [initRadius, setInitRadius] = useState<number>(0);

  const mergeDateAndTime = (dateString: string, timeString: string): Date | null => {
    if (!dateString || !timeString) return null;

    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const mainFormSchema = Yup.object().shape({
    nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
    nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
    phoneNumber: Yup.string().required(`${text.phoneNumber} ${requiredMessage}`).matches(/^20(1[0-2,5][0-9]{8})$/, text.wrongPhone),
    openAt: Yup.date().required(text.openAt + ' ' + requiredMessage),
    closedAt: Yup.date().required(text.closedAt + ' ' + requiredMessage),
    deliveryTime: Yup.object().shape({
      days: Yup.number().min(0).required(),
      hours: Yup.number().min(0).max(23).required(),
      minutes: Yup.number().min(0).max(59).required(),
      seconds: Yup.number().min(0).max(59).required(),
    }).required(text.deliveryTime + ' ' + requiredMessage),
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
      openAt: null as Date | null,
      closedAt: null as Date | null,
      deliveryTime: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      location: '',
      lat: null,
      lng: null,
      radius: radius,
      isFixedDelivery: true,
      deliveryCharge: 0,
      deliveryPerKilo: 1,
      minimumDeliveryCharge: 1,
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      setIsSubmit(true);
      const formatTime = (date: Date | null): string =>
        date ? format(date, "HH:mm:ss") : "";

      console.log('values:', values);
      const payload = {
        openAt: formatTime(values.openAt),
        closedAt: formatTime(values.closedAt),
        deliveryTime: `${mainFormik.values.deliveryTime.days.toString().padStart(2, '0')}:${mainFormik.values.deliveryTime.hours.toString().padStart(2, '0')}:${mainFormik.values.deliveryTime.minutes.toString().padStart(2, '0')}:${mainFormik.values.deliveryTime.seconds.toString().padStart(2, '0')}`,
        nameEn: languages === 0? values.nameAr:values.nameEn,
        nameAr: languages === 1? values.nameEn : values.nameAr,
        phoneNumber: values.phoneNumber,
        zoneName: values.nameAr,
        coverageRadius: radius,
        centerLatitude: values.lat,
        centerLongitude: values.lng,
        addressText: values.location,
        isFixedDelivery: values.isFixedDelivery,
        deliveryCharge: values.deliveryCharge,
        deliveryPerKilo: values.deliveryPerKilo,
        minimumDeliveryCharge: values.minimumDeliveryCharge,
      };

      console.log("API Payload: ", payload);
      console.log("real radius: ",radius);
      
      try {
        const response = await axiosClient.put(`/api/Branch/Update/${id}`, payload);
        console.log('Response:', response.data);
        toast.success(
          lang === 'ar' ? 'تم تعديل الفرع بنجاح!' : 'Branch updated successfully!'
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
              ? 'فشل في تعديل الفرع. حاول مجددا.'
              : 'Failed to update branch. Please try again.'
          );
        }
      }
    },
  });
  useEffect(() => {
    const fetchBranchData = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/api/Branch/GetById/${id}`);
        const data = response.data;
        const createdDate = data.createdAt.split('T')[0];
        mainFormik.setValues({
          nameEn: data.nameEn || '',
          nameAr: data.nameAr || '',
          phoneNumber: data.phoneNumber || '',
          openAt: mergeDateAndTime(data.createdAt, data.openAt),
          closedAt: mergeDateAndTime(data.createdAt, data.closedAt),
          deliveryTime: parseDurationString(data.deliveryTime),
          location: data.addressText || '',
          lat: data.centerLatitude || 30.0444,
          lng: data.centerLongitude || 31.2357,
          radius: data.coverageRadius || '',
          isFixedDelivery: data.isFixedDelivery || false,
          deliveryCharge: data.deliveryCharge || 0,
          deliveryPerKilo: data.deliveryPerKilo || 1,
          minimumDeliveryCharge: data.minimumDeliveryCharge || 1,
        });
        setInitLat(data.centerLatitude || 30.0444);
        setInitLng(data.centerLongitude || 31.2357);
        setInitRadius(data.coverageRadius || '');
      } catch (error) {
        toast.error(lang === 'ar' ? 'فشل في تحميل البيانات' : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [id, lang]);
  
  useEffect(() => {
    if (languages === 0) {
      mainFormik.setFieldValue('nameEn', 'no data');
    } else if (languages === 1) {
      mainFormik.setFieldValue('nameAr', 'no data');
    }
  }, [languages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    mainFormik.setFieldValue('location', address || '');
    mainFormik.setFieldValue('lat', lat || '');
    mainFormik.setFieldValue('lng', lng || '');
    mainFormik.setFieldValue('radius', radius || 0);    
  };
  console.log("mainFormik.errors: ",mainFormik.errors);
  

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
          <UpdateLocationPicker 
            apiKey='AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA' 
            onLocationSelect={handleLocationSelect} 
            lang={lang} 
            setRadius={setRadius}
            radius={radius}
            initLat={initLat}
            initLng={initLng}
            initRadius={initRadius}
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
            {/* <Input label={text.openAt} placeholder={text.openAt} name="openAt" value={mainFormik.values.openAt} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.openAt && mainFormik.errors.openAt ? mainFormik.errors.openAt : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' /> */}
            {/* <Input label={text.closedAt} placeholder={text.closedAt} name="closedAt" value={mainFormik.values.closedAt} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.closedAt && mainFormik.errors.closedAt ? mainFormik.errors.closedAt : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' /> */}
            {/* <Input label={text.deliveryTime} placeholder={text.deliveryTime} name="deliveryTime" value={mainFormik.values.deliveryTime} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.deliveryTime && mainFormik.errors.deliveryTime ? mainFormik.errors.deliveryTime : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' /> */}
            <Input label={text.location} placeholder={text.location} name="location" value={mainFormik.values.location} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.location && mainFormik.errors.location ? mainFormik.errors.location : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
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
                selectedDuration={mainFormik.values.deliveryTime}
                onChange={(val) => mainFormik.setFieldValue('deliveryTime', val)}
              />
              {typeof mainFormik.errors.deliveryTime === 'string'  && (
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
              <Input prefix={text.currency} type="number" step="any" label={text.deliveryCharge} placeholder={text.deliveryCharge} name="deliveryCharge" value={mainFormik.values.deliveryCharge} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.deliveryCharge && mainFormik.errors.deliveryCharge ? mainFormik.errors.deliveryCharge : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            ):(<>
              <Input prefix={text.currency} type="number" step="any" label={text.deliveryPerKilo} placeholder={text.deliveryPerKilo} name="deliveryPerKilo" value={mainFormik.values.deliveryPerKilo} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.deliveryPerKilo && mainFormik.errors.deliveryPerKilo ? mainFormik.errors.deliveryPerKilo : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
              <Input prefix={text.currency} type="number" step="any" label={text.minimumDeliveryCharge} placeholder={text.minimumDeliveryCharge} name="minimumDeliveryCharge" value={mainFormik.values.minimumDeliveryCharge} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.minimumDeliveryCharge && mainFormik.errors.minimumDeliveryCharge ? mainFormik.errors.minimumDeliveryCharge : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            </>)
            }
          </div>


          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" isLoading={isSubmit} disabled={isSubmit} className="w-full transition-all duration-300 ease-in-out">
              {text.submit}<PiArrowsClockwiseBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
