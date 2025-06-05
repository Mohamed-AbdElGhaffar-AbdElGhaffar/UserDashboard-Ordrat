'use client'
import { useTranslation } from '@/app/i18n/client';
import React from 'react'
import * as Yup from 'yup'

function ShopValidationAdd({ lang }: { lang: string }) {
    const { t, i18n } = useTranslation(lang!, "validation");

    return Yup.object({
        titleAr: Yup.string(),
        titleEn: Yup.string(),
        metaDescriptionAr: Yup.string(),
        metaDescriptionEn: Yup.string(),
    })
}

export default ShopValidationAdd