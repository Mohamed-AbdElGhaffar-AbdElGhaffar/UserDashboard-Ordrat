'use client'
import { useTranslation } from '@/app/i18n/client';
import React from 'react'
import * as Yup from 'yup'

function ShopValidation({ lang }: { lang: string }) {
    const { t, i18n } = useTranslation(lang!, "validation");

    return Yup.object({
        // titleAr: Yup.string().required(t('req')),
        // titleEn: Yup.string().required(t('req')),
        nameAr: Yup.string()
            .matches(/^[\u0600-\u06FF\s]+$/, t('nameArInvalid'))
            .required(t('req')),
        nameEn: Yup.string()
            .matches(/^[A-Za-z\s]+$/, t('nameEnInvalid'))
            .required(t('req')),
        // metaDescriptionAr: Yup.string()
        //     .required(t('req')),
        // metaDescriptionEn: Yup.string()
        //     .required(t('req')),
        descriptionAr: Yup.string()
            .required(t('req')),
        descriptionEn: Yup.string()
            .required(t('req')),
        backgroundUrl: Yup.string()
            .required(t('req')),
        logoUrl: Yup.string()
            .required(t('req')),
        mainColor: Yup.string()
            .required(t('req')),
        secondaryColor: Yup.string()
            .required(t('req')),


    })
}

export default ShopValidation