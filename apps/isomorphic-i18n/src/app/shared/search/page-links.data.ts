`use client`
import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';
import { useTranslation } from '@/app/i18n/client';
import { useEffect } from 'react';

// Note: do not add href in the label object, it is rendering as label
const PageLinks = ({ lang }: { lang: string }) => {
  const { t, i18n } = useTranslation(lang!, "nav");
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);
  console.log(`====================================`);
  console.log(lang, `lang`);
  console.log(`====================================`);
  const links = [

    {
      name: t('side-statistics'),
    },
    {
      name: t('side-statistics'),
      href: `/statistics`,
    },
    {
      name: t('side-storeSetting'),
    },
    {
      name: t(`side-mainData`),
      href: `/storeSetting/basicData`,
      badge: ''
    },
    {
      name: t(`side-branches`),
      href: `/storeSetting/branches`,
      badge: ''
    },
    {
      name: t(`side-payment-gateways`),
      href: `/storeSetting/payment-gateways`,
      badge: ''
    },
    {
      name: t(`side-tables`),
      href: `/storeSetting/tables`,
      badge: ''
    },
    {
      name: t(`side-contactInfo`),
      href: `/storeSetting/contactInfo`,
      badge: ''
    },
    {
      name: t(`side-qr-code`),
      href: `/storeSetting/qr-code`,
      badge: ''
    },

    //
    {
      name: t('side-orders'),
    },
    {
      name: t('side-orders'),
      href: `/orders`,
    },
    {
      name: t('side-abandonedOrders'),
      href: `/${lang!}/abandonedOrders`,
    },

    //
    {
      name: t('side-store-products'),
    },
    {
      name: t(`side-category`),
      href: `/storeProducts/categories`,
      badge: ''
    },
    {
      name: t(`side-products`),
      href: `/storeProducts/products`,
      hrefChild: `/storeProducts/products/create`,
    },

    //
    {
      name: t('side-point-of-sale'),
    },
    {
      name: t('side-point-of-sale'),
      href: `/point-of-sale`,
    },
    {
      name: t('side-affiliate'),
    },
    {
      name: t('side-affiliate'),
      href: `/affiliate`,
    },

    ////
    {
      name: t('side-delivery-head'),
    },
    {
      name: t('side-delivery'),
      href: `/delivery`,
      hrefChild: `/delivery/create`,
    },
    // label start

    // label end
    // {
    //   name: 'side-marketingtools',
    //   href: `/marketingtools/banner`,
    //   icon: <PiShoppingCartDuotone />,
    //   dropdownItems: [
    //     {
    //       name: t(`side-banner`),
    //       href: `/marketingtools/banner`,
    //       badge:''
    //     },
    //     {
    //       name: t(`side-whatsapp`),
    //       href: `/marketingtools/whatsapp`,
    //     },

    //   ]
    // },
    {
      name: t('side-marketingtools'),

    },
    {
      name: t(`side-whatsapp`),
      href: `/marketingtools/whatsapp`,
    },
    {
      name: t(`side-banner`),
      href: `/marketingtools/banner`,
      badge: ''
    },
    {
      name: t(`side-seo`),
      href: `/marketingtools/seo`,
      badge: ''
    },
    {
      name: t(`side-platforms`),
      href: `/marketingtools/platforms`,
      badge: ''
    },
    {
      name: t(`side-Coupon`),
      href: `/marketingtools/Coupon`,
      badge: ''
    },
    {
      name: t(`side-additionalsettings`),
      href: `/marketingtools/additional-settings`,
      badge: ''
    },




    // {
    //   name: t('side-Plans'),
    // },

    {
      name: t('side-groups-permissions'),
    },
    {
      name: t('side-groups-permissions'),
      href: `/groups-permissions`,
    },
    {
      name: t(`side-myPlan`),
    },
    {
      name: t(`side-myPlan`),
      href: `/plans/myPlan`,
      badge: ''
    },







    // {
    //   name: 'side-delivery',
    //   href: `/delivery`,
    //   icon: <PiTruckDuotone />,
    // },
    {
      name: t('side-printer'),
    },
    {
      name: t('side-printer'),
      href: `/printer`,
    },
    {
      name: t('side-term'),
    },
    {
      name: t('side-faq'),
      href: `/term/faq`,
    },

    {
      name: t(`side-Privacy`),
      href: `/term/privacy`,
      badge: ''
    },
    {
      name: t(`side-Refund`),
      href: `/term/refund`,
      badge: ''
    },




  ]

  return links;
};

export default PageLinks;