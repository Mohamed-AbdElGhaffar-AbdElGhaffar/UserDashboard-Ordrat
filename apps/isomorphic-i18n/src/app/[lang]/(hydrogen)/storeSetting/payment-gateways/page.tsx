import PaymentGateways from '@/app/components/payment-gateways/paymentGateway/PaymentGateways';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import React from 'react'


export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'بوابات الدفع | طرق الدفع داخل متجرك'
        : 'Payment Gateway | Payment Methods on Your Store',
      lang,
      undefined,
      lang === 'ar'
        ? 'قم بوضع بوابات الدفع للمتجر، الدفع عند الاستلام، فودافون كاش، اورانج كاش، انستا باى، باى بال، اتصالات كاش.'
        : 'Set up payment gateways for the store: Cash on Delivery, Vodafone Cash, Orange Cash, InstaPay, PayPal, Etisalat Cash.'
    ),
  };
}

function Payment({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const pageHeader = {
    title: lang === 'ar' ? 'بوابات الدفع' : 'Payment Gateway',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'بوابات الدفع' : 'Payment Gateway',
      },
    ],
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <PaymentGateways
        lang={lang}
      />
    </>
  )
}

export default Payment;
