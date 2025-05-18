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
import branch from '@public/assets/modals/branches.svg';
import logo from '@public/smallLogo.png';
import ActionButton from '../buttons/ActionButton';
import axiosClient from '../../context/api';
import { useUserContext } from '../../context/UserContext';
import ChooseDelivery from '../../delivery/chooseDelivery/ChooseDelivery';
import Link from 'next/link';

interface DeliveryOption {
  id: string;
  name: string;
  value: string;
  icon?: any;
}
type ModalAssignDriverFormProps = {
  orderId: string;
  lang: string;
  status: number;
  branches: DeliveryOption[];
};
export default function ModalAssignDriver({ orderId, lang = 'en', status, branches }: ModalAssignDriverFormProps) {
  const { closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const { setOrderDetailsStatus } = useUserContext();  

  const text = {
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    submit: lang === 'ar' ? 'تأكيد' : 'Submit',
    title: lang === 'ar' ? 'توصيل من خلال' : 'Delivery through',
    chooseDelivery: lang === 'ar' ? 'اختيار سائق' : 'Choose Delivery',
  };

  const formik = useFormik<{
    deliveryMethod: null;
  }>({
    initialValues: {
      deliveryMethod: null,
    },
    validationSchema: Yup.object({
      deliveryMethod: Yup.string().required(lang === 'ar' ? 'طريقة التوصيل مطلوب' : 'Delivery method is required'),
    }),
    onSubmit: async (values) => {
      console.log("values: ",values.deliveryMethod);
      setDeliveryMethod(values.deliveryMethod || '')
    },
  });

  return (
    <div className={`overflow-hidden p-6 sm:min-w-max max-h-[90vh] ${deliveryMethod?'bg-[#F8F8F8]':'bg-white w-auto'} border border-[#CACACA] rounded-sm`}>
      <div className="mb-3 flex items-center justify-between">
        <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-[#e11d4899] border-2 border-[#e11d4899] rounded-full hover:text-[#E92E3E] hover:border-[#E92E3E]">
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon>
        {/* {deliveryMethod &&(
          <Title as="h3" className="text-lg IBM-Plex-sans">{text.chooseDelivery}</Title>
        )} */}
      </div>
      {deliveryMethod?
        // <ChooseDelivery lang={lang} branches={branches} orderId={orderId}/>
        <></>
        :
          <div className="flex flex-col gap-6 mx-auto sm:min-w-[300px]">
            <form onSubmit={formik.handleSubmit} className='comment-on-this-min-h-[250px] h-auto flex flex-col gap-3 justify-between items-center'>
              <p className="text-2xl text-center mb-2 font-bold">{text.title}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {[
                  { value: 'branch', title: lang === 'ar' ? 'الفرع' : 'Branch', imageURL: branch },
                  { value: 'ordrat', title: lang === 'ar' ? 'اوردرات' : 'Ordrat', imageURL: logo },
                ].map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={option.value}
                      checked={formik.values.deliveryMethod === option.value}
                      onChange={() => {
                        formik.setFieldValue('deliveryMethod', option.value);
                        // setDeliveryMethod(option.value || '')
                      }}
                      className="hidden"
                    />
                    <Link href={`/${lang}/orders/assignToDelivery/${orderId}`} className={`w-[160px] h-[130px] flex flex-col justify-center items-center rounded-[5px] border-2 transition-all duration-200 ${
                      formik.values.deliveryMethod === option.value ? 'bg-[#E8E8E8] border-[#e11d48]' : 'bg-[#E8E8E8] border-transparent'
                    }`}>
                      <img
                        src={option.imageURL}
                        alt="Delivery Method"
                        className="w-[60px]"
                        width="600"
                        height="360"
                      />
                      <p className={`text-md text-center mt-2 font-bold ${
                        formik.values.deliveryMethod === option.value ? 'text-[#E92E3E]' : 'text-[#E92E3E]'
                      }`}>{option.title}</p>
                    </Link>
                  </label>
                ))}
              </div>

              {formik.touched.deliveryMethod && formik.errors.deliveryMethod && (
                <p className="text-sm text-red-600 text-center">{formik.errors.deliveryMethod}</p>
              )}

              {/* <div className="w-full flex flex-row gap-4">
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
              </div> */}
            </form>
          </div>
      }
    </div>
  );
}
