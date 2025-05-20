import Title from '@/app/components/titleSection';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import React from 'react'


export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'باركود المنتجات | إدارة وتوليد الأكواد بسهولة'
        : 'Product Barcodes | Manage and Generate Codes Easily',
      lang,
      undefined,
      lang === 'ar'
        ? 'أنشئ أكواد باركود لمنتجاتك لتسهيل عمليات الجرد والمبيعات.'
        : 'Generate barcodes for your products to streamline inventory and sales.'
    ),
  };
}

function QRCode({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const pageHeader = {
    title: lang === 'ar' ? 'باركود' : 'QR',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'باركود' : 'QR',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} /> 
    <div>
      <Title lang={lang} title={lang==='ar'? 'صب دومين':'Subdomain'} typeOfInput={'text'} />

    </div>
  </>
}

export default QRCode
