'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import NotFoundImg from '@public/notFound.svg';
import SettingsButton from '@/layouts/settings-button';

export default function NotFound() {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  return (
    <div className="my-10 text-center">
      <div className="hidden">
        <SettingsButton />
      </div>
      <img src={NotFoundImg.src} alt="Not Found" className="mx-auto" width="750" height="500"/>
      <p className="font-medium text-xl">
        {lang === "ar"
          ? "الصفحه غير موجوده برجاء العوده الي الصفحة الرئيسية"
          : "The page does not exist. Please return to the home page."}
      </p>
      <Link
        href={`/${lang}/storeSetting/basicData`}
        className="flex justify-center items-center bg-redColor w-fit py-2 px-8 hover:bg-transparent hover:text-redColor duration-200 hover:border-2 hover:border-redColor gap-3 rounded-full cursor-pointer mx-auto text-white mt-3"
      >
        {lang === "ar" ? "الرئيسية" : "Home"}
      </Link>
    </div>
  );
}
