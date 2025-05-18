import Contact from '@/app/components/contact/Contact';
import Seo from '@/app/components/seo/seo';
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
        ? 'تحسين محركات البحث | زِد من ظهور متجرك في نتائج البحث'
        : 'SEO Optimization | Improve Your Store’s Visibility in Search Engines',
      lang,
      undefined,
      lang === 'ar'
        ? 'أضف كلمات مفتاحية ووصف ميتا لتحسين ترتيب موقعك في محركات البحث.'
        : 'Add meta keywords and descriptions to enhance your store’s ranking in search engines.'
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
    title: lang === 'ar' ? 'تحسين محركات البحث' : 'Seo',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'تحسين محركات البحث' : 'Seo',
      },
    ],
  };
  const shopGetById = RoleServerExist([
    'ShopGetById',
  ]);
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    {shopGetById && (
      <>
        <div>
          <Seo lang={lang} />
        </div>
      </>
    )}
  </>
}

export default BasicData
