'use client';

import React, { useState } from 'react';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';

import Image from 'next/image';
import orderIncreased from '@public/assets/modals/orderIncreased.png';
import ActionButton from '../buttons/ActionButton';
import axiosClient from '../../context/api';

type IncreaseOrderFormProps = {
  itemId: string;
  orderId: string;
  lang: string;
  quantity?: number;
  onSuccess?: () => void;
};

export default function ModalIncreaseOrderItem({
  itemId,
  orderId,
  lang = 'en',
  quantity,
  onSuccess,
}: IncreaseOrderFormProps) {
  const { closeModal } = useModal();
  const text = {
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    increasing: lang === 'ar' ? 'ازدياد' : 'Increase',
    increasingProduct: lang === 'ar' ? 'هل انت متأكد من زيادة المنتج؟' : 'Are you sure you want to increase the product?',
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeclineRequest = async () => {
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
  };

  return (
    <div className="undefined overflow-hidden p-6 w-auto sm:min-w-max max-h-[90vh] sm:max-h-auto overflow-y-auto overflow-x-hidden bg-white border-[1px] border-solid border-[#CACACA] shadow[0_25px_50px_0_rgba(0, 0, 0, 0.2)] rounded-sm">
      <div className="flex flex-col gap-6 mx-auto sm:max-w-[400px]">
        <form>
          <div className="flex flex-row items-center justify-center w-full">
            <Image src={orderIncreased} alt="Active Icon" width={96} height={96} />
          </div>
          <p className='text-2xl text-center mb-4'>{text.increasingProduct}</p>
          <div className="flex flex-row gap-4">
            <ActionButton
              text={text.cancel}
              onClick={closeModal}
              buttonClassName="w-full bg-white border-[1px] border-[#707070] hover:bg-[#272c34] hover:border-[#272c34] h-10"
              textClassName="text-darkHead"
            />
            <ActionButton
              text={text.increasing}
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
