'use client';

import { PiXBold, PiPlusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Switch } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from '../TablesForm/TablesForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-datepicker/dist/react-datepicker.css';
import axiosClient from '@/app/components/context/api';
import { useUserContext } from '@/app/components/context/UserContext';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import available from '@public/assets/tables/available.png';
import occupied from '@public/assets/tables/occupied.png';
import reserved from '@public/assets/tables/reserved.png';
import RadioSelection from '../../ui/radioSelect/radioSelect';

type TablesFormProps = {
  title?: string;
  lang: string;
  languages: number;
  initData: any;
};

export default function UpdateTablesForm({
  title,
  lang = 'en',
  languages,
  initData
}: TablesFormProps) {
  const mainBranch = GetCookiesClient('mainBranch');
  const { closeModal } = useModal();
  const text = {
    descriptionEn: lang === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)',
    descriptionAr: lang === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)',
    tableNumber: lang === 'ar' ? 'رقم الطاولة' : 'Table Number',
    tableStatus: lang === 'ar' ? 'الحالة' : 'Status',
    tableNumberPrefix: lang === 'ar' ? 'T' : 'T',

    submit: lang === 'ar' ? 'تعديل' : 'Update',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const requiredMessage2 = lang === 'ar' ? 'مطلوبة' : 'is required';
  const [isSubmit, setIsSubmit] = useState(false);
  const { setTablesData } = useUserContext();

  const mainFormSchema = Yup.object().shape({
    descriptionEn: Yup.string().required(text.descriptionEn + ' ' + requiredMessage),
    descriptionAr: Yup.string().required(text.descriptionAr + ' ' + requiredMessage),
    tableNumber: Yup.string().required(text.descriptionAr + ' ' + requiredMessage),
    // tableStatus: Yup.string().required(text.tableStatus + ' ' + requiredMessage2),
  });

  const mainFormik = useFormik({
    initialValues: {
      descriptionEn: initData.descriptionEn || '',
      descriptionAr: initData.descriptionAr || '',
      tableNumber: initData.tableNumber || '',
      // tableStatus: '',
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      setIsSubmit(true);
      const payload = {
        // shopId: mainBranch,
        descriptionEn: values.descriptionEn,
        descriptionAr: values.descriptionAr,
        tableNumber: values.tableNumber,
        // tableStatus: Number(values.tableStatus),
      };
      console.log("payload: ",payload);
      
      try {
        const response = await axiosClient.put(`/api/Table/UpdateTable/${initData.id}`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Update Response:', response.data);
        toast.success(
          lang === 'ar' ? 'تم تحديث الطاولة بنجاح!' : 'Table updated successfully!'
        );
        setIsSubmit(false);
        closeModal();
        setTablesData(true);
      } catch (error: any) {
        setIsSubmit(false);
    
        const isDuplicateError =
          error?.response?.data?.message &&
          error.response.data.message.includes('IX_Tables_BranchId_TableNumber');
    
        if (isDuplicateError) {
          mainFormik.setFieldError(
            'tableNumber',
            lang === 'ar'
              ? 'رقم الطاولة مستخدم بالفعل'
              : 'Table number already exists for this shop.'
          );
        } else {
          toast.error(
            lang === 'ar'
              ? 'فشل في تحديث الطاولة. حاول مجددا.'
              : 'Failed to update table. Please try again.'
          );
        }
      }
    },
  });

  useEffect(() => {
    if (languages === 0) {
      mainFormik.setFieldValue('descriptionEn', 'no data');
    } else if (languages === 1) {
      mainFormik.setFieldValue('descriptionAr', 'no data');
    }
  }, [languages]);

  const statusOptions = [
    { 
      value: lang === 'ar' ?'0' : '0', 
      label: lang === 'ar' ? 'متاحة' : 'Available', 
      image: available,
      class: 'border-2 border-green-400', 
    },
    { 
      value: lang === "ar" ?'1' : '1', 
      label: lang === 'ar' ? 'مشغولة' : 'Occupied', 
      image: occupied, 
      class: 'border-2 border-yellow-400', 
      bgColor: 'yellow-400' 
    },
    { 
      value: lang === "ar" ?'2' : '2', 
      label: lang === 'ar' ? 'محجوزة' : 'Reserved', 
      image: reserved, 
      class: 'border-2 border-red-400', 
    },
  ];

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
            {languages!=1 &&(
              <Input label={text.descriptionAr} placeholder={text.descriptionAr} name="descriptionAr" value={mainFormik.values.descriptionAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={typeof mainFormik.errors.descriptionAr === 'string' ? mainFormik.errors.descriptionAr : undefined} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            )}
            {languages!=0 &&(
              <Input label={text.descriptionEn} placeholder={text.descriptionEn} name="descriptionEn" value={mainFormik.values.descriptionEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={typeof mainFormik.errors.descriptionEn === 'string' ? mainFormik.errors.descriptionEn : undefined} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
            )}
            <Input prefix={text.tableNumberPrefix} type="number" label={text.tableNumber} placeholder={text.tableNumber} name="tableNumber" value={mainFormik.values.tableNumber} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={typeof mainFormik.errors.tableNumber === 'string' ? mainFormik.errors.tableNumber : undefined} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
          </div>

          {/* <div className='mt-4'>
            <label className="block text-sm font-medium pb-1">
              {text.tableStatus}
            </label>
            <RadioSelection
              options={statusOptions}
              formik={mainFormik}
              name="tableStatus"
              error={mainFormik.errors.tableStatus}
              lang={lang}
              ImageClassName="w-24 h-24"
              labelClassName="font-bold"
            />
          </div> */}

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
