import Contact from '@/app/components/contact/Contact';
import Seo from '@/app/components/seo/seo';
import UserBasicData from '@/app/components/userBasicData/UserBasicData'
import PersonalInfoView from '@/app/shared/account-settings/personal-info';
import ProfileSettingsView from '@/app/shared/account-settings/profile-settings';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import React from 'react'
import Platforms from '../../../../components/platforms/Platforms';
import { RoleServerExist } from '@/app/components/ui/roleServerExist/RoleServerExist';


export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'الربط مع المنصات | وسّع نطاق متجرك بسهولة'
        : 'Platform Integration | Expand Your Store’s Reach Easily',
      lang,
      undefined,
      lang === 'ar'
        ? 'قم بربط متجرك مع منصات التسويق، التحليلات، والدفع الإلكتروني لزيادة المبيعات.'
        : 'Integrate your store with marketing, analytics, and payment platforms to boost sales.'
    ),
  };
}

function BasicData({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const pageHeader = {
    title: lang === 'ar' ? 'الربط مع المنصات' : 'Linking to platforms',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'الربط مع المنصات' : 'Linking to platforms',
      },
    ],
  };
  const pixelGetAll = RoleServerExist([
    'PixelGetAll',
  ]);
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    {pixelGetAll && (
      <div>
        <Platforms lang={lang} />
      </div>
    )}
  </>
}

export default BasicData
