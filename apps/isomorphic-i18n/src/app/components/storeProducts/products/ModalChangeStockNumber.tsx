'use client';

import { PiXBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { ActionIcon, Title, Input } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import warehouse from '@public/assets/modals/warehouse.png';
import delivered from '@public/assets/modals/order-delivered.png';
import beingDelivered from '@public/assets/modals/order-being-delivered.png';
import pending from '@public/assets/modals/order-pending.png';
import beingPrepared from '@public/assets/modals/order-prepared-2.png';
import axiosClient from '../../context/api';
import { useUserContext } from '../../context/UserContext';
import ActionButton from '../../ui/buttons/ActionButton';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import { API_BASE_URL } from '@/config/base-url';

type ModalChangeStockNumberFormProps = {
  lang: string;
  stocks: any[];
  productImage: string;
  productName: string;
};
export default function ModalChangeStockNumber({ lang = 'en', stocks, productImage, productName }: ModalChangeStockNumberFormProps) {
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mainBranch, setProductData } = useUserContext();  
  const cookiebranches = GetCookiesClient('branches') as string;
  const cookiesBranches = JSON.parse(cookiebranches);
  const branch = cookiesBranches.find((branch: any) => branch.id === mainBranch);
  const stock = stocks.find((stock: any) => stock.branchId === mainBranch);
  
  const text = {
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    submit: lang === 'ar' ? 'تعديل الحالة' : 'Change Status',
    title: lang === 'ar' ? `${branch.nameAr}` : `${branch.nameEn}`,
    stockNumber: lang == "ar"? 'تغيير عدد المخزون' : 'Change Stock Number',
  };

  const mainFormik = useFormik({
    initialValues: {
      stockNumber: `${stock? stock.stockNumber : ''}`,
    },
    validationSchema: Yup.object({ 
      stockNumber: Yup.string().required(lang === 'ar' ? 'عدد المخزون مطلوب' : 'Stock Number is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('StockNumber', values.stockNumber || '0');
      if (stock) {
        try {
          setIsSubmitting(true) 
          const response = await axiosClient.put(`api/Stock/UpdateProductStock/${stock.branchId}/${stock.productId}`, formData);
  
          if (response) {
            toast.success(lang === 'ar' ? 'تم تغيير عدد المخزون بنجاح!' : 'Change Stock Number successfully!');
            setProductData(true);
            closeModal();
          }  else {
                    toast.error(
                      lang === 'ar'
                        ? `فشل في التغيير  `
                        : `Failed to change `
                    );
                  }
        } catch (error) {
          console.error('Error Change Stock Number:', error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء تغيير عدد المخزون' : 'An error occurred while change stock number');
        }finally{
          setIsSubmitting(false) 
        }
      }else{
        closeModal();
      }
    },
  });

  return (
    <div className="overflow-hidden p-6 sm:min-w-max max-h-[90vh] bg-white border border-[#CACACA] rounded-sm">
      <div className="mb-3 flex items-center justify-between">
        <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-[#e11d4899] border-2 border-[#e11d4899] rounded-full hover:text-[#E92E3E] hover:border-[#E92E3E]">
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon>
        {/* {deliveryMethod &&(
          <Title as="h3" className="text-lg IBM-Plex-sans">{text.chooseDelivery}</Title>
        )} */}
      </div>
      <div className="flex flex-col gap-6 mx-auto sm:max-w-[400px]">
        <form onSubmit={mainFormik.handleSubmit} className='h-[310px] flex flex-col justify-around '>
          <div className="flex flex-row items-center justify-center w-full">
            <Image src={ productImage || warehouse} className={`${productImage? 'w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-md object-cover':''}`} alt="Status Icon" width={96} height={96} />
          </div>
          <p className="text-2xl text-center mb-2">{productName}</p>
          <p className="text-2xl text-center mb-2">{text.title}</p>

          <Input
            type='number'
            label={text.stockNumber}
            placeholder={text.stockNumber}
            name="stockNumber"
            value={mainFormik.values.stockNumber}
            onChange={mainFormik.handleChange}
            onBlur={mainFormik.handleBlur}
            error={
              mainFormik.touched.stockNumber && mainFormik.errors.stockNumber
                ? mainFormik.errors.stockNumber
                : ''
            }
          />

          <div className="flex flex-row gap-4">
            <ActionButton
              text={text.cancel}
              onClick={closeModal}
              buttonClassName="w-full bg-white border border-[#707070] hover:bg-[#272c34] hover:border-[#272c34] h-10"
              textClassName="text-darkHead"
              type="button"
            />
            <ActionButton
              text={text.submit}
              type="submit"
              disabled={isSubmitting}
              buttonClassName={`w-full h-10 ${isSubmitting ? 'bg-[#cacaca] cursor-default' : 'bg-primary hover:bg-primary-dark'}`}
              textClassName="text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
