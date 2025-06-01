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
import Select from 'react-select';

type TableFormProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  data: any;
  categories: any[];
};

export default function CategoryPrinterForm({
  title,
  onSuccess,
  lang = 'en',
  data,
  categories
}: TableFormProps) {
  // console.log("categories: ",categories);
  // console.log("data: ",data);
  
  const { closeModal } = useModal();
  const text = {
    selectedCategoryIds: lang === 'ar' ? 'الاقسام' : 'Categories',

    submit: lang === 'ar' ? 'تعيين' : 'Assign',
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [isSubmit, setIsSubmit] = useState(false);
  const { setPrintersData, mainBranch } = useUserContext();
  const initialCategoryIds = data.categoryPrinterDtos.map((cat: any) => cat.id);
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id,
    label: lang === 'ar' ? cat.name : cat.name,
  }));

  const mainFormSchema = Yup.object().shape({
  });

  const mainFormik = useFormik({
    initialValues: {
      selectedCategoryIds: initialCategoryIds,
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      setIsSubmit(true);
      const selectedIds = values.selectedCategoryIds;
      const originalIds = initialCategoryIds;

      const addedCategories = selectedIds.filter((id: any) => !originalIds.includes(id));
      const removedCategories = originalIds.filter((id: any) => !selectedIds.includes(id));

      console.log('Added:', addedCategories);
      console.log('Removed:', removedCategories);
      try {
        if (addedCategories.length === 0 && removedCategories.length === 0) {
          toast(lang === 'ar' ? 'لا تغييرات' : 'No changes');
          closeModal();
          return;
        }
    
        // Add new categories
        for (const categoryId of addedCategories) {
          const formData = new FormData();
          formData.append('PrinterId', data.id);
          formData.append('categoryId', categoryId);
    
          await axiosClient.post('/api/CategoryPrinter/Create', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
    
        // Remove unselected categories
        for (const categoryId of removedCategories) {
          await axiosClient.delete(`/api/CategoryPrinter/Delete/${categoryId}/${data.id}`);
        }
    
        toast.success(
          lang === 'ar' ? 'تم تحديث الأقسام بنجاح!' : 'Categories updated successfully!'
        );
        setPrintersData(true);
        closeModal();
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
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
          Cookies.remove('subdomain');
          localStorage.clear();
          window.location.href = `/${lang}/signin`;
          toast.error(lang === 'ar' ? 'يرجى تسجيل الدخول مرة أخرى.' : 'Please sign in again.');
        } else {
          toast.error(lang === 'ar' ? 'حدث خطأ ما.' : 'Something went wrong.');
        }
      } finally {
        setIsSubmit(false);
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
        <div className="flex flex-row items-center justify-center w-full mb-4">
          <img src="/assets/modals/printer.png" alt="Active Icon" width={96} height={96} />
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>
          <div className="flex flex-col gap-4">
            <Select
              isMulti
              name="selectedCategoryIds"
              options={categoryOptions}
              value={categoryOptions.filter(opt => mainFormik.values.selectedCategoryIds.includes(opt.value))}
              onChange={(selectedOptions) => {
                mainFormik.setFieldValue('selectedCategoryIds', selectedOptions.map(opt => opt.value));
              }}
              menuPlacement="auto"
              maxMenuHeight={80} // Set dropdown menu height
              styles={{
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 80,
                  overflowY: 'auto',
                }),
                option: (provided) => ({
                  ...provided,
                  paddingTop: 6,
                  paddingBottom: 6,
                  fontSize: 14,
                }),
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-10">
            <Button type="submit" isLoading={isSubmit} disabled={isSubmit} className="w-full transition-all duration-300 ease-in-out">
              {text.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
