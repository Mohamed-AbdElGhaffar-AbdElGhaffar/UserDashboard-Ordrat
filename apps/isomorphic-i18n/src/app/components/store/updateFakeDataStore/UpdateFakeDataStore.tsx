'use client';

import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { ActionIcon, Title, Button, Switch ,Loader} from 'rizzui';
import { PiXBold } from 'react-icons/pi';
import { GrUpdate } from "react-icons/gr";
import toast from 'react-hot-toast';
import { useModal } from '@/app/shared/modal-views/use-modal';
import { useTranslation } from '@/app/i18n/client';
import CustomInput from '../../ui/customForms/CustomInput';
import axiosClient from '../../context/api';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import { useNextStep } from 'nextstepjs';

type StoresFormProps = {
  title?: string;
  modalBtnLabel?: string;
  onSuccess?: () => void;
  lang: string;
};

export default function UpdateFakeDataStore({
  title,
  onSuccess,
  lang = 'en',
}: StoresFormProps) {
  const { closeModal } = useModal();
  const { t } = useTranslation(lang!, "shop");
  const { setCouponData } = useUserContext();

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [currentFakeDataId, setCurrentFakeDataId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const shopId = GetCookiesClient('shopId') as string;
  const { setCurrentStep, closeNextStep, isNextStepVisible } = useNextStep();

  const formik = useFormik({
    initialValues: {
      isFakeViewersAvailable: false,
      minimumFakeViewers: 0,
      maximumFakeViewers: 0,
      isFakeSoldNumberAvailable: false,
      minimumFakeSoldNumber: 0,
      maximumFakeSoldNumber: 0,
      lastSoldNumberInHours: 0,
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const formData = new FormData();
        formData.append('IsFakeViewersAvailable', String(values.isFakeViewersAvailable));
        formData.append('MinimumFakeViewers', String(values.minimumFakeViewers));
        formData.append('MaximumFakeViewers', String(values.maximumFakeViewers));
        formData.append('IsFakeSoldNumberAvailable', String(values.isFakeSoldNumberAvailable));
        formData.append('MinimumFakeSoldNumber', String(values.minimumFakeSoldNumber));
        formData.append('MaximumFakeSoldNumber', String(values.maximumFakeSoldNumber));
        formData.append('LastSoldNumberInHours', String(values.lastSoldNumberInHours));

        if (isCreateMode) {
    
        // setLoading(true)

          formData.append('ShopId', shopId);
          await axiosClient.post(`/api/FakeData/CreateFakeData/${shopId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          toast.success(lang === 'ar' ? 'تم الإنشاء بنجاح' : 'Created successfully');
          setIsCreateMode(false); 
        } else {
          if (!currentFakeDataId) {
            toast.error(lang === 'ar' ? 'لا يوجد بيانات لتحديثها' : 'No data to update');
            return;
          }
          // setLoading(true)

          await axiosClient.put(`/api/FakeData/UpdateFakeData/${shopId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          toast.success(lang === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully');
        }

        setCouponData(true);
        onSuccess?.();
        closeModal();
        if (isNextStepVisible) {
            setCurrentStep(4);
        }
      } catch (error) {
        setLoading(false)

        console.error(error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchFakeData = async () => {
    try {

      const response = await axiosClient.get(`/api/FakeData/GetFakeDataByShopId/${shopId}`);
      if (response.status === 204) {
        setIsCreateMode(true);
        return;
      }

      const data = response.data;
      if (data?.id) {
        setCurrentFakeDataId(data.id);
        setIsCreateMode(false);
        formik.setValues({
          isFakeViewersAvailable: data.isFakeViewersAvailable,
          minimumFakeViewers: data.minimumFakeViewers,
          maximumFakeViewers: data.maximumFakeViewers,
          isFakeSoldNumberAvailable: data.isFakeSoldNumberAvailable,
          minimumFakeSoldNumber: data.minimumFakeSoldNumber,
          maximumFakeSoldNumber: data.maximumFakeSoldNumber,
          lastSoldNumberInHours: data.lastSoldNumberInHours,
        });
      }
    } catch (error: any) {
      if (error?.response?.status === 204) {
        setIsCreateMode(true);
      } else {
        console.error('Fetch Error:', error);
      }
    }
  };

  useEffect(() => {
    fetchFakeData();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg">{t('updateFake')}</Title>
          <ActionIcon size="sm" variant="text" 
            onClick={()=>{
              closeModal();
              if (isNextStepVisible) {
                  setCurrentStep(4);
              }
            }} className="p-0 text-gray-500 hover:!text-gray-900"
          >
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div id='enable-sold-number' className="flex flex-col gap-3 mb-6">
            <Switch
              label={t('IsFakeSoldNumberAvailable')}
              labelPlacement={lang === 'ar' ? 'left' : 'right'}
              checked={formik.values.isFakeSoldNumberAvailable}
              onChange={(e) => formik.setFieldValue('isFakeSoldNumberAvailable', e.target.checked)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CustomInput
              className="input-placeholder text-[16px]" inputClassName='text-[16px]' 
                type="number"
                label={t('MinimumFakeSoldNumber')}
                name="minimumFakeSoldNumber"
                value={formik.values.minimumFakeSoldNumber}
                onChange={formik.handleChange}
                disabled={!formik.values.isFakeSoldNumberAvailable}
              />
              <CustomInput
              className="input-placeholder text-[16px]" inputClassName='text-[16px]' 

                type="number"
                label={t('MaximumFakeSoldNumber')}
                name="maximumFakeSoldNumber"
                value={formik.values.maximumFakeSoldNumber}
                onChange={formik.handleChange}
                disabled={!formik.values.isFakeSoldNumberAvailable}
              />
              <CustomInput
              className="input-placeholder text-[16px]" inputClassName='text-[16px]' 

                type="number"
                label={t('LastSoldNumberInHours')}
                name="lastSoldNumberInHours"
                value={formik.values.lastSoldNumberInHours}
                onChange={formik.handleChange}
                disabled={!formik.values.isFakeSoldNumberAvailable}
              />
            </div>
          </div>

       
          <div id='enable-fake-viewers' className="flex flex-col gap-3 mb-6">
            <Switch
              label={t('IsFakeViewersAvailable')}
              labelPlacement={lang === 'ar' ? 'left' : 'right'}
              checked={formik.values.isFakeViewersAvailable}
              onChange={(e) => formik.setFieldValue('isFakeViewersAvailable', e.target.checked)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <CustomInput
              className="input-placeholder text-[16px]" inputClassName='text-[16px]' 

                type="number"
                label={t('MinimumFakeViewers')}
                name="minimumFakeViewers"
                value={formik.values.minimumFakeViewers}
                onChange={formik.handleChange}
                disabled={!formik.values.isFakeViewersAvailable}
              />
              <CustomInput
              className="input-placeholder text-[16px]" inputClassName='text-[16px]' 

                type="number"
                label={t('MaximumFakeViewers')}
                name="maximumFakeViewers"
                value={formik.values.maximumFakeViewers}
                onChange={formik.handleChange}
                disabled={!formik.values.isFakeViewersAvailable}
              />
            </div>
          </div>

          {/* زر الحفظ */}
          <div className="flex justify-end">
            <Button id='update-data' type='submit'
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
