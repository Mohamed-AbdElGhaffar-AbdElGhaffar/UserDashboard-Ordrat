'use client'
import { useTranslation } from '@/app/i18n/client';
import React from 'react'
import * as Yup from 'yup'

function CouponValidation({ lang }: { lang: string }) {
    const { t,i18n } = useTranslation(lang!, "validation");
  
  return Yup.object({
    code: Yup.string().required(t('codeValidation')),
    expireDate: Yup.date().required(t('expireDate')),
      discountValue: Yup.string()
        .matches(/^\d+$/, t('num')) 
        .required(t('discountValue')),
    
      usageLimit: Yup.string()
        .matches(/^\d+$/, t('num'))
        .required(t('usageLimit')),

    
  })
}

export default CouponValidation