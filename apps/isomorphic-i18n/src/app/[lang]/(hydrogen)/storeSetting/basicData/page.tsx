import Contact from '@/app/components/contact/Contact';
import AuthGuard from '@/app/components/ui/authGuard/AuthGuard';
import { RoleServerExist } from '@/app/components/ui/roleServerExist/RoleServerExist';
import UserBasicData from '@/app/components/userBasicData/UserBasicData'
import PersonalInfoView from '@/app/shared/account-settings/personal-info';
import ProfileSettingsView from '@/app/shared/account-settings/profile-settings';
import { metaObject } from '@/config/site.config';
import React from 'react'


export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'البيانات الأساسية | إدارة معلومات متجرك بدقة'
        : 'Basic Information | Manage Your Store Details Accurately',
      lang,
      undefined,
      lang === 'ar'
        ? 'قم بتحديث اسم المتجر، الشعار، والوصف لتحسين ظهور متجرك وتوفير تجربة مميزة للعملاء.'
        : 'Update your store name, logo, and description to enhance visibility and offer a better customer experience.'
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
  const shopGetById = RoleServerExist([
    'ShopGetById',
  ]);
  return (
    <div>
      {shopGetById && (
        <ProfileSettingsView lang={lang} />
      )}
      {/* <Contact lang={lang} /> */}

    </div>
  )
}

export default BasicData
