'use client';

import { PiXBold, PiArrowClockwiseBold, PiMinusBold, PiPlusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Input, Textarea } from 'rizzui';
import ReactSelect from 'react-select';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';

import { useTranslation } from '@/app/i18n/client';

import Image from 'next/image';
import aceptImg from '@public/assets/modals/active.svg';
import deleteIconModal from '@public/assets/modals/deleteIconModal.svg';
import { useUserContext } from '../../context/UserContext';
import ActionButton from '../buttons/ActionButton';
import { API_BASE_URL } from '@/config/base-url';
import axiosClient from '../../context/api';

type CancelOrderFormProps = {
  itemId: string;
  orderId: string;
  lang: string;
  quantity?: number;
  onSuccess?: () => void;
};

export default function ModalCancelOrderItem({
  itemId,
  orderId,
  lang = 'en',
  quantity,
  onSuccess,
}: CancelOrderFormProps) {
  const { closeModal } = useModal();
  const text = {
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    deactivate: lang === 'ar' ? 'إزالة' : 'Delete',
    decreasing: lang === 'ar' ? 'تقليل' : 'Decrease',
    activeRequst: lang === 'ar' ? 'إزالة المنتج من الطلب' : 'Delete Product from Order',
    decreasingProduct: lang === 'ar' ? 'هل انت متأكد من تقليل المنتج؟' : 'Are you sure you want to reduce the product?',
  };
  const { orderDetailsTable, setOrderDetailsStatus, setOrderDetailsTable } = useUserContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState('');

  const handleDeclineRequest = async () => {
    if(quantity && quantity != 0){
      console.log("quantity : ",quantity);
      
      try {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('sourceChannel', '1');
        await axiosClient.put(
          `/api/Order/UpdateOrderItemQuantity/UpdateOrderItemQuantity${orderId}/${itemId}`,
          formData,
          {
            params: { quantity },
          }
        );
        if(onSuccess){
          onSuccess();
        }
        toast.success(lang === 'ar' ? 'تم تحديث الكمية بنجاح!' : 'Quantity updated successfully!');
        closeModal();
      } catch (error) {
        console.error('Error updating quantity:', error);
        toast.error(lang === 'ar' ? 'خطأ أثناء تحديث الكمية' : 'Error updating quantity');
      } finally {
        setIsSubmitting(false);
      }
    }else {
      try {
        setIsSubmitting(true);
        await axiosClient.patch(
          `/api/Order/CancleOrderItem/${itemId}/${orderId}`,
          null,
          {
            params: { cancelReason: reason || 'no reason' },
            headers: { Accept: '*/*' },
          }
        );
        if(onSuccess){
          onSuccess();
        }else{
          setOrderDetailsTable(true);
          setOrderDetailsStatus(true);
        }
        toast.success(lang === 'ar' ? 'تم إزالة المنتج من الطلب بنجاح!' : 'Product deleted from order successfully!');
        closeModal();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإزالة' : 'An error occurred while deleting Product');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="undefined overflow-hidden p-6 w-auto sm:min-w-max max-h-[90vh] sm:max-h-auto overflow-y-auto overflow-x-hidden bg-white border-[1px] border-solid border-[#CACACA] shadow[0_25px_50px_0_rgba(0, 0, 0, 0.2)] rounded-sm">
      <div className="flex flex-col gap-6 mx-auto sm:max-w-[400px]">
        <form>
          <div className="flex flex-row items-center justify-center w-full">
            <Image src={deleteIconModal} alt="Active Icon" width={96} height={96} />
          </div>
          <p className={`text-2xl text-center ${(quantity && quantity != 0)? 'mb-4' : 'mb-2' }`}>{(quantity && quantity != 0)? text.decreasingProduct : text.activeRequst}</p>
          {(quantity && quantity != 0)?
            <></>
            :
            <Input
              label={lang === 'ar' ? 'سبب الحذف' : 'Cancel Reason'}
              placeholder={lang === 'ar' ? 'اكتب سبب الحذف هنا' : 'Enter reason for cancellation'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mb-4"
            />
          }
          <div className="flex flex-row gap-4">
            <ActionButton
              text={text.cancel}
              onClick={closeModal}
              buttonClassName="w-full bg-white border-[1px] border-[#707070] hover:bg-[#272c34] hover:border-[#272c34] h-10"
              textClassName="text-darkHead"
            />
            <ActionButton
              text={(quantity && quantity != 0)? text.decreasing : text.deactivate}
              onClick={handleDeclineRequest}
              disabled={isSubmitting}
              buttonClassName={`w-full h-10 ${isSubmitting ? 'bg-[#cacaca] cursor-default' : 'bg-red-500 hover:bg-[#D13B26]'}`}
              textClassName="text-white"
              type='submit'
            />
          </div>
        </form>
      </div>
    </div>
  );
}
