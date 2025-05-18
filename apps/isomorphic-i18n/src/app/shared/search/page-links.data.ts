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
      name: t('side-storeSetting'),
    },
    {
      name: t(`side-mainData`),
      href: `/storeSetting/basicData`,
      badge: ''
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
      name: t(`side-banner`),
      href: `/marketingtools/banner`,
      badge: ''
    },
    {
      name: t(`side-whatsapp`),
      href: `/marketingtools/whatsapp`,
    },


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


    {
      name: t('side-Plans'),
    },
    {
      name: t(`side-allPlans`),
      href: `/plans/allPlans`,
      badge: ''
    },
    {
      name: t(`side-myPlan`),
      href: `/plans/myPlan`,
      badge: ''
    },



    {
      name: t('side-delivery'),
    },
    {
      name: t('side-delivery'),
      href: `/delivery`,
      hrefChild: `/delivery/create`,
    },


    {
      name: t('side-branches'),
      href: `/branches`,
    },
    {
      name: t('side-orders'),
      href: `/orders`,
    },
    // {
    //   name: 'side-delivery',
    //   href: `/delivery`,
    //   icon: <PiTruckDuotone />,
    // },
    {
      name: t('side-faq'),
      href: `/faq`,
    },
    {
      name: t('side-groups-permissions'),
      href: `/groups-permissions`,
    },
    {
      name: t('side-point-of-sale'),
      href: `/point-of-sale`,
    },
    {
      name: t('side-statistics'),
      href: `/statistics`,
    },
    {
      name: t('side-Coupon'),
      href: `/coupon`,
    },


    {
      name: t('side-term'),
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