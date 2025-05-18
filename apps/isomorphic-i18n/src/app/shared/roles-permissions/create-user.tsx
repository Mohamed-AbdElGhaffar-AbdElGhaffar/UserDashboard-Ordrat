'use client';

import { useState } from 'react';
import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import { ActionIcon, Title, Button, Input, Textarea, Password, Checkbox, Switch, Select } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './FAQForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { PhoneNumber } from '@ui/phone-input';
import ReactSelect from 'react-select';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';

import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
const shopId = GetCookiesClient('shopId');

type GroupOption = { value: string; label: string };

export default function CreateUser({lang='en', groupOptions, branchOption}:{lang?:string; groupOptions:{ value: string, label: string }[]; branchOption: any[];}) {
  const { closeModal } = useModal();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { setGroupsPermissions } = useUserContext();
  const text = {
    title: lang === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User',
    firstName: lang === 'ar' ? 'الاسم الاول' : "First Name",
    firstNamePlaceholder: lang === 'ar' ? 'أدخل الاسم الاول للمستخدم' : "Enter user's first name",
    lastName: lang === 'ar' ? 'الاسم الاخير' : "Last Name",
    lastNamePlaceholder: lang === 'ar' ? 'أدخل الاسم الاخير للمستخدم' : "Enter user's last name",
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    phoneNumberPlaceholder: lang === 'ar' ? 'أدخل رقم هاتف المستخدم' : "Enter user's Phone Number",
    password: lang === 'ar' ? 'كلمة السر' : 'Password',
    groups: lang === 'ar' ? 'المجموعات' : 'Groups',
    wrongPhone: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number',
    branchId: lang === 'ar' ? 'الفرع' : 'Branch',
    branchLable: lang === 'ar' ? "الفروع" : "Branches",
    placeholderBranch: lang === 'ar' ? "اختر فرع" : "Select Branch",
    email: lang === 'ar' ? 'البريد الالكتروني' : 'Email',
    wrongEmail: lang === 'ar' ? 'البريد الالكتروني غير صالح' : 'Invalid email',
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    createUser: lang === 'ar' ? 'إنشاء مستخدم' : 'Create User',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  
  const mainFormSchema = Yup.object().shape({
    firstName: Yup.string().required(text.firstName + ' ' + requiredMessage),
    lastName: Yup.string().required(text.lastName + ' ' + requiredMessage),
    phoneNumber: Yup.string().required(`${text.phoneNumber} ${requiredMessage}`).matches(/^20(1[0-2,5][0-9]{8})$/, text.wrongPhone),
    email: Yup.string().required(text.email + ' ' + requiredMessage).email(text.wrongEmail),
    branchId: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
    )
    .min(1, lang === 'ar' ? 'يجب اختيار فرع واحدة على الأقل' : 'At least one branch is required'),    
    groups: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
    )
    .min(1, lang === 'ar' ? 'يجب اختيار مجموعة واحدة على الأقل' : 'At least one group is required'),
    password: Yup.string()
      .required(`${text.password} ${requiredMessage}`)
      .min(8, lang === 'ar'
        ? 'كلمة المرور يجب أن تكون أكثر من 8 أحرف'
        : 'Password must be more than 8 characters'),
  });
  
  const mainFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: null,
      groups: [],
      branchId: [],
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        password: values.password,
        shopId: shopId,
        BranchIds: values.branchId.map((branch:any) => branch.value),
        groups: values.groups.map((group:any) => group.value),
      };
      setLoading(true);
      try {
        await axiosClient.post(
          `/api/Employee/CreateEmployee/${shopId}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept-Language': lang,
            },
          }
        );
        
        setGroupsPermissions(true);
        toast.success(lang === 'ar' ? 'تم إنشاء المستخدم بنجاح' : 'User created successfully');
        setLoading(false);
        closeModal();
      } catch (error) {
        console.error(error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء إنشاء المستخدم' : 'Failed to create user');
        setLoading(false);
      }
    },
  });

  return (
    <div className="grid grid-cols-1 gap-6 p-6 @container md:grid-cols-2 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900">
      <div className="col-span-full flex items-center justify-between">
        <Title as="h4" className="font-semibold">
          {text.title}
        </Title>
        <ActionIcon size="sm" variant="text" onClick={closeModal}>
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        mainFormik.handleSubmit();
      }}
      className='col-span-full'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={text.firstName} placeholder={text.firstName} name="firstName" value={mainFormik.values.firstName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.firstName && mainFormik.errors.firstName ? mainFormik.errors.firstName : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
          <Input label={text.lastName} placeholder={text.lastName} name="lastName" value={mainFormik.values.lastName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.lastName && mainFormik.errors.lastName ? mainFormik.errors.lastName : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
          <Input type='email' label={text.email} placeholder={text.email} name="email" value={mainFormik.values.email} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={ mainFormik.touched.email && mainFormik.errors.email ? mainFormik.errors.email : '' } />
          <PhoneNumber
            country={'eg'}
            onlyCountries={['eg']}
            value={mainFormik.values.phoneNumber}
            onChange={(value) => mainFormik.setFieldValue('phoneNumber', value)}
            onBlur={mainFormik.handleBlur}
            label={text.phoneNumber}
            error={mainFormik.touched.phoneNumber && mainFormik.errors.phoneNumber ? mainFormik.errors.phoneNumber : ''}
          />
          {/* <div>
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
          </div> */}
          <div className='w-full'>
            <label className="block font-medium text-gray-700 dark:text-gray-600 mb-1.5">
              {text.branchLable}
            </label>
            <ReactSelect<GroupOption, true>
              isMulti
              name="branchId"
              options={branchOption}
              placeholder={text.placeholderBranch}
              value={mainFormik.values.branchId}
              onChange={(selectedOptions) => {
                mainFormik.setFieldValue('branchId', selectedOptions);
              }}
              onBlur={() => mainFormik.setFieldTouched('branchId', true)}
            />
            {mainFormik.touched.branchId && mainFormik.errors.branchId && (
              <div className="text-red-500 text-sm mt-1">{mainFormik.errors.branchId}</div>
            )}
          </div>
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
          <div className='w-full'>
            <label className="block font-medium text-gray-700 dark:text-gray-600 mb-1.5">
              {text.groups}
            </label>
            <ReactSelect<GroupOption, true>
              isMulti
              name="groups"
              options={groupOptions}
              placeholder={text.groups}
              value={mainFormik.values.groups}
              onChange={(selectedOptions) => {
                mainFormik.setFieldValue('groups', selectedOptions);
              }}
              onBlur={() => mainFormik.setFieldTouched('groups', true)}
            />
            {mainFormik.touched.groups && mainFormik.errors.groups && (
              <div className="text-red-500 text-sm mt-1">{mainFormik.errors.groups}</div>
            )}
          </div>
        </div>


        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={closeModal}
          className="w-full @xl:w-auto"
        >
          {text.cancel}
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full @xl:w-auto"
        >
          {text.createUser}
        </Button>
        </div>
      </form>
    </div>
  );
}
