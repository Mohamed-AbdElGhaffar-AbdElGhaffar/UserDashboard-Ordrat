'use client';

import React, { useState } from 'react';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';

import Image from 'next/image';
import noCategories from '@public/assets/modals/noCategories.png';
import noCategoriesAr from '@public/assets/modals/noCategoriesAr.png';
import ActionButton from '../buttons/ActionButton';
import axiosClient from '../../context/api';
import Link from 'next/link';

type IncreaseOrderFormProps = {
  lang: string;
};

export default function ModalNoCategory({lang = 'en',
}: IncreaseOrderFormProps) {
  const { closeModal } = useModal();
  const text = {
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    submit: lang === 'ar' ? 'الذهاب للاقسام' : 'Go to Categories',
    massage: lang === 'ar' ? 'لا يوجد اقسام لإضافة منتج' : 'There are no categories to add a product.',
  };

  return (
    <div className="undefined overflow-hidden p-6 w-auto sm:min-w-max max-h-[90vh] sm:max-h-auto overflow-y-auto overflow-x-hidden bg-white border-[1px] border-solid border-[#CACACA] shadow[0_25px_50px_0_rgba(0, 0, 0, 0.2)] rounded-sm">
      <div className="flex flex-col gap-6 mx-auto sm:max-w-[400px]">
        <form>
          <div className="flex flex-row items-center justify-center w-full">
            <Image src={lang=='ar'? noCategoriesAr : noCategories} className='rounded-md' alt="Active Icon" width={96} height={96} />
          </div>
          <p className='text-2xl text-center mb-4'>{text.massage}</p>
          <div className="flex flex-row gap-4">
            <ActionButton
              text={text.cancel}
              onClick={closeModal}
              buttonClassName="w-full bg-white border-[1px] border-[#707070] hover:bg-[#272c34] hover:border-[#272c34] h-10"
              textClassName="text-darkHead"
            />
            <Link
              href={`/${lang}/storeProducts/categories`}
              className='w-full h-10'
            >
              <ActionButton
                text={text.submit}
                buttonClassName={`w-full h-10 bg-red-500 hover:bg-[#D13B26]`}
                textClassName="text-white"
                type='submit'
              />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
