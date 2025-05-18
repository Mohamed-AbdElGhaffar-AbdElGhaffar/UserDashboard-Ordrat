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
import OrderStatus from '@public/assets/modals/OrderStatus.png';
import delivered from '@public/assets/modals/order-delivered.png';
import beingDelivered from '@public/assets/modals/order-being-delivered.png';
import pending from '@public/assets/modals/order-pending.png';
import beingPrepared from '@public/assets/modals/order-prepared-2.png';
import ActionButton from '../buttons/ActionButton';
import axiosClient from '../../context/api';
import { useUserContext } from '../../context/UserContext';

type ModalChangeOrderStatusFormProps = {
  orderId: string;
  lang: string;
  status: number;
};
interface OrderStatusOption {
  label: string;
  value: number;
  icon?: any;
}
const getOrderStatusOptions = (status: number, lang: string): OrderStatusOption[] => {
  switch (status) {
    case 0:
      return [
        { label: lang === 'ar' ? 'يتم تحضير الطلب' : 'Pending', value: 1, icon: pending },
        { label: lang === 'ar' ? 'الطلب اصبح جاهز' : 'Being Prepared', value: 2, icon: beingPrepared },
        { label: lang === 'ar' ? 'يتم توصيل الطلب' : 'Being Delivered', value: 3, icon: beingDelivered },
        { label: lang === 'ar' ? 'تم الاستلام' : 'Delivered', value: 4, icon: delivered },
      ];
    case 1:
      return [
        { label: lang === 'ar' ? 'الطلب اصبح جاهز' : 'Being Prepared', value: 2, icon: beingPrepared },
        { label: lang === 'ar' ? 'يتم توصيل الطلب' : 'Being Delivered', value: 3, icon: beingDelivered },
        { label: lang === 'ar' ? 'تم الاستلام' : 'Delivered', value: 4, icon: delivered },
      ];
    case 2:
      return [
        { label: lang === 'ar' ? 'يتم توصيل الطلب' : 'Being Delivered', value: 3, icon: beingDelivered },
        { label: lang === 'ar' ? 'تم الاستلام' : 'Delivered', value: 4, icon: delivered },
      ];
    case 3:
      return [
        { label: lang === 'ar' ? 'تم الاستلام' : 'Delivered', value: 4, icon: delivered },
      ];
    default:
      return [];
  }
};

export default function ModalChangeOrderStatus({ orderId, lang = 'en', status }: ModalChangeOrderStatusFormProps) {
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setOrderDetailsStatus } = useUserContext();  

  const orderStatusOptions = getOrderStatusOptions(status, lang);

  const text = {
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    submit: lang === 'ar' ? 'تعديل الحالة' : 'Change Status',
    title: lang === 'ar' ? 'تعديل حالة الطلب' : 'Change Order Status',
    statusLabel: lang === 'ar' ? 'الحالة الجديدة' : 'New Status',
  };

  const formik = useFormik<{
    orderStatus: OrderStatusOption | null;
  }>({
    initialValues: {
      orderStatus: null,
    },
    validationSchema: Yup.object({
      orderStatus: Yup.object().required(lang === 'ar' ? 'اختيار الحالة مطلوب' : 'Status is required'),
    }),
    onSubmit: async (values) => {
      console.log("values: ",values);
      
      try {
        setIsSubmitting(true);
        await axiosClient.patch(`/api/Order/ChangeOrderStatus/${orderId}`, null, {
          params: { orderStatus: values.orderStatus?.value },
          headers: { Accept: '*/*' },
        });
        setOrderDetailsStatus(true);
        toast.success(lang === 'ar' ? 'تم تعديل حالة الطلب بنجاح!' : 'Order status updated successfully!');
        closeModal();
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء تعديل الحالة' : 'An error occurred while updating status');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="overflow-hidden p-6 w-auto sm:min-w-max bg-white border border-[#CACACA] rounded-sm">
      <div className="flex flex-col gap-6 mx-auto sm:max-w-[400px]">
        <form onSubmit={formik.handleSubmit} className='h-[310px] flex flex-col justify-around '>
          <div className="flex flex-row items-center justify-center w-full">
            <Image src={OrderStatus} alt="Status Icon" width={96} height={96} />
          </div>
          <p className="text-2xl text-center mb-2">{text.title}</p>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">{text.statusLabel}</label>
            <div className="flex flex-wrap gap-4">
              {orderStatusOptions.map((option) => (
                <label key={option.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="orderStatus"
                    value={option.value}
                    checked={formik.values.orderStatus?.value === option.value}
                    onChange={() => formik.setFieldValue('orderStatus', option)}
                    className="hidden"
                  />
                  <div className={`w-full h-[80px] flex flex-col justify-center items-center rounded-md border-2 transition-all duration-200 ${
                    formik.values.orderStatus?.value === option.value ? 'border-[#e11d48] bg-[#FDECEF]' : 'border-gray-200 bg-white'
                  }`}>
                    <Image
                      src={option.icon}
                      alt={option.label}
                      width={48}
                      height={48}
                      className="w-8 mb-2"
                    />
                    <p className={`text-xs font-semibold ${
                      formik.values.orderStatus?.value === option.value ? 'text-[#E92E3E]' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {formik.touched.orderStatus && formik.errors.orderStatus && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.orderStatus}</p>
            )}
          </div>
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
