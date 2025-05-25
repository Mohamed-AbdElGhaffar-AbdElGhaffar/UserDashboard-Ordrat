'use client';

import { PiXBold, PiArrowsClockwiseBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { ActionIcon, Title, Button, Input, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from '../printerTableForm/TableForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import Cookies from 'js-cookie';

type TableFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  data: any;
};

export default function UpdatePrinterForm({
  title,
  onSuccess,
  lang = 'en',
  data,
}: TableFormProps) {
  const { closeModal } = useModal();
  const text = {
    name: lang === 'ar' ? 'الأسم' : 'Name',
    IP: lang === 'ar' ? 'IP' : 'IP',

    submit: lang === 'ar' ? 'تعديل' : 'Update',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [isSubmit, setIsSubmit] = useState(false);
  const { setPrintersData, mainBranch } = useUserContext();

  const mainFormSchema = Yup.object().shape({
    name: Yup.string().required(text.name + ' ' + requiredMessage),
    IP: Yup.string().required(text.IP + ' ' + requiredMessage),
  });

  const mainFormik = useFormik({
    initialValues: {
      name: data.name || '',
      IP: data.ip || '',
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      setIsSubmit(true);
      
      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('IP', values.IP);
      formData.append('BranchId', mainBranch);

      try {
        const response = await axiosClient.put(
          `/api/Printer/UpdatePrinter/${data.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
    
        toast.success(
          lang === 'ar' ? 'تم تعديل الطابعة بنجاح!' : 'Printer updated successfully!'
        );
        setIsSubmit(false);
        closeModal();
        setPrintersData(true);

      } catch (error) {
        const axiosError = error as AxiosError;
        setIsSubmit(false);
        if (axiosError.response && axiosError.response.status === 401) {
          Cookies.remove('shopId');
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          Cookies.remove('roles');
          Cookies.remove('branches');
          Cookies.remove('mainBranch');
          Cookies.remove('name');
          Cookies.remove('email');
          Cookies.remove('sellerId');
          Cookies.remove('userType');
          localStorage.clear(); 
          window.location.href = `/${lang}/signin`;
          toast.error(
            lang === 'ar'
              ? 'تم تسجيل خروجك. يرجى تسجيل الدخول مرة أخرى.'
              : 'You have been logged out. Please sign in again.'
          );
          window.location.href = `/${lang}/signin`;
        } else {
          toast.error(
            lang === 'ar'
              ? 'فشل في تعديل الطابعة. حاول مجددا.'
              : 'Failed to update printer. Please try again.'
          );
        }
      }
    },
  });

  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        <div className="flex flex-row items-center justify-center w-full">
          <img src="/assets/modals/printer.png" alt="Active Icon" width={96} height={96} />
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>
          <div className="flex flex-col gap-4">
            <Input label={text.name} placeholder={text.name} name="name" value={mainFormik.values.name} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={typeof mainFormik.errors.name === 'string' ? mainFormik.errors.name : undefined} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            <Input label={text.IP} placeholder={text.IP} name="IP" value={mainFormik.values.IP} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={typeof mainFormik.errors.IP === 'string' ? mainFormik.errors.IP : undefined} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
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
