import Title from '@/app/components/titleSection';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import React from 'react'


export const metadata = {
  ...metaObject('qr-code'),
};
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
      <Title lang={lang} title={lang==='ar'? 'ساب دومين':'Subdomain'} typeOfInput={'text'} />

    </div>
  </>
}

export default QRCode
