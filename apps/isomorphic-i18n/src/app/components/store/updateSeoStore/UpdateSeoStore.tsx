'use client';

import { PiXBold, PiPlusBold, PiUploadSimple, PiTrashBold } from 'react-icons/pi';
import { GrUpdate } from "react-icons/gr";

import React, { ChangeEvent, useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea, Loader } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './UpdateStore.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { useFileContext } from '../../context/FileContext';
// import RoleSelect from '@/app/shared/tan-table/selectInput';
import FileUpload from '@/app/shared/image-form-upload';
import { ChromePicker } from 'react-color';
import { API_BASE_URL } from '@/config/base-url';
import { useUserContext } from '../../context/UserContext';
import axiosClient from '../../context/api';
import CustomSelect from '../../ui/customForms/CustomSelect';
import Image from 'next/image';
import { useTranslation } from '@/app/i18n/client';
import ShopValidation from '../../validation/ShopValidation';
import ShopValidationAdd from '../../validation/ShopValidationAdd';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import DescTextField from '../../DescTextArea';
import SeoInput from '../../SeoInput';

type Feature = {
  title: string;
  address: string;
};

type Seller = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

type StoresFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
  // id:string
};

export default function UpdateSeoStore({
  title,
  modalBtnLabel = 'إضافة متجر',
  onSuccess,
  lang = 'en',
  // id,
  initialData = {},
}: StoresFormProps & { initialData?: any }) {

  const { closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { fileData } = useUserContext();
  const { t } = useTranslation(lang!, "shop");
  const { couponData, setCouponData } = useUserContext();

  const shopId = GetCookiesClient('shopId') as string;

  const validationSchema = ShopValidationAdd({ lang })

  const mainFormik = useFormik({
    initialValues: {
      titleAr: '',
      titleEn: '',
      metaDescriptionAr: '',
      metaDescriptionEn: '',
      Languages: 0,
      // applyFreeShppingOnTarget: false,
      // showAllCouponsInSideBar: false,
      // freeShppingTarget: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append('titleAr', values.titleAr);
      formData.append('titleEn', values.titleEn);
      formData.append('metaDescriptionAr', values.metaDescriptionAr);
      formData.append('metaDescriptionEn', values.metaDescriptionEn);
      // formData.append('applyFreeShppingOnTarget', values.applyFreeShppingOnTarget as any);
      // formData.append('showAllCouponsInSideBar', values.showAllCouponsInSideBar as any);
      // formData.append('freeShppingTarget', values.freeShppingTarget as any);


      try {
        setLoading(true)
        const response = await axiosClient.put(`${API_BASE_URL}/api/Shop/Update/${shopId}`, formData);


        if (response) {
          closeModal();
          setCouponData(true);
          setLoading(false)

          toast.success(lang === 'ar' ? 'تم التحديث بنجاح!' : 'Updated successfully!');
          //   setUpdateStores(true);
        } else {
          toast.error(
            lang === 'ar'
              ? `فشل في التعديل  `
              : `Failed to update `
          );
        }
      } catch (error) {
        console.error('Error creating shop:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء تعديل المتجر' : 'An error occurred while update the shop');
      }
      finally {
        setLoading(false)

      }
    },
  });
  useEffect(() => {
    const fetchBranchData = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/api/Shop/GetById/${shopId}`);
        const data = response.data;
        mainFormik.setValues({
          titleAr: data.titleAr || '',
          titleEn: data.titleEn || '',
          metaDescriptionAr: data.metaDescriptionAr || '',
          metaDescriptionEn: data.metaDescriptionEn || '',
          Languages: data.Languages || '',
          // applyFreeShppingOnTarget: data.applyFreeShppingOnTarget || false,
          // freeShppingTarget: data.freeShppingTarget !== undefined ? data.freeShppingTarget : 0,
          // showAllCouponsInSideBar: data.showAllCouponsInSideBar || false,
        });

      } catch (error) {
        toast.error(lang === 'ar' ? 'فشل في تحميل البيانات' : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    // if (id) 
    fetchBranchData();
  }, []);


  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      mainFormik.setFieldValue('logoUrl', file);
    }
  };

  const handleRemoveImage = () => {
    mainFormik.setFieldValue('logoUrl', null);
  };
  const handleImageUploadBg = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      mainFormik.setFieldValue('backgroundUrl', file);
    }
  };

  const handleRemoveImageBg = () => {
    mainFormik.setFieldValue('backgroundUrl', null);
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleColorChange = (field: 'mainColor' | 'secondaryColor', color: string) => {
    mainFormik.setFieldValue(field, color);
  };





  return (
    <div style={{
      overscrollBehavior: 'none',
      touchAction: 'none',
    }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{lang === 'ar' ? 'تعديل محركات البحث' : 'Update Seo'}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>

          <div className="space-y-3 mb-5">
            {(Number(mainFormik.values.Languages) === 0 || Number(mainFormik.values.Languages) === 2) && (
              <>
                <SeoInput id='titleAr' label={t('titleAr')} placeholder={t('titleAr')} name="titleAr" value={mainFormik.values.titleAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.titleAr as any && mainFormik.errors.titleAr as any ? mainFormik.errors.titleAr as any : ''} className="mb-4 w-full input-placeholder text-[16px]" inputClassName='text-[16px]' />
                <DescTextField
                  label={t('metaAr')}
                  placeholder={t('metaAr')}
                  id='metaDescriptionAr'
                  name='metaDescriptionAr'
                  value={mainFormik.values.metaDescriptionAr}
                  onChange={mainFormik.handleChange}
                  onBlur={mainFormik.handleBlur}
                  error={mainFormik.touched.metaDescriptionAr && mainFormik.errors.metaDescriptionAr ? mainFormik.errors.metaDescriptionAr : ''}
                />
              </>
            )}
            {(Number(mainFormik.values.Languages) === 1 || Number(mainFormik.values.Languages) === 2) && (
              <>
                <SeoInput id='titleEn' label={t('titleEn')} placeholder={t('titleEn')} name="titleEn" value={mainFormik.values.titleEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.titleEn as any && mainFormik.errors.titleEn as any ? mainFormik.errors.titleEn as any : ''} className="mb-4 w-full input-placeholder text-[16px]" inputClassName='text-[16px]' />
                <DescTextField
                  label={t('metaEn')}
                  placeholder={t('metaEn')}
                  id='metaDescriptionEn'
                  name='metaDescriptionEn'
                  value={mainFormik.values.metaDescriptionEn}
                  onChange={mainFormik.handleChange}
                  onBlur={mainFormik.handleBlur}
                  error={mainFormik.touched.metaDescriptionEn && mainFormik.errors.metaDescriptionEn ? mainFormik.errors.metaDescriptionEn : ''}

                />
              </>
            )}

          </div>
          {/* 
            <Input
              type="number"
              label={t('FreeShppingTarget')}
              placeholder={t('FreeShppingTarget')}
              name="freeShppingTarget"
              value={mainFormik.values.freeShppingTarget !== undefined ? String(mainFormik.values.freeShppingTarget) : ""}
              onChange={(e) => mainFormik.setFieldValue("freeShppingTarget", Number(e.target.value))}
              onBlur={mainFormik.handleBlur}
              error={mainFormik.touched.freeShppingTarget && mainFormik.errors.freeShppingTarget ? mainFormik.errors.freeShppingTarget : ''}
              className="mb-4 w-full"
              disabled={!mainFormik.values.applyFreeShppingOnTarget}
            /> */}

          {/* <div className="">

            <div className="sm:flex-row flex-col flex justify-between">
              <Switch
                label={t('applyFreeShppingOnTarget')}
                labelPlacement={lang === 'ar' ? "left" : "right"}

                checked={mainFormik.values.applyFreeShppingOnTarget}
                onBlur={mainFormik.handleBlur}
                onChange={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  mainFormik.setFieldValue("applyFreeShppingOnTarget", e.target.checked);
                  console.log('e.target.checked', e.target.checked);

                }}
              />
              <Switch
                label={t('showAllCouponsInSideBar')}
                labelPlacement={lang === 'ar' ? "left" : "right"}

                checked={mainFormik.values.showAllCouponsInSideBar}
                onBlur={mainFormik.handleBlur}
                onChange={(e) => {
                  // e.preventDefault();
                  // e.stopPropagation();
                  mainFormik.setFieldValue("showAllCouponsInSideBar", e.target.checked);
                  console.log('e.target.checked', e.target.checked);

                }}
              />
            </div>


          </div> */}

          {/* <CustomSelect 
          id='applyFreeShppingOnTarget'
          name='applyFreeShppingOnTarget'
          onBlur={mainFormik.handleBlur}
          onChange={mainFormik.handleChange}
          options={options}
          value={mainFormik.values.applyFreeShppingOnTarget}
          placeholder={('applyFreeShppingOnTarget')}
          /> */}
          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-3">

            <Button type='submit'
              className={`text-white text-base rounded-lg w-full  py-3   
                                        ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                                    `}>
              {loading ? (
                <Loader variant="spinner" size="lg" />
              ) : (
                <>
                  {t('update1')}
                </>
              )}
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}