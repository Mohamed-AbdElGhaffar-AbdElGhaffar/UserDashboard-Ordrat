'use client';

import dynamic from 'next/dynamic';
import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea, Text } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './POSOrderForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import axiosClient from '../../context/api';
import { RadioGroup, AdvancedRadio } from 'rizzui';
import { PiCheckCircleFill } from 'react-icons/pi';
import SelectLoader from '@components/loader/select-loader';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import { API_BASE_URL } from '@/config/base-url';
import { PhoneNumber } from '@ui/phone-input';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
type POSNewCustomerFormProps = {
  lang: string;
  onSuccess: () => void;
  onReturn: () => void;
};

type Customer = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber: string;
};

export default function POSNewCustomerForm({
  lang = 'en',
  onSuccess,
  onReturn,
}: POSNewCustomerFormProps) {
  const shopId = GetCookiesClient('shopId');
  const [loading, setLoading] = useState(false);
  const text = {
    addCustomer: lang === 'ar' ? 'اضافة عميل جديد' : 'Add New Customer',
    submit: lang === 'ar' ? 'اضافة' : 'Submit',
    return: lang === 'ar' ? 'الرجوع' : 'Return',

    firstName: lang === 'ar' ? 'الاسم الاول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الاخير' : 'Last Name',
    email: lang === 'ar' ? 'البريد الألكتروني' : 'Email',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    isRequired: lang === 'ar' ? 'مطلوب' : 'is required',
    wrongPhone: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number',
  };

  const mainFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(`${text.firstName} ${text.isRequired}`),
      lastName: Yup.string().required(`${text.lastName} ${text.isRequired}`),
      email: Yup.string()
        .email(lang === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email')
        .required(`${text.email} ${text.isRequired}`),
        phone: Yup.string().required(`${text.phone} ${text.isRequired}`).matches(/^20(1[0-2,5][0-9]{8})$/, text.wrongPhone),
      }),
    onSubmit: async (values) => {
      console.log("values:", values);
      // setTimeout(() => {
      //   setLoading(false);
      //   onSuccess();
      //   onReturn();
      //   toast.success(<Text as="b">Order created successfully</Text>);
      // }, 600);
      try {
        setLoading(true);
    
        // 1. Step 1: Call EndUserLogin API
        const loginBody = {
          phoneNumber: values.phone,
          shopId: shopId,
        };
    
        const loginResponse = await fetch(`${API_BASE_URL}/api/Auth/EndUserLogin/${shopId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginBody),
        });
    
        if (!loginResponse.ok) {
          toast.error('Login failed. Please try again.');
          setLoading(false);
          return;
        }
    
        const loginResult = await loginResponse.json();
    
        if (!loginResult?.refreshToken) {
          toast.error(lang == 'ar'?"لا يمكن إنشاء المستخدم.":"The user cannot be created.");
          setLoading(false);
          return;
        }
        const accessToken = loginResult.accessToken;
    
        const updateValues = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phone,
        };
    
        const updateResponse = await fetch(`${API_BASE_URL}/api/User/UpdateUser`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updateValues),
        });
    
        const updateResult = await updateResponse.json();
    
        if (updateResult.message === 'Access token is invalid') {
          toast.error(lang == 'ar'?"لا يمكن إنشاء المستخدم.":"The user cannot be created.");
          return;
        }
    
        const updatedUserData = {
          phoneNumber: updateResult.updateduser.phoneNumber,
          firstName: updateResult.updateduser.firstName,
          lastName: updateResult.updateduser.lastName,
          email: updateResult.updateduser.email,
        };
    
        toast.success(lang == 'ar'?"تم إنشاء المستخدم بنجاح!":'User created successfully!');
        onSuccess();
        onReturn();
      } catch (error: any) {
        console.error('Error creating customer:', error);
        toast.error(error.message || lang=='ar'?'خطأ في إنشاء العميل.':'Error creating customer.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mainFormik.handleSubmit();
    }}>
      <div className="grid col-span-full sm:grid-cols-2 gap-4 mb-4">
      <Input
          placeholder={text.firstName}
          label={`${text.firstName}:`}
          value={mainFormik.values.firstName}
          onChange={mainFormik.handleChange}
          onBlur={mainFormik.handleBlur}
          name="firstName"
          error={mainFormik.touched.firstName ? mainFormik.errors.firstName : ''}
        />
        <Input
          placeholder={text.lastName}
          label={`${text.lastName}:`}
          value={mainFormik.values.lastName}
          onChange={mainFormik.handleChange}
          onBlur={mainFormik.handleBlur}
          name="lastName"
          error={mainFormik.touched.lastName ? mainFormik.errors.lastName : ''}
        />
        <Input
          type="email"
          placeholder={text.email}
          label={`${text.email}:`}
          value={mainFormik.values.email}
          onChange={mainFormik.handleChange}
          onBlur={mainFormik.handleBlur}
          name="email"
          error={mainFormik.touched.email ? mainFormik.errors.email : ''}
        />
        {/* <Input
          type="tel"
          placeholder={text.phone}
          label={`${text.phone}:`}
          value={mainFormik.values.phone}
          onChange={mainFormik.handleChange}
          onBlur={mainFormik.handleBlur}
          name="phone"
          error={mainFormik.touched.phone ? mainFormik.errors.phone : ''}
        /> */}
        <PhoneNumber
          country={'eg'}
          onlyCountries={['eg']}
          value={mainFormik.values.phone}
          onChange={(value) => mainFormik.setFieldValue('phone', value)}
          onBlur={mainFormik.handleBlur}
          label={text.phone}
          error={mainFormik.touched.phone && mainFormik.errors.phone ? mainFormik.errors.phone : ''}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={()=>{onReturn();}} variant="outline" className="w-full transition-all duration-300 ease-in-out">
          {text.return}
        </Button>
        <Button type="submit" isLoading={loading} className="w-full transition-all duration-300 ease-in-out">
          {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
        </Button>
      </div> 
    </form>
  );
}
