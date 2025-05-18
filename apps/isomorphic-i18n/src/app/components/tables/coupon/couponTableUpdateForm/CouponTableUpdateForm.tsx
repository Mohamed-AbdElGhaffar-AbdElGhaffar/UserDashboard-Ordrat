'use client';

import { PiXBold, PiArrowsClockwiseBold, PiPlusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Loader } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from '../couponTableForm/TableForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';
import axiosClient from '@/app/components/context/api';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useUserContext } from '@/app/components/context/UserContext';
import { format } from "date-fns";
import { DateDurationPicker } from '@/app/components/ui/DatePickerTime/dateDurationPicker';
import UpdateLocationPicker from '@/app/components/ui/map/UpdateLocationPicker';
import CustomInput from '@/app/components/ui/customForms/CustomInput';
import CustomSelect from '@/app/components/ui/customForms/CustomSelect';
import { DateTimePicker } from '@/app/components/ui/DatePickerTime/dateTimePicker';
import CouponValidation from '@/app/components/validation/CouponValidation';
import { DatePicker } from '@ui/datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
type TableFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  id: string;
};
export type Option = {
  label: string
  value: boolean
}
export type OptionType = {
  label: string
  value: number
}
export default function CouponTableUpdateForm({
  title,
  onSuccess,
  lang = 'en',
  id
}: TableFormProps) {
  const { closeModal } = useModal();
  const text = {
    code: lang === 'ar' ? 'الكود' : 'Code',
    active: lang === 'ar' ? 'نشط' : 'Active',
    deactive: lang === 'ar' ? 'غير نشط' : 'Deactive',
    banneractive: lang === 'ar' ? 'مفعل' : 'Activated',
    bannerdeactive: lang === 'ar' ? 'غير مفعل' : 'Not active',

    flat: lang === 'ar' ? 'رقمي' : 'Flat',
    Percentage: lang === 'ar' ? 'نسبة مئوية' : 'Percentage',

    discountValue: lang === 'ar' ? 'قيمة الخصم' : 'Discount Value',
    expireDate: lang === 'ar' ? 'تاريخ الاننتهاء' : 'Expire Date',
    usageLimit: lang === 'ar' ? 'عدد مرات الاستخدام' : 'Usage Limit',
    discountType: lang === 'ar' ? 'نوع الخصم' : 'discount Type',
    isActive: lang === 'ar' ? 'النشاط' : 'isActive',
    isBanner: lang === 'ar' ? 'البانر الاعلاني' : 'Coupon Banner',
    submit: lang === 'ar' ? 'تعديل' : 'Update',
  };
  const Activeoptions: Option[] = [
    { label: text.active, value: true },
    { label: text.deactive, value: false },
  ];
  const Banneroptions: Option[] = [
    { label: text.banneractive, value: true },
    { label: text.bannerdeactive, value: false },
  ];
  const Typeoptions: OptionType[] = [
    { label: text.Percentage, value: 0 },
    { label: text.flat, value: 1 },
  ];
  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState<number | ''>('');
  const { setGuard } = useGuardContext();
  const { setCouponData } = useUserContext();
  const validationSchema = CouponValidation({ lang })

  const [initLat, setInitLat] = useState<number>(30.0444);
  const [initLng, setInitLng] = useState<number>(31.2357);
  const [initRadius, setInitRadius] = useState<number>(0);
  const shopId = GetCookiesClient('shopId') as string;

  const mergeDateAndTime = (dateString: string, timeString: string): Date | null => {
    if (!dateString || !timeString) return null;

    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  // const mainFormSchema = Yup.object().shape({
  //   nameEn: Yup.string().required(text.nameEn + ' ' + requiredMessage),
  //   nameAr: Yup.string().required(text.nameAr + ' ' + requiredMessage),
  //   openAt: Yup.date().required(text.openAt + ' ' + requiredMessage),
  //   closedAt: Yup.date().required(text.closedAt + ' ' + requiredMessage),
  //   deliveryTime: Yup.date().required(text.deliveryTime + ' ' + requiredMessage),
  //   location: Yup.string().required(text.location + ' ' + requiredMessage),
  // });

  const mainFormik = useFormik({
    initialValues: {
      code: '',
      discountValue: '',
      expireDate: null,
      isActive: true,
      isBanner: true,
      discountType: 0,
      usageLimit: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const formatTime = (date: Date | null): string =>
        date ? format(date, "HH:mm:ss") : "";

      console.log('values:', values);
      const payload = {
        code: values.code,
        discountValue: values.discountValue,
        discountType: Number(values.discountType) === 1 ? 1 : 0, // تأكد إنها 0 أو 1
        expireDate: values.expireDate,
        isActive: Boolean(values.isActive),
        isBanner: Boolean(values.isBanner),
        usageLimit: values.usageLimit,
        shopId: shopId
      };


      console.log("API Payload: ", payload);
      console.log("real radius: ", radius);

      try {
        setLoading(true)
        const response = await axiosClient.put(`/api/Coupon/Update/${id}`, payload);
        console.log('Response:', response.data);
        toast.success(
          lang === 'ar' ? 'تم تعديل الكوبون بنجاح!' : 'Coupon updated successfully!'
        );
        closeModal();
        setCouponData(true);

      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          const status = axiosError.response.status;

          switch (status) {
            case 500:
              toast.error(
                lang === 'ar'
                  ? "يوجد لديك كوبون إعلاني بالفعل. يرجى إلغاءه إذا كنت تريد تفعيل كوبون آخر."
                  : "You already have an advertising coupon. Please cancel it if you want to activate another one."
              );
              break;

            case 401:
              setGuard(false);
              toast.error(
                lang === 'ar'
                  ? 'تم تسجيل خروجك. يرجى تسجيل الدخول مرة أخرى.'
                  : 'You have been logged out. Please sign in again.'
              );
              break;

            default:
              toast.error(
                lang === 'ar'
                  ? 'فشل في تعديل الكوبون. حاول مجددًا.'
                  : 'Failed to update the coupon. Please try again.'
              );
              break;
          }
        } else {
          // error without response (like network error)
          toast.error(
            lang === 'ar'
              ? 'حدث خطأ غير متوقع. حاول لاحقًا.'
              : 'An unexpected error occurred. Please try again later.'
          );
        }
      }
      finally{
        setLoading(false)

      }

    },
  });

  useEffect(() => {
    const fetchBranchData = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/api/Coupon/GetById/${id}`);
        const data = response.data;
        mainFormik.setValues({
          code: data.code || '',
          discountValue: data.discountValue || '',
          usageLimit: data.usageLimit || '',
          isActive: data.isActive || '',
          isBanner: data.isBanner || '',
          // expireDate: data.expireDate ,
          expireDate: data.expireDate && new Date(data.expireDate),

          discountType: data.discountType || '',
        });

      } catch (error) {
        toast.error(lang === 'ar' ? 'فشل في تحميل البيانات' : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [id, lang]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[200px]">
  //       <Loader className="animate-spin text-blue-500" width={40} height={40} />
  //     </div>
  //   );
  // }


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
                value={Activeoptions.find(option => option.value === Boolean(mainFormik.values.isActive))}
                placeholder={text.isActive}
                onBlur={mainFormik.handleBlur}
                onChange={(option: Option) => mainFormik.setFieldValue('isActive', option?.value)}
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
              <label htmlFor="discountType">
                {text.discountType}
              </label>
              <CustomSelect
                id='discountType'
                name='discountType'
                InputClass='mt-1.5'
                lang={lang}
                options={Typeoptions}
                value={Typeoptions.find(option => option.value === Number(mainFormik.values.discountType))}
                placeholder=''
                onBlur={mainFormik.handleBlur}
                onChange={(option: Option) => mainFormik.setFieldValue('discountType', option?.value)}
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
            {/* <CustomInput label={text.expireDate} placeholder={text.expireDate} name="expireDate" value={mainFormik.values.expireDate} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.expireDate && mainFormik.errors.expireDate ? mainFormik.errors.expireDate : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' /> */}
            <CustomInput label={text.usageLimit} placeholder={text.usageLimit} name="usageLimit" value={mainFormik.values.usageLimit} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.usageLimit && mainFormik.errors.usageLimit ? mainFormik.errors.usageLimit : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            <div className="">
              <label htmlFor="isBanner">
                {text.isBanner}
              </label>
              <CustomSelect
                id='isBanner'
                name='isBanner'
                lang={lang}
                InputClass='mt-1.5'

                options={Banneroptions}
                value={Banneroptions.find(option => option.value === Boolean(mainFormik.values.isBanner))}
                placeholder={text.isActive}
                onBlur={mainFormik.handleBlur}
                onChange={(option: Option) => mainFormik.setFieldValue('isBanner', option?.value)}
              />
            </div>
          </div>
          <div className='w-full'>
            <div className=' mt-2'>
              <label className=''>{lang === 'ar' ? 'تاريخ الانتهاء' : 'Expire Date '}</label>
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
          </div>


          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            {/* <Button type="submit" className="w-full  text-white transition-all duration-300 ease-in-out">
              {text.submit}
            </Button> */}
          <Button type="submit"
  className={`text-white text-base rounded-lg w-full py-3 ${
    loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
  }`}
>
  {loading ? (
    <Loader variant="spinner" size="lg" />
  ) : (
    <>{text.submit}</>
  )}
</Button>

          </div>
        </form>
      </div>
    </div>
  );
}
