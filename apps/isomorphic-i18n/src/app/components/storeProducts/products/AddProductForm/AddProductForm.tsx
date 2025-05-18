'use client';

import dynamic from 'next/dynamic';
import { PiPlusBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea, Password, Checkbox, Switch } from 'rizzui';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import cn from '@utils/class-names';
import { PhoneNumber } from '@ui/phone-input';
import SelectLoader from '@components/loader/select-loader';
import LocationPicker from '@/app/components/ui/map/LocationPicker';
import UploadZone from '@/app/components/ui/uploadZone/uploadZone';
import { useRouter } from 'next/navigation';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import axiosClient from '@/app/components/context/api';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
type AddDriverProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  branchOption: any[];
};

export const negMargin = '-mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10';

export default function AddProductForm({
  title,
  onSuccess,
  lang = 'en',
  branchOption
}: AddDriverProps) {
  const shopId = GetCookiesClient('shopId');
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState<number | ''>('');
  const router = useRouter();
  const VehicleTypeOption = [
    {
      value: '0',
      label: lang === 'ar' ? 'دراجة هوائية' : 'Bicycle',
    },
    {
      value: '1',
      label: lang === 'ar' ? 'دراجة نارية' : 'Motorcycle',
    },
    {
      value: '2',
      label: lang === 'ar' ? 'سيارة' : 'Car',
    },
    {
      value: '3',
      label: lang === 'ar' ? 'فان' : 'Van',
    },
    {
      value: '4',
      label: lang === 'ar' ? 'شاحنة' : 'Truck',
    },
  ];  
  const text = {
    location: lang === 'ar' ? 'اسم الزون' : 'Zoon Name',
    fristName: lang === 'ar' ? 'الأسم الاول' : 'First Name',
    lastName: lang === 'ar' ? 'الأسم الاخير' : 'Last Name',
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    email: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
    password: lang === 'ar' ? 'كلمة المرور' : 'Password',
    branchId: lang === 'ar' ? 'الفرع' : 'Branch',
    VehicleType: lang === 'ar' ? 'نوع المركبة' : 'Vehicle Type',
    IsAvailable: lang === 'ar' ? 'هل هو متاح؟' : 'Is Available?',
    
    PersonalPhotoFile: lang === 'ar' ? 'الصورة الشخصية' : 'Personal Photo',
    
    PersonalVerificationCardFrontFile: lang === 'ar' ? 'بطاقة التحقق الشخصية الأمامية' : 'Personal Verification Card Front',
    PersonalVerificationCardBackFile: lang === 'ar' ? 'بطاقة التحقق الشخصية الخلفية' : 'Personal Verification Card Back',
    
    VehicleLicenseFrontFile: lang === 'ar' ? 'رخصة المركبة الأمامية' : 'Vehicle License Front',
    VehicleLicenseBackFile: lang === 'ar' ? 'رخصة المركبة الخلفية' : 'Vehicle License Back',
    
    VehicleFrontImage: lang === 'ar' ? 'الصورة الأمامية للمركبة' : 'Vehicle Front Image',
    VehicleBackImage: lang === 'ar' ? 'الصورة الخلفية للمركبة' : 'Vehicle Back Image',

    branchLable: lang === 'ar' ? "الفروع" : "Branches",
    placeholderBranch: lang === 'ar' ? "اختر فرع" : "Select Branch",
    placeholderVehicleType: lang === 'ar' ? "اختر نوع السيارة" : "Select Vehicle Type",

    wrongPhone: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number',
    wrongEmail: lang === 'ar' ? 'البريد الالكتروني غير صالح' : 'Invalid email',
    
    submit: lang === 'ar' ? 'انشاء' : 'Create',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormSchema = Yup.object().shape({
    location: Yup.string().required(text.location + ' ' + requiredMessage),
    fristName: Yup.string().required(text.fristName + ' ' + requiredMessage),
    lastName: Yup.string().required(text.lastName + ' ' + requiredMessage),
    phoneNumber: Yup.string().required(`${text.phoneNumber} ${requiredMessage}`).matches(/^20(1[0-2,5][0-9]{8})$/, text.wrongPhone),
    email: Yup.string().required(text.email + ' ' + requiredMessage).email(text.wrongEmail),
    password: Yup.string().required(`${text.password} ${requiredMessage}`)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      lang === 'ar'
        ? 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل (مثال: Mohamed@12)، وتشمل:\n- حرف كبير (مثل: M)\n- حرف صغير (مثل: o)\n- رقم (مثل: 1)\n- رمز خاص (مثل: @)'
        : 'Password must contain at least 8 characters (e.g., Mohamed@12), including:\n- one uppercase letter (e.g., M)\n- one lowercase letter (e.g., o)\n- one number (e.g., 1)\n- one special character (e.g., @)'),
    branchId: Yup.string().required(text.branchId + ' ' + requiredMessage),
    VehicleType: Yup.string().required(text.VehicleType + ' ' + requiredMessage),
    PersonalPhotoFile: Yup.array().of(
      Yup.mixed().test('is-string-or-file', 'Must be a string or file', value =>
        typeof value === 'string' || value instanceof File
      )
    ).min(1, lang === 'ar' ? 'يجب رفع صورة واحدة على الأقل' : 'At least one image is required'),
    PersonalVerificationCardFrontFile: Yup.array().of(
      Yup.mixed().test('is-string-or-file', 'Must be a string or file', value =>
        typeof value === 'string' || value instanceof File
      )
    ).min(1, lang === 'ar' ? 'يجب رفع صورة واحدة على الأقل' : 'At least one image is required'),
    PersonalVerificationCardBackFile: Yup.array().of(
      Yup.mixed().test('is-string-or-file', 'Must be a string or file', value =>
        typeof value === 'string' || value instanceof File
      )
    ).min(1, lang === 'ar' ? 'يجب رفع صورة واحدة على الأقل' : 'At least one image is required'),
    VehicleLicenseFrontFile: Yup.array().of(
      Yup.mixed().test('is-string-or-file', 'Must be a string or file', value =>
        typeof value === 'string' || value instanceof File
      )
    ).min(1, lang === 'ar' ? 'يجب رفع صورة واحدة على الأقل' : 'At least one image is required'),
    VehicleLicenseBackFile: Yup.array().of(
      Yup.mixed().test('is-string-or-file', 'Must be a string or file', value =>
        typeof value === 'string' || value instanceof File
      )
    ).min(1, lang === 'ar' ? 'يجب رفع صورة واحدة على الأقل' : 'At least one image is required'),
    VehicleFrontImage: Yup.array().of(
      Yup.mixed().test('is-string-or-file', 'Must be a string or file', value =>
        typeof value === 'string' || value instanceof File
      )
    ).min(1, lang === 'ar' ? 'يجب رفع صورة واحدة على الأقل' : 'At least one image is required'),
    VehicleBackImage: Yup.array().of(
      Yup.mixed().test('is-string-or-file', 'Must be a string or file', value =>
        typeof value === 'string' || value instanceof File
      )
    ).min(1, lang === 'ar' ? 'يجب رفع صورة واحدة على الأقل' : 'At least one image is required'),
  });

  const mainFormik = useFormik({
    initialValues: {
      location: '',
      lat: 30.0444,
      lng: 31.2357,
      radius: radius,
      fristName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      branchId: '',
      VehicleType: '',
      IsAvailable: false,
      PersonalPhotoFile: [] as (string | File)[],
      PersonalVerificationCardFrontFile: [] as (string | File)[],
      PersonalVerificationCardBackFile: [] as (string | File)[],
      VehicleLicenseFrontFile: [] as (string | File)[],
      VehicleLicenseBackFile: [] as (string | File)[],
      VehicleFrontImage: [] as (string | File)[],
      VehicleBackImage: [] as (string | File)[],
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      setLoading(true);
      // console.log('values: ', values);
      // // your submission logic here
      // setTimeout(() => {
      //   setLoading(false); 
        
      //   console.log('data ->', values);
      //   console.log('radius ->', radius);
      // }, 600);
      const formData = new FormData();

      formData.append('FirstName', values.fristName);
      formData.append('LastName', values.lastName);
      formData.append('PhoneNumber', values.phoneNumber);
      formData.append('Email', values.email);
      formData.append('Password', values.password);
      formData.append('BranchId', values.branchId);
      formData.append('VehicleType', values.VehicleType);
      formData.append('IsAvailable', values.IsAvailable.toString());
      formData.append('LastDeliveryCompleted', ''); // if needed

      // Zone values
      formData.append('Zone.Name', values.location);
      formData.append('Zone.CenterLatitude', values.lat.toString());
      formData.append('Zone.CenterLongitude', values.lng.toString());
      formData.append('Zone.CoverageRadius', radius.toString());

      // File fields
      const appendFile = (field:string, fileArray:any[]) => {
        if (fileArray && fileArray.length > 0 && fileArray[0] instanceof File) {
          formData.append(field, fileArray[0]);
        }
      };

      appendFile('PersonalPhotoFile', values.PersonalPhotoFile);
      appendFile('PersonalVerificationCardFrontFile', values.PersonalVerificationCardFrontFile);
      appendFile('PersonalVerificationCardBackFile', values.PersonalVerificationCardBackFile);
      appendFile('VehicleLicenseFrontFile', values.VehicleLicenseFrontFile);
      appendFile('VehicleLicenseBackFile', values.VehicleLicenseBackFile);
      appendFile('VehicleFrontImage', values.VehicleFrontImage);
      appendFile('VehicleBackImage', values.VehicleBackImage);

      try {
        const res = await axiosClient.post('/api/Delivery/Register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success(
          lang === 'ar' ? 'تم تسجيل السائق بنجاح' : 'Driver registered successfully'
        );

        if (onSuccess) onSuccess();
        router.push(`/${lang}/delivery`);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        const backendMessage = err?.response?.data?.message;
        toast.error(backendMessage? backendMessage: 
          lang === 'ar' ? 'فشل في تسجيل السائق. حاول مجدداً.' : 'Failed to register driver. Please try again.'
        );
        setLoading(false);
      }
    },
  });

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    mainFormik.setFieldValue('location', address || '');
    mainFormik.setFieldValue('lat', lat || '');
    mainFormik.setFieldValue('lng', lng || '');
    mainFormik.setFieldValue('radius', radius || 0);    
  };

  return (
    <div className="py-1">
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}
      >
        <div className='mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='col-span-full'>
              <LocationPicker 
                apiKey='AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA' 
                onLocationSelect={handleLocationSelect} 
                lang={lang} 
                setRadius={setRadius}
                radius={radius}
              />
            </div>
            <Input
              label={text.location} 
              placeholder={text.location}
              name="location"
              value={mainFormik.values.location}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              error={
                mainFormik.touched.location && mainFormik.errors.location
                  ? mainFormik.errors.location
                  : ''
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Input
              label={text.fristName}
              placeholder={text.fristName}
              name="fristName"
              value={mainFormik.values.fristName}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              error={
                mainFormik.touched.fristName && mainFormik.errors.fristName
                  ? mainFormik.errors.fristName
                  : ''
              }
            />
            <Input
              label={text.lastName}
              placeholder={text.lastName}
              name="lastName"
              value={mainFormik.values.lastName}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              error={
                mainFormik.touched.lastName && mainFormik.errors.lastName
                  ? mainFormik.errors.lastName
                  : ''
              }
            />
            <PhoneNumber
              country={'eg'}
              onlyCountries={['eg']}
              value={mainFormik.values.phoneNumber}
              onChange={(value) => mainFormik.setFieldValue('phoneNumber', value)}
              onBlur={mainFormik.handleBlur}
              label={text.phoneNumber}
              error={mainFormik.touched.phoneNumber && mainFormik.errors.phoneNumber ? mainFormik.errors.phoneNumber : ''}
            />
            <Input
              type='email'
              label={text.email}
              placeholder={text.email}
              name="email"
              value={mainFormik.values.email}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              error={
                mainFormik.touched.email && mainFormik.errors.email
                  ? mainFormik.errors.email
                  : ''
              }
            />
            <Password
              label={text.password}
              placeholder={text.password}
              name="password"
              value={mainFormik.values.password}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              error={
                mainFormik.touched.password && mainFormik.errors.password
                  ? mainFormik.errors.password
                  : ''
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <Select
                options={branchOption}
                value={branchOption?.find((option: any) => option.value === mainFormik.values.branchId)}
                onChange={(value) => mainFormik.setFieldValue('branchId', value)}
                label={text.branchLable}
                placeholder={text.placeholderBranch}
                error={
                  mainFormik.touched.branchId && mainFormik.errors.branchId
                    ? mainFormik.errors.branchId
                    : ''
                }
                getOptionValue={(option) => option.value}
                inPortal={false}
              />
            </div>
            <div>
              <Select
                options={VehicleTypeOption}
                value={VehicleTypeOption?.find((option: any) => option.value === mainFormik.values.VehicleType)}
                onChange={(value) => mainFormik.setFieldValue('VehicleType', value)}
                label={text.VehicleType}
                placeholder={text.placeholderVehicleType}
                error={
                  mainFormik.touched.VehicleType && mainFormik.errors.VehicleType
                    ? mainFormik.errors.VehicleType
                    : ''
                }
                getOptionValue={(option) => option.value}
                inPortal={false}
              />
            </div>
            {/* <Checkbox
              name="IsAvailable"
              checked={mainFormik.values.IsAvailable}
              onChange={(e) => mainFormik.setFieldValue('IsAvailable', e.target.checked)}
              label={text.IsAvailable}
              className="col-span-full"
            /> */}
            <Switch
              name="IsAvailable"
              checked={mainFormik.values.IsAvailable}
              onChange={(e) => mainFormik.setFieldValue('IsAvailable', e.target.checked)}
              label={text.IsAvailable}
              className="col-span-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <UploadZone
                className=""
                name="PersonalPhotoFile"
                files={mainFormik.values.PersonalPhotoFile}
                setFiles={(files) => mainFormik.setFieldValue("PersonalPhotoFile", files)}
                error={mainFormik.touched.PersonalPhotoFile && mainFormik.errors.PersonalPhotoFile ? mainFormik.errors.PersonalPhotoFile : ""}
                lang={lang}
                multiple={false}
                label={text.PersonalPhotoFile}
              />
            </div>
            <div>
              <UploadZone
                className=""
                name="PersonalVerificationCardFrontFile"
                files={mainFormik.values.PersonalVerificationCardFrontFile}
                setFiles={(files) => mainFormik.setFieldValue("PersonalVerificationCardFrontFile", files)}
                error={mainFormik.touched.PersonalVerificationCardFrontFile && mainFormik.errors.PersonalVerificationCardFrontFile ? mainFormik.errors.PersonalVerificationCardFrontFile : ""}
                lang={lang}
                multiple={false}
                label={text.PersonalVerificationCardFrontFile}
              />
            </div>
            <div>
              <UploadZone
                className=""
                name="PersonalVerificationCardBackFile"
                files={mainFormik.values.PersonalVerificationCardBackFile}
                setFiles={(files) => mainFormik.setFieldValue("PersonalVerificationCardBackFile", files)}
                error={mainFormik.touched.PersonalVerificationCardBackFile && mainFormik.errors.PersonalVerificationCardBackFile ? mainFormik.errors.PersonalVerificationCardBackFile : ""}
                lang={lang}
                multiple={false}
                label={text.PersonalVerificationCardBackFile}
              />
            </div>
            <div>
              <UploadZone
                className=""
                name="VehicleLicenseFrontFile"
                files={mainFormik.values.VehicleLicenseFrontFile}
                setFiles={(files) => mainFormik.setFieldValue("VehicleLicenseFrontFile", files)}
                error={mainFormik.touched.VehicleLicenseFrontFile && mainFormik.errors.VehicleLicenseFrontFile ? mainFormik.errors.VehicleLicenseFrontFile : ""}
                lang={lang}
                multiple={false}
                label={text.VehicleLicenseFrontFile}
              />
            </div>
            <div>
              <UploadZone
                className=""
                name="VehicleLicenseBackFile"
                files={mainFormik.values.VehicleLicenseBackFile}
                setFiles={(files) => mainFormik.setFieldValue("VehicleLicenseBackFile", files)}
                error={mainFormik.touched.VehicleLicenseBackFile && mainFormik.errors.VehicleLicenseBackFile ? mainFormik.errors.VehicleLicenseBackFile : ""}
                lang={lang}
                multiple={false}
                label={text.VehicleLicenseBackFile}
              />
            </div>
            <div>
              <UploadZone
                className=""
                name="VehicleFrontImage"
                files={mainFormik.values.VehicleFrontImage}
                setFiles={(files) => mainFormik.setFieldValue("VehicleFrontImage", files)}
                error={mainFormik.touched.VehicleFrontImage && mainFormik.errors.VehicleFrontImage ? mainFormik.errors.VehicleFrontImage : ""}
                lang={lang}
                multiple={false}
                label={text.VehicleFrontImage}
              />
            </div>
            <div>
              <UploadZone
                className=""
                name="VehicleBackImage"
                files={mainFormik.values.VehicleBackImage}
                setFiles={(files) => mainFormik.setFieldValue("VehicleBackImage", files)}
                error={mainFormik.touched.VehicleBackImage && mainFormik.errors.VehicleBackImage ? mainFormik.errors.VehicleBackImage : ""}
                lang={lang}
                multiple={false}
                label={text.VehicleBackImage}
              />
            </div>
          </div>
        </div>

        {/* ✅ Sticky submit bar */}
        <div
          className={cn(
            'sticky bottom-0 left-0 right-0 z-10 flex items-center justify-end gap-4 border-t bg-white px-4 py-4 md:px-5 lg:px-6 3xl:px-8 4xl:px-10 dark:bg-gray-50',
            negMargin
          )}
        >
          <Button isLoading={loading} type="submit" className="w-full md:w-auto">
            {text.submit}
            <PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
          </Button>
        </div>
      </form>
    </div>
  );
}
