'use client';

import { PiXBold, PiPlusBold, PiUploadSimple, PiTrashBold } from 'react-icons/pi';
import { GrUpdate } from "react-icons/gr";

import React, { ChangeEvent, useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea, Switch, Loader } from 'rizzui';

import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './UpdateStore.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { HexColorPicker, RgbaColorPicker } from 'react-colorful';

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
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';

import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { Controller } from 'react-hook-form';
import DescTextField from '../../DescTextArea';
type Feature = {
  title: string;
  address: string;
};

export interface Currency {
  id?: string;
  name: string;
  abbreviation: string;

}
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


export default function StoresForm({
  title,
  modalBtnLabel = 'إضافة متجر',
  onSuccess,
  lang = 'en',
  // id,
  initialData = {},
}: StoresFormProps & { initialData?: any }) {
  const shopId = GetCookiesClient('shopId');
  const { closeModal } = useModal();
  const [loading, setLoading] = useState(true);
  const { fileData } = useUserContext();
  const { t } = useTranslation(lang!, "shop");
  const { couponData, setCouponData, setProgressData } = useUserContext();
  const validationSchema = ShopValidation({ lang })
  const [currencies, setCurrencies] = useState<{ value: string; label: string }[]>([]);

  async function getCurrenciesAndLog() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Currency/GetAllCurrencies`,
        {
          headers: {

            'Accept-Language': lang,

          },
        })
      const data: Currency[] = await response.json()
      if (data && data) {
        const options = data?.map((currency) => ({
          value: currency?.id?.toString(),
          label: currency?.name,
        }));
        setCurrencies(options as any);
      } else {
        console.log("فشل في جلب العملات");
      }
    } catch (err) {
      console.error("Failed to fetch shop:", err);
      return null;
    }
  }
  useEffect(() => {
    getCurrenciesAndLog()

  }, [])

  const mainFormik = useFormik({
    initialValues: {
      nameAr: '',
      nameEn: '',
      // titleAr: '',
      // titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      vat: '',
      vatType: '',
      // metaDescriptionAr: '',
      // metaDescriptionEn: '',
      currencyId: '',
      shopType: '',
      logoUrl: null as File | string | null,
      backgroundUrl: null as File | string | null,
      subdomainName: '',
      mainColor: '',
      secondaryColor: '',
      Languages: 0,
      ApplyServiceOnDineInOnly: false,
      ApplyVatOnDineInOnly: false,
      Service: '',
      // applyFreeShppingOnTarget: false,
      // showAllCouponsInSideBar: false,
      // Service: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('nameAr', values.nameAr);
      formData.append('nameEn', values.nameEn);
      formData.append('descriptionAr', values.descriptionAr);
      formData.append('descriptionEn', values.descriptionEn);
      formData.append('Languages', values.Languages as any);
      // formData.append('titleAr', values.titleAr);
      // formData.append('titleEn', values.titleEn);
      // formData.append('metaDescriptionAr', values.metaDescriptionAr);
      // formData.append('metaDescriptionEn', values.metaDescriptionEn);
      formData.append('SubdomainName', values.subdomainName);
      formData.append('MainColor', values.mainColor);
      formData.append('currencyId', values.currencyId);
      formData.append('vat', values.vat);
      formData.append('vatType', values.vatType);
      formData.append('SecondaryColor', values.secondaryColor);
      formData.append('ApplyServiceOnDineInOnly', String(values.ApplyServiceOnDineInOnly));
      formData.append('Service', values.Service);
      formData.append('ApplyVatOnDineInOnly', String(values.ApplyVatOnDineInOnly) as any);
      formData.append('sourceChannel', '0');
      // formData.append('applyFreeShppingOnTarget', values.applyFreeShppingOnTarget as any);
      // formData.append('showAllCouponsInSideBar', values.showAllCouponsInSideBar as any);
      // formData.append('freeShppingTarget', values.freeShppingTarget as any);
      if (values.logoUrl) {
        formData.append('Logo', values.logoUrl);
      }
      if (values.backgroundUrl) {
        formData.append('Background', values.backgroundUrl);
      }


      try {
        setLoading(true);
        const response = await axiosClient.put(`${API_BASE_URL}/api/Shop/Update/${shopId}`, formData);
        if (response) {
          closeModal();
          setCouponData(true);
          setProgressData(true);
          toast.success(lang === 'ar' ? 'تم تعديل المتجر بنجاح!' : 'Shop Updated successfully!');
          //   setUpdateStores(true);
        } else {
          toast.error(
            lang === 'ar'
              ? `فشل في تعديل المتجر: `
              : `Failed to update shop: `
          );
        }
      } catch (error) {
        console.error('Error creating shop:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء إنشاء المتجر' : 'An error occurred while creating the shop');
        setLoading(false);
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
          nameEn: data.nameEn || '',
          nameAr: data.nameAr || '',
          descriptionAr: data.descriptionAr || '',
          descriptionEn: data.descriptionEn || '',
          Languages: data.languages || '',
          // titleAr: data.titleAr || '',
          // titleEn: data.titleEn || '',
          // metaDescriptionAr: data.metaDescriptionAr || '',
          // metaDescriptionEn: data.metaDescriptionEn || '',
          currencyId: data.currencyId || '',
          vat: data.vat ?? '',
          vatType: data.vatType ?? '',
          shopType: data.shopType || '',
          logoUrl: data.logoUrl || null,
          backgroundUrl: data.backgroundUrl || null,
          subdomainName: data.subdomainName || '',
          mainColor: data.mainColor || '',
          secondaryColor: data.secondaryColor || '',
          ApplyServiceOnDineInOnly: data.applyServiceOnDineInOnly || false,
          Service: data.service || '',
          ApplyVatOnDineInOnly: data.applyVatOnDineInOnly || false,
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

  const optionsApplyTwoLanguages = [
    { value: 0, label: t('OneLanguages') },
    { value: 1, label: t('EnLanguages') },
    { value: 2, label: t('TwoLanguages') },
  ];

  const options = [
    { label: lang === 'ar' ? 'نسبة مئوية' : 'Percentage', value: '0' },
    { label: lang === 'ar' ? 'رقم ثابت' : 'Fixed number', value: '1' },
  ]



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        {/* <Title as="h4" className="text-lg mb-3">{lang === 'ar' ? 'بيانات المتجر :' : 'Store Data:'}</Title> */}
        <form onSubmit={(e) => {
          e.preventDefault();
          mainFormik.handleSubmit();
        }}>
          <div className="flex sm:flex-row flex-col gap-4 justify-between">
{(Number(mainFormik.values.Languages) === 0 || Number(mainFormik.values.Languages) === 2) && (

            <Input label={t('shopNameAr')} placeholder={t('shopNameAr')} name="nameAr"
              value={mainFormik.values.nameAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameAr && mainFormik.errors.nameAr ? mainFormik.errors.nameAr : ''} className="mb-4 sm:w-1/2 input-placeholder text-[16px]" inputClassName='text-[16px]' />
            )}
{(Number(mainFormik.values.Languages) === 1 || Number(mainFormik.values.Languages) === 2) && (
  <Input label={t('shopNameEn')} placeholder={t('shopNameEn')} name="nameEn"
  value={mainFormik.values.nameEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.nameEn && mainFormik.errors.nameEn ? mainFormik.errors.nameEn : ''} className="mb-4 sm:w-1/2 input-placeholder text-[16px]" inputClassName='text-[16px]'  />
)}
          </div>

          <div className="space-y-3">
{(Number(mainFormik.values.Languages) === 0 || Number(mainFormik.values.Languages) === 2) && (
              <DescTextField
                label={t('descriptionAr')}
                placeholder={t('descriptionAr')}
                id='descriptionAr'
                name='descriptionAr'
                value={mainFormik.values.descriptionAr}
                onBlur={mainFormik.handleBlur}
                onChange={mainFormik.handleChange}
                error={mainFormik.touched.descriptionAr as any && mainFormik.errors.descriptionAr  as any ? mainFormik.errors.descriptionAr  as any : ''}

              />
            )}
{(Number(mainFormik.values.Languages) === 1 || Number(mainFormik.values.Languages) === 2) && (
            <DescTextField
            label={t('descriptionEn')}
            placeholder={t('descriptionEn')}
            id='descriptionEn'
            name='descriptionEn'
            value={mainFormik.values.descriptionEn}
            onChange={mainFormik.handleChange}
            onBlur={mainFormik.handleBlur}
            error={mainFormik.touched.descriptionEn && mainFormik.errors.descriptionEn ? mainFormik.errors.descriptionEn : ''}
            />
          )}
          </div>

          {/* <Input label={text.subDomain} placeholder={text.subDomain} name="subDomain" value={mainFormik.values.subdomainName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.subdomainName && mainFormik.errors.subdomainName ? mainFormik.errors.subdomainName : ''} className="mb-4" /> */}
          {/* <label className="block text-sm font-medium mb-2 mt-3">{t('subDomain')}</label>
          <Input
            prefix="https://"
            suffix=".ordrat.com"
            // label={t('subDomain')}
            placeholder={t('subDomain')}
            id='subdomainName'
            size='lg'
            value={mainFormik.values.subdomainName.split('.ordrat.com')[0]}
            name='subdomainName'
            className='ltr-input '
            style={{ direction: 'ltr', textAlign: 'left' }}
            onBlur={mainFormik.handleBlur}
            onChange={(e) => {
              const value = e.target.value;
              mainFormik.handleChange(e);
              mainFormik.setFieldValue('subdomainName', `${value}.ordrat.com`);
            }}
            error={
              mainFormik.touched.subdomainName as any && mainFormik.errors.subdomainName as any
                ? mainFormik.errors.subdomainName as any
                : ''
            }
          /> */}
          <div className="flex sm:flex-row flex-col gap-4 justify-between mt-3 md:mb-0 mb-3">

            <Input label={t('vat')} placeholder={t('vat')} name="vat"
              value={mainFormik.values.vat} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.vat && mainFormik.errors.vat ? mainFormik.errors.vat : ''} className="mb-4 sm:w-1/2 input-placeholder text-[16px]" inputClassName='text-[16px]'  />
            <div className=" sm:w-1/2">
              <label className="block text-sm font-medium mb-2 ">{t('vatType')}</label>

              <CustomSelect id='vatType' placeholder={t('vatType')} name="vatType"
                onBlur={mainFormik.handleBlur}
                value={options.find(option => option.value == mainFormik.values.vatType)}
                onChange={(option: any) => mainFormik.setFieldValue('vatType', option?.value)}
                options={options}
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
                  menu: (provided: any) => ({
                    ...provided,
                    zIndex: 9999,
                  }),

                }}
              />
            </div>
          </div>
          <div className="flex sm:flex-row flex-col gap-4 justify-between mt-3 md:mb-0 mb-3">

            <div className="sm:w-1/2">
              <label htmlFor="Languages" className="font-medium">{t('optionsApplyTwoLanguages')}</label>
              <CustomSelect
                placeholder={t('optionsApplyTwoLanguages')}
                id="Languages"
                InputClass="mt-1.5"
                name="Languages"
                value={optionsApplyTwoLanguages.find(option => option.value == mainFormik.values.Languages as any)}
                options={optionsApplyTwoLanguages}
                onBlur={mainFormik.handleBlur}
                onChange={(selectedOption: any) => {
                mainFormik.setFieldValue('Languages', Number(selectedOption.value));
                }}
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
                  menu: (provided: any) => ({
                    ...provided,
                    zIndex: 9999,
                  }),

                }}
              />

            </div>
            <div className=" sm:w-1/2">
              <label className="block text-sm font-medium mb-2 ">{t('currency')}</label>
              <CustomSelect
                id='currencyId'
                name='currencyId'
                onBlur={mainFormik.handleBlur}
                value={currencies.find(option => option.value === mainFormik.values.currencyId)}
                options={currencies}
                // value={mainFormik.values.currencyId}
                placeholder={('currencyId')}
                onChange={(option: any) => mainFormik.setFieldValue('currencyId', option?.value)}
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
                  menu: (provided: any) => ({
                    ...provided,
                    zIndex: 9999,
                  }),

                }}
              />
            </div>
          </div>
          <div className="sm:flex gap-4 mt-5">
            <div className="mb-3 sm:w-1/2">
              <label className="block text-sm font-medium mb-2">{t('mainColor')}</label>
              {/* <ChromePicker
                color={mainFormik.values.mainColor}
                onChangeComplete={(color) => handleColorChange('mainColor', color.hex)}
                styles={{
                  default: {
                    picker: {
                      width: '100%',
                    },
                  },
                }}
              /> */}
              <HexColorPicker
                color={mainFormik.values.mainColor}
                onChange={(color) => handleColorChange('mainColor', color as any)} className='!w-full' />
              {mainFormik.touched.mainColor && mainFormik.errors.mainColor && (
                <div className="text-red-500 text-sm">{mainFormik.errors.mainColor}</div>
              )}
            </div>
            <div className="mb-3 sm:w-1/2" >
              <label className="block text-sm font-medium mb-2">{t('secondaryColor')}</label>
              {/* <ChromePicker
                color={mainFormik.values.seconda ryColor}
                onChangeComplete={(color) => handleColorChange('secondaryColor', color.hex)}
                styles={{
                  default: {
                    picker: {
                      width: '100%',
                    },
                  },
                }}
              /> */}


              <HexColorPicker
                color={mainFormik.values.secondaryColor as any}
                className='!w-full'
                onChange={(color) => handleColorChange('secondaryColor', color as any)} />
              <div className="flex flex-col items-start gap-4">

                {mainFormik.touched.secondaryColor && mainFormik.errors.secondaryColor && (
                  <div className="text-red-500 text-sm">{mainFormik.errors.secondaryColor}</div>
                )}
              </div>
            </div>
          </div>
          <div className="sm:flex-row flex-col flex justify-between items-center gap-5 py-2 md:py-5">
            <div className="w-full sm:w-1/2">

              <label className="block text-sm font-medium mb-2">{t('logo')}</label>
              <div className="flex items-end ">

                <div className={`${mainFormik.values.logoUrl ? "hidden" : "flex"} w-full flex-col md:flex-row gap-4`}>
                  {mainFormik.values.logoUrl ? (
                    <></>
                  ) : (
                    <label className="w-full h-[40px] flex justify-center items-center cursor-pointer bg-gray-100 border border-gray-300 rounded-md px-6 md:px-3 py-2 text-sm">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e)}
                      />
                      <PiUploadSimple className="w-4 h-4 text-gray-600" />
                    </label>
                  )}
                </div>
                <div className={`${mainFormik.values.logoUrl ? "flex" : "hidden"} w-full justify-center items-center gap-4`}>
                  {mainFormik.values.logoUrl && (
                    <div
                      className="flex min-h-[58px] w-full items-center rounded-md border border-muted px-3 dark:border-gray-300"
                    >
                      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-muted bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
                        {mainFormik.values.logoUrl && (mainFormik.values.logoUrl instanceof File || typeof mainFormik.values.logoUrl === 'string') && (
                          <>
                            {typeof mainFormik.values.logoUrl === 'string' ?
                              <Image
                                src={mainFormik.values.logoUrl}
                                fill
                                className="object-contain"
                                priority
                                alt={`choice`}
                                sizes="(max-width: 768px) 100vw"
                              />
                              :
                              <Image
                                src={URL.createObjectURL(mainFormik.values.logoUrl)}
                                fill
                                className="object-contain"
                                priority
                                alt={mainFormik.values.logoUrl.name}
                                sizes="(max-width: 768px) 100vw"
                              />
                            }
                          </>
                        )}
                      </div>
                      <div className="truncate px-2.5">{typeof mainFormik.values.logoUrl === 'string' ? `Logo Image` : mainFormik.values.logoUrl.name}</div>
                      <ActionIcon
                        onClick={() => handleRemoveImage()}
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="ms-auto flex-shrink-0 p-0 dark:bg-red-dark/20"
                      >
                        <PiTrashBold className="w-6" />
                      </ActionIcon>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium mb-2">{t('Bg')}</label>
              <div className="flex items-end ">
                <div className={`${mainFormik.values.backgroundUrl ? "hidden" : "flex"} w-full flex-col md:flex-row gap-4`}>
                  {mainFormik.values.backgroundUrl ? (
                    <></>
                  ) : (
                    <label className="w-full h-[40px] flex justify-center items-center cursor-pointer bg-gray-100 border border-gray-300 rounded-md px-6 md:px-3 py-2 text-sm">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUploadBg(e)}
                      />
                      <PiUploadSimple className="w-4 h-4 text-gray-600" />
                    </label>
                  )}
                </div>
                <div className={`${mainFormik.values.backgroundUrl ? "flex" : "hidden"} w-full justify-center items-center gap-4`}>
                  {mainFormik.values.backgroundUrl && (
                    <div
                      className="flex min-h-[58px] w-full items-center rounded-md border border-muted px-3 dark:border-gray-300"
                    >
                      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-muted bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
                        {mainFormik.values.backgroundUrl && (mainFormik.values.backgroundUrl instanceof File || typeof mainFormik.values.backgroundUrl === 'string') && (
                          <>
                            {typeof mainFormik.values.backgroundUrl === 'string' ?
                              <Image
                                src={mainFormik.values.backgroundUrl}
                                fill
                                className="object-contain"
                                priority
                                alt={`choice`}
                                sizes="(max-width: 768px) 100vw"
                              />
                              :
                              <Image
                                src={URL.createObjectURL(mainFormik.values.backgroundUrl)}
                                fill
                                className="object-contain"
                                priority
                                alt={mainFormik.values.backgroundUrl.name}
                                sizes="(max-width: 768px) 100vw"
                              />
                            }
                          </>
                        )}
                      </div>
                      <div className="truncate px-2.5">{typeof mainFormik.values.backgroundUrl === 'string' ? `background Image` : mainFormik.values.backgroundUrl.name}</div>
                      <ActionIcon
                        onClick={() => handleRemoveImageBg()}
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="ms-auto flex-shrink-0 p-0 dark:bg-red-dark/20"
                      >
                        <PiTrashBold className="w-6" />
                      </ActionIcon>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="space-y-3 mb-5">
            <Input label={t('titleAr')} placeholder={t('titleAr')} name="titleAr" value={mainFormik.values.titleAr} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.titleAr && mainFormik.errors.titleAr ? mainFormik.errors.titleAr : ''} className="mb-4 w-full" />
            <Textarea
              label={t('metaAr')}
              placeholder={t('metaAr')}
              id='metaDescriptionAr'
              size='lg'
              name='metaDescriptionAr'
              className=''
              value={mainFormik.values.metaDescriptionAr}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              error={mainFormik.touched.metaDescriptionAr && mainFormik.errors.metaDescriptionAr ? mainFormik.errors.metaDescriptionAr : ''}
            />
            <Input label={t('titleEn')} placeholder={t('titleEn')} name="titleEn" value={mainFormik.values.titleEn} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.titleEn && mainFormik.errors.titleEn ? mainFormik.errors.titleEn : ''} className="mb-4 w-full" />

            <Textarea
              label={t('metaEn')}
              placeholder={t('metaEn')}
              id='metaDescriptionEn'
              size='lg'
              name='metaDescriptionEn'
              className=''
              value={mainFormik.values.metaDescriptionEn}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              error={mainFormik.touched.metaDescriptionEn && mainFormik.errors.metaDescriptionEn  ? mainFormik.errors.metaDescriptionEn  : ''}

            />


          </div> */}

          {/* <Input
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
          <div className="sm:flex-row flex-col flex justify-between">

            <Switch
              label={lang === 'ar' ? 'تطبيق الخدمة علي الصالة فقط' : 'Apply Service On DineIn Only'}

              labelPlacement={lang === 'ar' ? "left" : "right"}
              checked={mainFormik.values.ApplyServiceOnDineInOnly}
              onBlur={mainFormik.handleBlur}
              onChange={(e) => {
                // e.preventDefault();
                // e.stopPropagation();
                mainFormik.setFieldValue("ApplyServiceOnDineInOnly", e.target.checked);
                console.log('e.target.checked', e.target.checked);

              }}
            />
            <Switch

              label={lang === 'ar' ? 'تطبيق الضريبة علي الصالة فقط' : 'Apply Vat On DineIn Only'}
              labelPlacement={lang === 'ar' ? "left" : "right"}

              checked={mainFormik.values.ApplyVatOnDineInOnly}
              onBlur={mainFormik.handleBlur}
              onChange={(e) => {
                // e.preventDefault();
                // e.stopPropagation();
                mainFormik.setFieldValue("ApplyVatOnDineInOnly", e.target.checked);
                console.log('e.target.checked', e.target.checked);

              }}
            />
          </div>

          <Input
            type="number"
            label={lang === 'ar' ? 'سعر الخدمة' : 'Service Price'}
            placeholder={t('Service')}
            name="Service"
            value={mainFormik.values.Service !== undefined ? String(mainFormik.values.Service) : ""}
            onChange={(e) => mainFormik.setFieldValue("Service", Number(e.target.value))}
            onBlur={mainFormik.handleBlur}
            error={mainFormik.touched.Service && mainFormik.errors.Service ? mainFormik.errors.Service : ''}
            className="mt-4 w-full input-placeholder text-[16px]" inputClassName='text-[16px]' 
            disabled={!mainFormik.values.ApplyServiceOnDineInOnly}
          />
          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-3">
            {/* <Button type="submit" className="w-full">
              
              {t('update')}<GrUpdate className="ms-1.5 h-[17px] w-[17px]" />
            </Button> */}
            <Button type='submit'
              className={`text-white text-base rounded-lg w-full  py-3   
                            ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
                        `}>
              {loading ? (
                <Loader variant="spinner" size="lg" />
              ) : (
                <>
                  {t('update')}
                </>
              )}
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
}