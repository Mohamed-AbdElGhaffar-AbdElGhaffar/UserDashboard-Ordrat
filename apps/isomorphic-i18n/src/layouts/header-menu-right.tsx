import { Badge, ActionIcon, Select } from "rizzui";
import MessagesDropdown from "@/layouts/messages-dropdown";
import ProfileMenu from "@/layouts/profile-menu";
import SettingsButton from "@/layouts/settings-button";
import RingBellSolidIcon from "@components/icons/ring-bell-solid";
import ChatSolidIcon from "@components/icons/chat-solid";
import LanguageSwitcher from "@/app/i18n/language-switcher";
import { useTranslation } from "@/app/i18n/client";
import Cookies from "js-cookie";
import { GetCookiesClient } from "@/app/components/ui/getCookiesClient/GetCookiesClient";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/components/context/UserContext";

type BranchOption = {
  label: string;
  value: string;
};

function safeParseJSON(value: string | undefined | null): any[] {
  try {
    if (!value || value === "undefined" || value === "null") return [];
    return JSON.parse(value);
  } catch (e) {
    console.error("Failed to parse branches cookie:", e);
    return [];
  }
}

export default function HeaderMenuRight({ lang }: { lang?: string }) {
  const { t } = useTranslation(lang!, 'common');
  const text = {
    branchId: lang === 'ar' ? 'الفرع' : 'Branch',
    branchLable: lang === 'ar' ? "الفروع" : "Branches",
    placeholderBranch: lang === 'ar' ? "اختر فرع" : "Select Branch",
  };
  const cookiebranches = GetCookiesClient('branches') as string;
  const cookiesBranches = safeParseJSON(cookiebranches);
  const branchOption = cookiesBranches.map((branch: any) => ({
    label: lang == 'ar'? branch.nameAr : branch.nameEn,
    value: branch.id
  }));

  const {mainBranch, setMainBranch, setTablesData, setUpdateMainBranch} = useUserContext();
  useEffect(() => {
    const storedBranch = localStorage.getItem('mainBranch');
    if (storedBranch) {
      setMainBranch(storedBranch);
    } else if (branchOption.length > 0) {
      setMainBranch(branchOption[0].value);
      localStorage.setItem('mainBranch', branchOption[0].value);
      Cookies.set('mainBranch', branchOption[0].value, {
        expires: 1, // 1 day
        secure: true,
        sameSite: 'Lax',
        path: '/',
      });
    }
  }, [branchOption]);

  const handleBranchChange = (value: string) => {
    console.log("value: ",value);
    
    setMainBranch(value);
    localStorage.setItem('mainBranch', value);
    Cookies.set('mainBranch', value, {
      expires: 1, // 1 day
      secure: true,
      sameSite: 'Lax',
      path: '/',
    });
    setTablesData(true);
    setUpdateMainBranch(true);
  };
    
  return (
    <div className="ms-auto flex shrink-0 items-center gap-2 xs:gap-3 xl:gap-4">
      {branchOption.length > 0 && (
        <Select
          options={branchOption}
          value={branchOption?.find((option: any) => option.value === mainBranch)}
          onChange={(value: any) => handleBranchChange(value)}
          placeholder={text.placeholderBranch}
          className="w-[105px] xs:w-48 md:full text-sm py-1 px-2"
          dropdownClassName="!w-[128px] xs:!w-[192px] text-sm py-1"
          style={{ minWidth: 128 }}
          getOptionValue={(option) => option.value}
          inPortal={false}
        />
      )}
      <LanguageSwitcher lang={lang!} />
      <div className="grid grid-cols-1 items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
        {/* <ActionIcon
          aria-label="Notification"
          variant="text"
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9"
        >
          <RingBellSolidIcon className="h-[18px] w-auto" />
          <Badge
            renderAsDot
            color="warning"
            enableOutlineRing
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
          />
        </ActionIcon> */}
        {/* <MessagesDropdown>
          <ActionIcon
            aria-label="Messages"
            variant="text"
            className="relative h-[34px] w-[34px] shadow backdrop-blur-md dark:bg-gray-100 md:h-9 md:w-9"
          >
            <ChatSolidIcon className="h-[18px] w-auto" />
            <Badge
              renderAsDot
              color="success"
              enableOutlineRing
              className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2"
            />
          </ActionIcon>
          </MessagesDropdown> */}
          <div className="hidden">
            <SettingsButton t={t} />
          </div>
          <ProfileMenu lang={lang} />
      </div>
    </div>
  );
}
