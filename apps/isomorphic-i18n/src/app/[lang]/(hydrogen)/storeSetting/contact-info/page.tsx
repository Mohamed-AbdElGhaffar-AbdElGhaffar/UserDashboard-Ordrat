import Contact from '@/app/components/contact/Contact';
import { RoleServerExist } from '@/app/components/ui/roleServerExist/RoleServerExist';
import UserBasicData from '@/app/components/userBasicData/UserBasicData'
import PersonalInfoView from '@/app/shared/account-settings/personal-info';
import ProfileSettingsView from '@/app/shared/account-settings/profile-settings';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import React from 'react'


export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'بيانات التواصل | سهّل على عملائك الوصول إليك'
        : 'Contact Information | Make It Easy for Customers to Reach You',
      lang,
      undefined,
      lang === 'ar'
        ? 'أضف رقم الهاتف، البريد الإلكتروني، ومواقع التواصل لتوفير دعم أفضل.'
        : 'Add phone number, email, and social media links for better customer support.'
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
    title: lang === 'ar' ? 'بيانات التواصل' : 'Contact Info',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'بيانات التواصل' : 'Contact Info',
      },
    ],
  };
  const shopContactInfo = RoleServerExist([
    'ShopContactInfoGetByShopId',
  ]);
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    {shopContactInfo && (
      <>
        <div>
          {/* <ProfileSettingsView lang={lang} /> */}
          <Contact lang={lang} />
        </div>
      </>
    )}
  </>
}

export default BasicData
