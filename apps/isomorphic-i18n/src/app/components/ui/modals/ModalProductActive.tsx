'use client';

import React, { useState } from 'react';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import Image from 'next/image';
import aceptImg from '@public/assets/modals/active.svg';
import deactiveImg from '@public/assets/modals/deactive.svg';
import { useUserContext } from '../../context/UserContext';
import ActionButton from '../buttons/ActionButton';
import axiosClient from '../../context/api';

type ProductProps = {
  lang: string;
  userId?: string;
  status: string;
};

export default function ModalProductActive({
  userId,
  status,
  lang = 'en',
}: ProductProps) {
  const { closeModal } = useModal();
  const text = {
    inactiveRequest: lang === 'ar' ? 'تفعيل المنتج' : 'Activate Product',
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    deactivate: lang === 'ar' ? 'إلغاء التفعيل' : 'Deactivate',
    activeRequst: lang === 'ar' ? 'إلغاء تفعيل المنتج' : 'Deactivate Product',
    activate : lang === 'ar' ? 'تفعيل' : 'Activate',
  };
  const { productData, setProductData } = useUserContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userStatus, setUserStatus] = useState<string>(status); 

  const handleDeclineRequest = async () => {
    try {
      setIsSubmitting(true); 

      const response = await axiosClient.patch(`/api/Products/ChangeActivationStatus/${userId}`, null, {
        headers: {
          'Accept-Language': lang,
        },
      });

      if (response.status === 200) {
        toast.success(lang === 'ar' ? 'لقد اصبح المنتج غير نشط' : 'You have become an inactive product.');
        setProductData(true);
        closeModal();
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء العملية' : 'Failed to decline request');
      }
    } catch (error) {
      console.error('Error declining request:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false); 
    }
  };

  const handleActivateRequest = async () => {
    try {
      setIsSubmitting(true); 

      const response = await axiosClient.patch(`/api/Products/ChangeActivationStatus/${userId}`, null, {
        headers: {
          'Accept-Language': lang,
        },
      });

      if (response.status === 200) {
        toast.success(lang === 'ar' ? 'تم تفعيل المنتج' : 'Product activated successfully');
        setProductData(true);
        closeModal();
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء العملية' : 'Failed to activate request');
      }
    } catch (error) {
      console.error('Error activating request:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="undefined overflow-hidden p-6 w-auto sm:min-w-max max-h-[90vh] sm:max-h-auto overflow-y-auto overflow-x-hidden bg-white border-[1px] border-solid border-[#CACACA] shadow[0_25px_50px_0_rgba(0, 0, 0, 0.2)] rounded-sm">
      <div className="flex flex-col gap-6 mx-auto sm:max-w-[400px]">
        <form>
          {userStatus === 'Active' ? (
            <>
              <div className="flex flex-row items-center justify-center w-full">
                <Image src={deactiveImg} alt="Active Icon" width={96} height={96} />
              </div>
              <p className="text-2xl text-center mb-2">{text.activeRequst}</p>
              <div className="flex flex-row gap-4">
                <ActionButton
                  text={text.cancel}
                  onClick={closeModal}
                  buttonClassName="w-full bg-white border-[1px] border-[#707070] hover:bg-[#272c34] hover:border-[#272c34] h-10"
                  textClassName="text-darkHead"
                />
                <ActionButton
                  text={text.deactivate}
                  onClick={handleDeclineRequest}
                  disabled={isSubmitting}
                  buttonClassName={`w-full h-10 ${isSubmitting ? 'bg-[#cacaca] cursor-default' : 'bg-red-500 hover:bg-[#D13B26]'}`}
                  textClassName="text-white"
                />
              </div>
            </>
          ) : userStatus === 'Inactive' ? (
            <>
              <div className="flex flex-row items-center justify-center w-full">
                <Image src={aceptImg} alt="Inactive Icon" width={96} height={96} />
              </div>
              <p className="text-2xl text-center mb-2">{text.inactiveRequest}</p>
              <div className="flex flex-row gap-4">
                <ActionButton
                  text={text.cancel}
                  onClick={closeModal}
                  buttonClassName="w-full bg-white border-[1px] border-[#707070] hover:bg-[#272c34] hover:border-[#272c34] h-10"
                  textClassName="text-darkHead"
                />
                <ActionButton
                  text={text.activate}
                  onClick={handleActivateRequest}
                  disabled={isSubmitting}
                  buttonClassName={`w-full h-10 ${isSubmitting ? 'bg-[#cacaca] cursor-default' : 'bg-[#27AE60] hover:bg-[#208E4E]'}`}
                  textClassName="text-white"
                />
              </div>
            </>
          ) : null}
        </form>
      </div>
    </div>
  );
}