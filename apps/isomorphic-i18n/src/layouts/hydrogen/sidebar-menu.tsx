import Link from "next/link";
import { Collapse, Title } from "rizzui";
import { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import cn from "@utils/class-names";
import MenuItems from "@/layouts/hydrogen/menu-items";
import { useTranslation } from "@/app/i18n/client";
import StatusBadge from "@components/get-status-badge";
import { PiCaretDownBold } from "react-icons/pi";
import { UrlObject } from "url";
import Cookies from 'js-cookie'; 
import { routeRoles } from "@/middleware";
import axiosClient from "@/app/components/context/api";
import { useUserContext } from "@/app/components/context/UserContext";

function filterMenuItemsByRoles(menuItems: any[], userRoles: string[]): any[] {
  function hasAccess(path: string | undefined): boolean {
    if (!path) return false;
  
    const relativePath = path.replace(/^\/(en|ar)/, '');
    const rolesForRoute = routeRoles[relativePath];
    return rolesForRoute?.some((role) => userRoles.includes(role)) ?? false;
  }  

  return menuItems
    .map((item) => {
      if (!item.href) return item;

      if (item.dropdownItems) {
        const filteredDropdownItems = item.dropdownItems.filter((dropdownItem: any) => {
          const hrefHasAccess = dropdownItem.href && hasAccess(dropdownItem.href);
          const childHasAccess = Array.isArray(dropdownItem.hrefChild)
            ? dropdownItem.hrefChild.some((child: string) => hasAccess(child))
            : hasAccess(dropdownItem.hrefChild);
        
          return hrefHasAccess || childHasAccess;
        });        

        if (filteredDropdownItems.length === 0) return null;

        return {
          ...item,
          dropdownItems: filteredDropdownItems,
        };
      }

      return hasAccess(item.href) ? item : null;
    })
    .filter(Boolean);
}

export function SidebarMenu({ lang }: { lang?: string }) {
  const pathname = usePathname();
  const { t } = useTranslation(lang!, "nav");
  const menuItems = MenuItems({ lang });  
  console.log("menuItems: ",menuItems);
  const [roles, setRoles] = useState<string[]>([]);
  const [hideStoreProgress, setHideStoreProgress] = useState(false);  
  const { progressData, productData, tablesData, couponData, setProgressData } = useUserContext();

  const shopId = Cookies.get('shopId');
  async function fetchProgress() {
    try {
      const response = await axiosClient.get('/api/ShopHighPriority/items', {
        params: { shopId },
        headers: { 'Accept-Language': lang },
      });

      const { summary } = response.data;
      if (summary?.completed === summary?.total) {
        setHideStoreProgress(true);
      }else {
        setHideStoreProgress(false);
      }
    } catch (error) {
      console.error("Error fetching shop progress:", error);
    }
  }
  useEffect(() => {
    const rolesCookie = Cookies.get("roles");
    if (rolesCookie) {
      try {
        setRoles(JSON.parse(rolesCookie));
      } catch (err) {
        console.error("Invalid roles cookie format:", err);
      }
    }
  
    fetchProgress();
  }, [lang]);
  
  useEffect(() => {
    if (progressData == true || productData == true || tablesData == true || couponData == true) {
      fetchProgress();
      setProgressData(false);
    }
  }, [progressData, productData, tablesData, couponData]); 

  console.log("roles: ",roles);

  const filteredMenuItems = filterMenuItemsByRoles(menuItems, roles);
  console.log("filteredMenuItems: ",filteredMenuItems);

  return (
    <div className="mt-4 pb-3 3xl:mt-6">
      {!hideStoreProgress && (
        <Link
          href={`/${lang!}/store-progress`}
          className={cn(
            'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
            pathname?.startsWith(`/${lang!}/store-progress`)
              ? 'before:top-2/5 text-redColor before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-redColor 2xl:before:-start-5'
              : 'text-mainTextColor transition-colors duration-200 hover:bg-red-50 hover:text dark:text-gray-700/90'
          )}
        >
          <div className="flex items-center truncate">
            {/* {item?.icon && (
              <span
                className={cn(
                  'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                  isActive
                    ? 'text-redColor'
                    : 'text-mainTextColor dark:text-gray-500 dark:group-hover:text-gray-700'
                )}
              >
                {item?.icon}
              </span>
            )} */}
            <picture>
              <source
                srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6a8/512.webp"
                type="image/webp"
              />
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6a8/512.gif"
                alt="🚨"
                width={20}
                height={20}
                className="me-2"
              />
            </picture>
            <span className="truncate">{t('side-store-progress')}</span>
          </div>
          {/* {item?.badge?.length ? (
            <StatusBadge status={item?.badge} />
          ) : null} */}
        </Link>
      )}
       {filteredMenuItems.map((item, index) => {
          const isActive = pathname?.startsWith(item?.href as string);
          const pathnameExistInDropdowns = item?.dropdownItems?.filter((dropdownItem: any) =>
            pathname.startsWith(dropdownItem.href) ||
            (Array.isArray(dropdownItem.hrefChild)
              ? dropdownItem.hrefChild.some((child: string) => pathname.startsWith(child))
              : pathname.startsWith(dropdownItem.hrefChild))
          );
          const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);
        return (
          <Fragment key={item.name + '-' + index}>
            {item?.href ? (
              <>
                {item?.dropdownItems ? (
                  <Collapse
                    defaultOpen={isDropdownOpen}
                    header={({ open, toggle }) => (
                      <div
                        onClick={toggle}
                        className={cn(
                          'group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2',
                          isDropdownOpen
                            ? 'before:top-2/5 text-redColor before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-redColor 2xl:before:-start-5'
                            : 'text-mainTextColor transition-colors duration-200 hover:bg-gray-100 dark:text-gray-700/90 dark:hover:text-gray-700'
                        )}
                      >
                        <span  className={cn(
                              'flex items-center', 
                              isDropdownOpen
                                  ? 'text-redColor'
                                  : 'text-mainTextColor dark:text-gray-500 dark:group-hover:text-gray-700'
                              )}>
                          {item?.icon && (
                            <span
                              className={cn(
                                'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                isDropdownOpen
                                  ? 'text-redColor'
                                  : 'text-mainTextColor dark:text-gray-500 dark:group-hover:text-gray-700'
                              )}
                            >
                              {item?.icon}
                            </span>
                          )}
                          {t(item.name)}
                        </span>

                        <PiCaretDownBold
                          strokeWidth={3}
                          className={cn(
                            'h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90',
                            open && 'rotate-0 rtl:rotate-0 text-redColor'
                          )}
                        />
                      </div>
                    )}
                  >
                   {item?.dropdownItems?.map((dropdownItem:any, index: any) => {
                          const isChildActive =
                          pathname.startsWith(dropdownItem?.href) ||
                          (Array.isArray(dropdownItem?.hrefChild) &&
                            dropdownItem.hrefChild.some((child: string) => pathname.startsWith(child)));
                      return (
                        <Link
                          href={dropdownItem?.href}
                          key={dropdownItem?.name + index}
                          className={cn(
                            'mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-3.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5',
                            isChildActive
                              ? 'text-redColor'
                              : 'text-mainTextColor transition-colors duration-200 hover:bg-red-50 hover:text-gray-900'
                          )}
                        >
                          <div    className={cn(
                            'flex items-center truncate',
                            isChildActive
                              ? 'text-redColor'
                              : 'text-mainTextColor transition-colors duration-200  hover:text-gray-900'
                          )}>
                            <span
                              className={cn(
                                'me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
                                isChildActive
                                  ? 'bg-redColor ring-[1px] ring-redColor'
                                  : 'opacity-40 '
                              )}
                            />{' '}
                            <span className="truncate">
                              {t(dropdownItem?.name)}
                            </span>
                          </div>
                          {dropdownItem?.badge?.length ? (
                            <StatusBadge status={dropdownItem?.badge as string} />
                          ) : null}
                        </Link>
                      );
                    })}
                  </Collapse>
                ) : (
                  <Link
                    href={item?.href}
                    className={cn(
                      'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
                      isActive
                        ? 'before:top-2/5 text-redColor before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-redColor 2xl:before:-start-5'
                        : 'text-mainTextColor transition-colors duration-200 hover:bg-red-50 hover:text dark:text-gray-700/90'
                    )}
                  >
                    <div className="flex items-center truncate">
                      {item?.icon && (
                        <span
                          className={cn(
                            'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                            isActive
                              ? 'text-redColor'
                              : 'text-mainTextColor dark:text-gray-500 dark:group-hover:text-gray-700'
                          )}
                        >
                          {item?.icon}
                        </span>
                      )}
                      <span className="truncate">{t(item.name)}</span>
                    </div>
                    {/* {item?.badge?.length ? (
                      <StatusBadge status={item?.badge} />
                    ) : null} */}
                  </Link>
                )}
              
              </>
            ) : (
              <></>
              // <Title
              //   as="h6"
              //   className={cn(
              //     'mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 2xl:px-8',
              //     index !== 0 && 'mt-6 3xl:mt-7'
              //   )}
              // >
              //   {item.name}
              // </Title>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
