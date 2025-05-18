'use client'
import { useTranslation } from '@/app/i18n/client';
import React from 'react'
import * as Yup from 'yup'

function ShopValidationAdd({ lang }: { lang: string }) {
    const { t, i18n } = useTranslation(lang!, "validation");

    return Yup.object({
        titleAr: Yup.string().required(t('req')),
        titleEn: Yup.string().required(t('req')),
        metaDescriptionAr: Yup.string()
            .required(t('req')),
        metaDescriptionEn: Yup.string()
            .required(t('req')),


    })
}

export default ShopValidationAdd