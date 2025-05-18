'use client';
import { PiXBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import {
  ActionIcon,
  Empty,
  Text,
  Title,
} from 'rizzui';
import { Key } from 'react';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import { generatePagesFromRoles } from './rolesToPages';
import styles from './RoleModal.module.css';

export default function ViewRoles({lang='en', roles}:{lang?:string; roles: any[];}) {
  const { closeModal } = useModal();
  // const roles = GetCookiesClient('roles') as string;
  console.log("roles cookies: ",roles);
  
  // const pages = [
  //   {
  //     name: lang=='ar'?'الفروع':'Branches',
  //     roles: [
  //       {
  //         name: lang=='ar'?'رؤية الفروع':'View Branches',
  //       },
  //       {
  //         name: lang=='ar'?'اضافة فرع':'Create Branch',
  //       },
  //       {
  //         name: lang=='ar'?'حذف فرع':'Delete Branch',
  //       },
  //       {
  //         name: lang=='ar'?'تعديل فرع':'Update Branch',
  //       },
  //       {
  //         name: lang=='ar'?'تغيير الحالة':'Change Status',
  //       },
  //     ]
  //   },
  // ]
  const pages = generatePagesFromRoles(roles, lang); // or 'en'
  const text = {
    title: lang === 'ar' ? 'رؤية الصلاحيات' : 'View Permissions',
    sectionTitle: lang === 'ar' ? 'صلاحيات المجموعة' : 'Group Access',
  };  

  return (
    <div className='py-1'>
      <div className={`grid grid-cols-1 gap-4 p-3 pb-1  @container [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900 `}>
        <div className="col-span-full flex items-center justify-between">
          <Title as="h4" className="font-semibold">
            {text.title}
          </Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal}>
            <PiXBold className="h-auto w-5" />
          </ActionIcon>
        </div>
        {pages.length == 0?
          <div className="py-5 text-center lg:py-8">
            <Empty /> <Text className="mt-3">{lang === 'ar' ? 'لا توجد صلاحيات' : 'No Roles'}</Text>
          </div>
          :
          <div className={`grid gap-4 m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
            {pages.map((page, index) => {
              const isLast = index === pages.length - 1;
              return (
                <div
                  key={index}
                  className={`flex flex-col gap-3 ${!isLast ? 'border-b border-gray-200 pb-4':''}`}
                >
                  <Title
                    as="h6"
                    className="mb-2 text-base font-semibold"
                  >
                    {page.name}
                  </Title>
                  <div className="flex flex-wrap gap-3">
                    {page?.roles?.map((role: any, roleIndex: any) => (
                      <span
                        key={roleIndex}
                        className="border border-gray-200 text-gray-700 bg-white hover:border-primary hover:text-primary transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        }

        {/* <div className="col-span-full flex items-center justify-end gap-4">
          <Button
            variant="outline"
            onClick={closeModal}
            className="w-full @xl:w-auto"
          >
            {text.cancel}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full @xl:w-auto"
          >
            {text.save}
          </Button>
        </div> */}
      </div>
    </div>
  );
}
