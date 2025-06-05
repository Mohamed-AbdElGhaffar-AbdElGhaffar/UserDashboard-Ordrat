import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';
import {
  PiShoppingCartDuotone,
  PiCurrencyDollarDuotone,
  PiSquaresFourDuotone,
  PiCreditCardDuotone,
  PiFolderLockDuotone,
  PiFoldersDuotone,
  PiStorefront,
  PiQuestionBold,
  PiTruckDuotone,
  PiUsers,
  PiPrinter,
} from 'react-icons/pi';
import { BiSolidCoupon } from "react-icons/bi";
import { MdPriceChange, MdRestaurant } from "react-icons/md";
import { ImStatsDots } from "react-icons/im";
import { MdPolicy } from "react-icons/md";

import { useTranslation } from '@/app/i18n/client';
import { useEffect } from 'react';

// Note: do not add href in the label object, it is rendering as label
const MenuItems = ({ lang }: { lang?: string; }, p0?: { lang: any; }) => {
  const { t, i18n } = useTranslation(lang!, "nav");
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);
  const menuItems = [
    {
      name: 'side-statistics',
      href: `/${lang!}/statistics`,
      icon: <ImStatsDots />,
    },
    {
      name: 'side-storeSetting',
      href: '/',
      icon: <PiFoldersDuotone />,
      dropdownItems: [
        {
          name: t(`side-mainData`),
          href: `/${lang!}/storeSetting/basicData`,
          badge: ''
        },
        {
          name: 'side-branches',
          href: `/${lang!}/storeSetting/branches`,
          icon: <PiStorefront />,
        },
        {
          name: 'side-tables',
          href: `/${lang!}/storeSetting/tables`,
          icon: <MdRestaurant />,
        },
        {
          name: t(`side-contactInfo`),
          href: `/${lang!}/storeSetting/contact-info`,
          badge: ''
        },
        {
          name: t(`side-qr-code`),
          href: `/${lang!}/storeSetting/qr-code`,
          badge: ''
        },


      ]
    },
    {
      name: 'side-orders',
      href: `/${lang!}/orders`,
      icon: <PiTruckDuotone />,
      dropdownItems: [
        {
          name: 'side-orders',
          href: `/${lang!}/orders`,
          icon: <PiCurrencyDollarDuotone />,
        },
        {
          name: 'side-abandonedOrders',
          href: `/${lang!}/abandonedOrders`,
          icon: <PiCurrencyDollarDuotone />,
        }]
    },
    {
      name: 'side-store-products',
      href: `/${lang!}/storeProducts/categories`,
      icon: <PiSquaresFourDuotone />,
      dropdownItems: [
        {
          name: t(`side-category`),
          href: `/${lang!}/storeProducts/categories`,
          badge: ''
        },
        {
          name: t(`side-products`),
          href: `/${lang!}/storeProducts/products`,
          hrefChild: [`/${lang!}/storeProducts/products/create`],
        },

      ]
    },
    {
      name: 'side-point-of-sale',
      href: `/${lang!}/point-of-sale`,
      icon: <PiCreditCardDuotone />,
    },
    {
      name: 'side-affiliate',
      href: `/${lang!}/affiliate`,
      icon: <PiUsers />,
    },
    {
      name: 'side-delivery-head',
      href: `/${lang!}/delivery`,
      icon: <PiTruckDuotone />,
      dropdownItems: [
        {
          name: t('side-delivery'),
          href: `/${lang!}/delivery`,
          hrefChild: [`/${lang!}/delivery/create`],
        },
        // {
        //   name: t('side-delivery-chat'),
        //   href: `/${lang!}/delivery/chat`,
        //   // hrefChild: [`/${lang!}/delivery/create`],
        // },

      ]
    },
    {
      name: 'side-marketingtools',
      href: `/${lang!}/marketingtools/whatsapp`,
      icon: <PiShoppingCartDuotone />,
      dropdownItems: [
        {
          name: t(`side-whatsapp`),
          href: `/${lang!}/marketingtools/whatsapp`,
          badge: 'new'

        },
        {
          name: t(`side-banner`),
          href: `/${lang!}/marketingtools/banner`,
          badge: ''
        },
        {
          name: t(`side-seo`),
          href: `/${lang!}/marketingtools/seo`,
          badge: ''
        },
        {
          name: t(`side-platforms`),
          href: `/${lang!}/marketingtools/platforms`,
          badge: ''
        },
        {
          name: 'side-Coupon',
          href: `/${lang!}/marketingtools/coupon`,
          icon: <BiSolidCoupon />,
        },
        {
          name: t(`side-additionalsettings`),
          href: `/${lang!}/marketingtools/additional-settings`,
          badge: ''
        },

      ]
    },
    {
      name: 'side-groups-permissions',
      href: `/${lang!}/groups-permissions`,
      icon: <PiFolderLockDuotone />,
    },
    {
      name: t(`side-myPlan`),
      href: `/${lang!}/plans/myPlan`,
      icon: <MdPriceChange />,
    },
    {
      name: 'side-printer',
      href: `/${lang!}/printer`,
      icon: <PiPrinter />,
    },
    // {
    //   name: 'side-marketingtools',
    //   href: `/${lang!}/marketingtools/banner`,
    //   icon: <PiShoppingCartDuotone />,
    //   dropdownItems: [
    //     {
    //       name: t(`side-banner`),
    //       href: `/${lang!}/marketingtools/banner`,
    //       badge:''
    //     },
    //     {
    //       name: t(`side-whatsapp`),
    //       href: `/${lang!}/marketingtools/whatsapp`,
    //     },

    //   ]
    // },





    // {
    //   name: 'side-delivery',
    //   href: `/${lang!}/delivery`,
    //   icon: <PiTruckDuotone />,
    // },

    {
      name: 'side-term',
      href: `/${lang!}/marketingtools/policy`,
      icon: <MdPolicy />,
      dropdownItems: [
        {
          name: 'side-faq',
          href: `/${lang!}/term/faq`,
          icon: <PiQuestionBold />,
        },
        {
          name: t(`side-Privacy`),
          href: `/${lang!}/term/privacy`,
          badge: ''
        },
        {
          name: t(`side-Refund`),
          href: `/${lang!}/term/refund`,
          badge: ''
        },
      ]
    },

  ]
  return menuItems;

}
export default MenuItems;