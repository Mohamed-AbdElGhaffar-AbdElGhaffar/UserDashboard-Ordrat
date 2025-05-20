import Addsettings from '@/app/components/addsettings/Addsettings';
import FakeData from '@/app/components/fakeData/FakeData';
import { RoleServerExist } from '@/app/components/ui/roleServerExist/RoleServerExist';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import React from 'react'


export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'الإعدادات الإضافية | تخصيص شامل لمتجرك'
        : 'Additional Settings | Full Customization for Your Store',
      lang,
      undefined,
      lang === 'ar'
        ? 'تحكم في الإعدادات الإضافية مثل العملة، اللغة، والمنطقة الزمنية لمتجرك.'
        : 'Manage additional settings such as currency, language, and store timezone.'
    ),
  };
}

function page({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}){
  const pageHeader = {
    title: lang === 'ar' ? 'تحفيز الشراء' : 'Purchase Motivation',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        href: `/${lang}/marketingtools`,
        name: lang === 'ar' ? 'ادوات التسويق' : 'Marketing Tools',
      },
      {
        name: lang === 'ar' ? 'تحفيز الشراء' : 'Purchase Motivation',
      },
    ],
  };
  const viewFake = RoleServerExist([
    'GetFakeDataByShopId',
  ]);
  const shopGetById = RoleServerExist([
    'ShopGetById',
  ]);
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <div className="space-y-5">
      {shopGetById && (
        <Addsettings lang={lang} />
      )}
      {viewFake && (
        <FakeData lang={lang}/>
      )}
    </div>
  </>
}

export default page
