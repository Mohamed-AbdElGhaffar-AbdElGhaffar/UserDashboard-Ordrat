'use client';

import { PiXBold, PiPlusBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { ActionIcon, Title, Button, Input } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './TableForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { DateTimePicker } from '@/app/components/DatePickerTime/dateTimePicker';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';
import axiosClient from '@/app/components/context/api';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useUserContext } from '@/app/components/context/UserContext';
import LocationPicker from '@/app/components/ui/map/LocationPicker';
// import { DateTimePicker } from '@/app/components/ui/DatePickerTime/dateJustTimePicker';
import { format } from "date-fns";
import { DateDurationPicker } from '@/app/components/ui/DatePickerTime/dateDurationPicker';
import CouponValidation from '@/app/components/validation/CouponValidation';
import CustomInput from '@/app/components/ui/customForms/CustomInput';
import CustomSelect from '@/app/components/ui/customForms/CustomSelect';
import { DateTimePicker } from '@/app/components/ui/DatePickerTime/dateTimePicker';

import { DatePicker } from '@ui/datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
// import '@/datepicker.css'; // لو ضفته هنا


type TableFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
};

export type Option = {
  label: string
  value: boolean
}
export type OptionType = {
  label: string
  value: number
}
export default function CouponTableForm({
  title,
  onSuccess,
  lang = 'en',
}: TableFormProps) {
  const { closeModal } = useModal();
  const [startDate, setStartDate] = React.useState<Date | null>();
  const shopId = GetCookiesClient('shopId') as string;

  const text = {
    code: lang === 'ar' ? 'الكود' : 'Code',
    active: lang === 'ar' ? 'نشط' : 'Active',
    deactive: lang === 'ar' ? 'غير نشط' : 'Deactive',
    flat: lang === 'ar' ? 'رقم ثابت' : 'Flat',
    Percentage: lang === 'ar' ? 'نسبة مئوية' : 'Percentage',
    discountValue: lang === 'ar' ? 'قيمة الخصم' : 'Discount Value',
    expireDate: lang === 'ar' ? 'تاريخ الاننتهاء' : 'Expire Date',
    usageLimit: lang === 'ar' ? 'عدد مرات الاستخدام' : 'Usage Limit',
    discountType: lang === 'ar' ? 'نوع الخصم' : 'discount Type',
    isActive: lang === 'ar' ? 'النشاط' : 'isActive',
    submit: lang === 'ar' ? 'انشاء' : 'Create',
  };
  const Activeoptions: Option[] = [
    { label:  text.active, value: true },
    { label: text.deactive, value: false },
  ];
  const Typeoptions: OptionType[] = [
    { label: text.Percentage, value: 0 },
    { label:  text.flat, value: 1 },
  ];
  
  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [loading, setLoading] = useState(false);
  const { setGuard } = useGuardContext();
  const { setCouponData } = useUserContext();
  const validationSchema = CouponValidation({ lang })
  // const mainFormSchema = Yup.object().shape({
  //   code: Yup.string().required(text.code + ' ' + requiredMessage),
  //   discountValue: Yup.string().required(text.discountValue + ' ' + requiredMessage),
  //   expireDate: Yup.date().required(text.expireDate + ' ' + requiredMessage),
  //   usageLimit: Yup.date().required(text.usageLimit + ' ' + requiredMessage),
  //   deliveryTime: Yup.date().required(text.deliveryTime + ' ' + requiredMessage),
  //   location: Yup.string().required(text.location + ' ' + requiredMessage),
  // });

  const mainFormik = useFormik({
    initialValues: {
      code: '',
      discountValue: '',
      expireDate:null,
      isActive: true,
      discountType: 0,
      usageLimit: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const formatTime = (date: Date | null): string =>
        date ? format(date, "HH:mm:ss") : "";

      const userId = localStorage.getItem('userId');
      const payload = {

        code: values.code,
        discountValue: values.discountValue,
        discountType: values.discountType,
        expireDate: values.expireDate,
        isActive: values.isActive,
        usageLimit: values.usageLimit,
        shopId: shopId
      };

      try {
        const response = await axiosClient.post(`/api/Coupon/Create/${shopId}`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', response.data);
        toast.success(
          lang === 'ar' ? 'تم انشاء الكوبون بنجاح!' : 'Coupon created successfully!'
        );
        closeModal();
        setCouponData(true);

      } catch (error) {
        const axiosError = error as AxiosError;

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput label={text.code} placeholder={text.code} name="code" value={mainFormik.values.code} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.code && mainFormik.errors.code ? mainFormik.errors.code : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            <CustomInput label={text.discountValue} placeholder={text.discountValue} name="discountValue" value={mainFormik.values.discountValue} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.discountValue && mainFormik.errors.discountValue ? mainFormik.errors.discountValue : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            <div className="">
              <label htmlFor="isActive">
              {text.isActive}
              </label>
              <CustomSelect
                id='isActive'
                name='isActive'
                lang={lang}
              InputClass='mt-1.5'

                options={Activeoptions}
                value={Activeoptions.find(option => option.value === mainFormik.values.isActive)}
                placeholder={text.isActive}
                onBlur={mainFormik.handleBlur}
                onChange={(option:Option)=>mainFormik.setFieldValue('isActive', option?.value) }
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
            <div className="">
              <label htmlFor="isActive">
              {text.discountType}
              </label>
              <CustomSelect
                id='discountType'
                name='discountType'
              InputClass='mt-1.5'
                lang={lang}
                options={Typeoptions}
                value={Typeoptions.find(option => option.value === mainFormik.values.discountType)}
                placeholder=''
                onBlur={mainFormik.handleBlur}
                onChange={(option:Option)=>mainFormik.setFieldValue('discountType', option?.value) }
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
            <div className=' '>
              <label className='font-medium'>{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expire Date '}</label>
            <DatePicker

  selected={mainFormik.values.expireDate}
  onChange={(date: any) => mainFormik.setFieldValue('expireDate', date)}
  dateFormat="d MMMM yyyy, h:mm aa"
  placeholderText="Select Date & Time"
  showTimeSelect
  className="date-picker-event-calendar mt-1" 
/>

              {/* <DateTimePicker 
                lable={lang === 'ar' ? 'تاريخ الانتهاء' : 'Expire Date '}
                lang={lang}
                selectedDate={mainFormik.values.expireDate}
                onChange={(date:any) => mainFormik.setFieldValue('expireDate', date)}
              /> */}
              {mainFormik.touched.expireDate && mainFormik.errors.expireDate && (
                <div className="text-red-500 text-sm mt-1">{mainFormik.errors.expireDate}</div>
              )}
            </div>
            {/* <CustomInput label={text.expireDate} placeholder={text.expireDate} name="expireDate" value={mainFormik.values.expireDate} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.expireDate && mainFormik.errors.expireDate ? mainFormik.errors.expireDate : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' /> */}
            <CustomInput label={text.usageLimit} placeholder={text.usageLimit} name="usageLimit" value={mainFormik.values.usageLimit} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.usageLimit && mainFormik.errors.usageLimit ? mainFormik.errors.usageLimit : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />

          </div>


          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="submit" className="w-full  text-white transition-all duration-300 ease-in-out">
              {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
