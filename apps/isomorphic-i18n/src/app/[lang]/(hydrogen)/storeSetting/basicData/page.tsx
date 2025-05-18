import Contact from '@/app/components/contact/Contact';
import AuthGuard from '@/app/components/ui/authGuard/AuthGuard';
import { RoleServerExist } from '@/app/components/ui/roleServerExist/RoleServerExist';
import UserBasicData from '@/app/components/userBasicData/UserBasicData'
import PersonalInfoView from '@/app/shared/account-settings/personal-info';
import ProfileSettingsView from '@/app/shared/account-settings/profile-settings';
import { metaObject } from '@/config/site.config';
import React from 'react'


export const metadata = {
  ...metaObject('Shop Settings'),
};
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
