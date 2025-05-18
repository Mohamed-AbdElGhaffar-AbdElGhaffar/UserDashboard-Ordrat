"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { SubmitHandler, Controller } from "react-hook-form";
import { PiEnvelopeSimple, PiSealCheckFill } from "react-icons/pi";
import { Form } from "@ui/form";
import { Button, Title, Text, Input, Checkbox, Textarea } from "rizzui";
import cn from "@utils/class-names";
import { routes } from "@/config/routes";
import toast from "react-hot-toast";
import AvatarUpload from "@ui/file-upload/avatar-upload";
import {
  defaultValues,
  profileFormSchema,
  ProfileFormTypes,
} from "@/validators/profile-settings.schema";
import { roles } from "@/data/forms/my-details";
import FormGroup from "@/app/shared/form-group";
import Link from "next/link";
import FormFooter from "@components/form-footer";
import UploadZone from "@ui/file-upload/upload-zone";
import { useLayout } from "@/layouts/use-layout";
import { useBerylliumSidebars } from "@/layouts/beryllium/beryllium-utils";
import { LAYOUT_OPTIONS } from "@/config/enums";
import { useTranslation } from "@/app/i18n/client";
import { getShop } from "@/app/lib/api/shop";
import { ShopInfo } from "@/types";
import { useUserContext } from "@/app/components/context/UserContext";
import { useEffect, useState } from "react";
import UpdateStoreButton from '@/app/components/store/UpdateStoreButton'
import WidgetCard from "@components/cards/widget-card";
import CustomInput from "@/app/components/ui/customForms/CustomInput";
import CustomSelect from "@/app/components/ui/customForms/CustomSelect";
import Select from 'react-select'
import { HexColorPicker } from "react-colorful";
import RoleExist from "@/app/components/ui/roleExist/RoleExist";
import { GetCookiesClient } from "@/app/components/ui/getCookiesClient/GetCookiesClient";
const QuillEditor = dynamic(() => import("@ui/quill-editor"), {
  ssr: false,
});

export default function ProfileSettingsView({ lang }: { lang?: string }) {
  const { t, i18n } = useTranslation(lang!, "form");
  const [loading, setLoading] = useState(false);
  const [shoplang, setshoplang] = useState();
  const { shop, setShop } = useUserContext();
  const { fileData } = useUserContext();
  const { couponData, setCouponData } = useUserContext();
  const shopId = GetCookiesClient('shopId');
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data: ShopInfo | null = await getShop({ lang, shopId: shopId as any });
        if (data) {
          setShop(data)
          setshoplang(data?.languages as any)
          console.log('SHOP loaded:', data);
        } else {
          console.error('No data returned from API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lang]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: ShopInfo | null = await getShop({ lang, shopId: shopId as any });
        if (data) {
          setShop(data);
          setshoplang(data?.languages as any)
          console.log('SHOP updated:', data);
        } else {
          console.error('No data returned from API');
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (couponData) {
      fetchData();
      setCouponData(false);
    }
  }, [couponData]);

  const onSubmit: SubmitHandler<ProfileFormTypes> = (data) => {
    toast.success(<Text as="b">{t('shopupdate')}</Text>);
    console.log("Profile settings data ->", data);
  };

  const options = [
    { label: lang === 'ar' ? 'نسبة مئوية' : 'Percentage', value: '0' },
    { label: lang === 'ar' ? 'رقم ثابت' : 'Fixed number', value: '1' },
  ]
  const optionsApplyTwoLanguages = [
    { value: false, label: t('OneLanguages') },
    { value: true, label: t('TwoLanguages') },
  ];

  const getLabelByCode = (code: number) => {
    switch (code) {
      case 0:
        return t("OneLanguages");
      case 1:
        return t("EnLanguages");
      case 2:
        return t("TwoLanguages");
    }
  };

  return (
    <>
      <Form<ProfileFormTypes>
        validationSchema={profileFormSchema}
        onSubmit={onSubmit}
        className="@container"
        useFormProps={{
          mode: "onChange",
          defaultValues,
        }}
      >
        {({
          register,
          control,
          getValues,
          setValue,
          formState: { errors },
        }) => {
          return (
            <>
              <ProfileHeader
                lang={lang!}
                title="Olivia Rhye"
                description={t('form-profile-description')}
              >
                <div className="w-full sm:w-auto md:ms-auto md:mt-0 mt-3">
                  {/* <Link href={routes.profile}>
                    <Button as="span">{t("form-view-profile")}</Button>
                  </Link> */}
                  <RoleExist PageRoles={['UpdateShop']}>
                    <UpdateStoreButton lang={lang} title={lang == "en" ? "Update Store" : 'تعديل متجر'} buttonLabel={lang == "en" ? "Update Store" : 'تعديل متجر'} modalBtnLabel={lang == "en" ? "Update Store" : 'تعديل متجر'} onSuccess={() => {
                      console.log('true');
                    }} />
                  </RoleExist>
                </div>
              </ProfileHeader>
              <div className="mx-auto mb-10 md:pt-32 pt-40 grid w-full max-w-screen-4xl gap-7 @2xl:gap-9 @3xl:gap-11">
                <WidgetCard title={t('basic-Title1')}>
                  <div className="md:flex justify-between items-center gap-10 mt-10">
                    <div className="md:w-1/2">
                      <label className='font-medium'>{t('shop-subdomainName')}</label>
                      <div className="relative flex  items-center col-span-full ltr:text-left ltr:direction-ltr  mt-1.5" dir="ltr">
                        <span className="absolute left-3 text-gray-500 text-sm border-e pe-3 h-full pt-3 border-gray-500">https://</span>
                        <input
                          disabled
                          type="url"
                          value={shop?.subdomainName.split('.ordrat.com')[0]}
                          className="pl-20 pr-4 w-full border rounded-md ltr:text-left direction-ltr"
                          dir="ltr"
                          placeholder={t("shop-subdomainName")}
                        />
                        <span className="absolute right-3 text-gray-500 text-sm border-s ps-3 h-full pt-3 border-gray-500">.ordrat.com</span>
                        {/* <span className="absolute text-sm -bottom-6">{t('domain-name')}</span> */}
                      </div>

                    </div>
                    <div className="md:w-1/2 sm:mt-0 mt-6">
                      <CustomInput
                        label={t('currency')}
                        placeholder={t('currency')}
                        id='currency'
                        value={shop?.currencyName}
                        readOnly
                        name='currency'
                        className=''

                      />
                    </div>
                  </div>

                  <div className="sm:flex justify-between gap-10 mt-4">
                    {(shoplang === 0 || shoplang === 2) && (
                      <div className="sm:w-1/2">
                        <Textarea
                          label={t('MetaDescriptionAr')}
                          placeholder={t('MetaDescriptionAr')}
                          id="MetaDescriptionAr"
                          size="lg"
                          readOnly
                          name="MetaDescriptionAr"
                          value={shop?.descriptionAr}
                        />
                      </div>
                    )}

                    {(shoplang === 1 || shoplang === 2) && (
                      <div className="sm:w-1/2 sm:mt-0 mt-3">
                        <Textarea
                          label={t('MetaDescriptionEn')}
                          placeholder={t('MetaDescriptionEn')}
                          id="MetaDescriptionEn"
                          size="lg"
                          readOnly
                          name="MetaDescriptionEn"
                          value={shop?.descriptionEn}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-10 justify-between mt-4">

                    <Input label={t('vat')} placeholder={t('vat')} name="nameAr"
                      readOnly
                      value={shop?.vat} className=" sm:w-1/2" />
                    <Input
                      label={t('vatType')}
                      placeholder={t('vatType')}
                      name="nameEn"
                      readOnly
                      value={options.find(opt => opt.value == shop?.vatType as any)?.label || ''}
                      className="sm:w-1/2"
                    />

                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-10 justify-between mt-4">
                    <div className="sm:w-1/2 ">
                      <CustomInput
                        label={t('optionsApplyTwoLanguages')}
                        placeholder={t('optionsApplyTwoLanguages')}
                        id='optionsApplyTwoLanguages'
                        value={getLabelByCode(Number(shop?.languages))}
                        readOnly
                        name='optionsApplyTwoLanguages'
                        className=''
                      />

                    </div>

                    <div className="sm:w-1/2 ">
                      {shop?.applyServiceOnDineInOnly === true &&
                        <CustomInput
                          label={lang === 'ar' ? 'سعر الخدمة' : 'Service Price'}
                          placeholder={t('Service')}
                          id='Service'
                          value={shop?.service}
                          readOnly
                          name='Service'
                          className=''
                        />

                      }
                    </div>
                  </div>
                  <div className="sm:flex justify-between gap-10 my-5">
                    <div className="sm:w-1/2">

                      <div className="mb-3 flex items-center gap-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                          {lang === 'ar' ? 'تطبيق الضريبة علي الصالة فقط' : 'Apply Vat On DineIn Only'} :                                           </label>
                        <div className={`${shop?.applyVatOnDineInOnly ? "bg-[#B9F9CF]" : "bg-[#fc9090]"
                          } flex items-center gap-2 w-fit py-1 px-3 rounded-full`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${shop?.applyVatOnDineInOnly ? "bg-green-500" : "bg-red-500"
                              }`}
                          />
                          <span className="text-sm font-medium">
                            {shop?.applyVatOnDineInOnly ? t("active") : t("deactive")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:w-1/2 sm:mt-0 mt-3">
                      <div className="mb-3 flex items-center gap-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                          {lang === 'ar' ? 'تطبيق الخدمة علي الصالة فقط' : 'Apply Service On DineIn Only'} :
                        </label>
                        <div className={`${shop?.applyServiceOnDineInOnly ? "bg-[#B9F9CF]" : "bg-[#fc9090]"
                          } flex items-center gap-2 w-fit py-1 px-3 rounded-full`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${shop?.applyServiceOnDineInOnly ? "bg-green-500" : "bg-red-500"
                              }`}
                          />
                          <span className="text-sm font-medium">
                            {shop?.applyServiceOnDineInOnly ? t("active") : t("deactive")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </WidgetCard>
              </div>
              <div className="mx-auto mb-10  pt-2 grid w-full max-w-screen-4xl gap-7 @2xl:gap-9 @3xl:gap-11">
                <WidgetCard title={t('color-title')}>
                  <div className="flex lg:flex-row flex-col gap-10 justify-between mt-5">
                    <div className="lg:w-1/2 ">
                      {/* <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-16 col-span-full"> */}
                      <div className="w-full">
                        <p className="mb-2 font-medium ">{t('selectColor-one')}</p>
                        {/* <div className="border rounded-md border-gray-500  pe-2 ps-2 py-1 items-center gap-2"> */}
                        {/* <div
                              className="my-div rounded-md mb-1"
                              style={{
                                width: "100%",
                                height: "30px",
                                backgroundColor: shop?.mainColor,
                              }}
                            ></div> */}
                        <div style={{ pointerEvents: 'none' }}>
                          <HexColorPicker
                            color={shop?.mainColor}
                            onChange={() => { }}
                            className="!w-full"
                          />
                        </div>
                        {/* <span className=" text-base font-medium mt-1">{shop?.mainColor}</span> */}
                        {/* </div> */}
                        {/* </div> */}
                        {/* <div className="">
                          <p className="mb-2 font-medium ">{t('selectColor-two')}</p> */}
                        {/* <div className="border rounded-md border-gray-500  pe-2 ps-2 py-1 items-center gap-2">

                            <div
                              className="my-div rounded-md mb-1"
                              style={{
                                width: "100%",
                                height: "30px",
                                backgroundColor: shop?.secondaryColor,
                              }}
                            ></div>
                            </div> */}
                        {/* <div style={{ pointerEvents: 'none' }}>
                            <HexColorPicker
                              color={shop?.secondaryColor}
                              onChange={() => { }}
                            />
                          </div> */}
                        {/* <span className=" text-base font-medium mt-1">{shop?.secondaryColor}</span> */}
                        {/* </div> */}
                      </div>
                    </div>
                    <div className="lg:w-1/2 ">
                      {/* <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-16 col-span-full"> */}
                      <div className="w-full">
                        <p className="mb-2 font-medium ">{t('selectColor-two')}</p>

                        <div className="w-full" style={{ pointerEvents: 'none', width: '100%' }}>
                          <HexColorPicker
                            color={shop?.secondaryColor}
                            onChange={() => { }}
                            className="!w-full"
                          />
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </WidgetCard>
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}

export function ProfileHeader({
  title,
  lang,
  description,
  children,
}: React.PropsWithChildren<{ title: string; description?: string; lang: string; }>) {
  const { layout } = useLayout();
  const { t, i18n } = useTranslation(lang!, "basicData");
  const { expandedLeft } = useBerylliumSidebars();
  const [loading, setLoading] = useState(false);
  const { shop, setShop } = useUserContext();
  const shopId = GetCookiesClient('shopId');
  // useEffect(() => {
  //   i18n.changeLanguage(lang);
  // }, [lang, i18n]);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data: ShopInfo | null = await getShop({ lang, shopId: shopId as any });
        if (data) {
          setShop(data)
          console.log('SHOP loaded:', data);
        } else {
          console.error('No data returned from API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lang]);

  return (
    <div
      className={cn(
        "relative z-0 -mx-4 px-4 pt-28",
        layout === LAYOUT_OPTIONS.BERYLLIUM && expandedLeft
          ? "3xl:pt-[190px]"
          : "xl:before:w-[calc(100%_+_10px)]"
      )}
      style={{
        backgroundImage: `url(${shop?.backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '200px'
      }}
    >
      <div className="relative z-10 mx-auto md:flex w-full max-w-screen-4xl items-end justify-start gap-6 pt-0 md:pt-8 lg:pt-4 xl:pt-10 2xl:pt-0 pb-10">
        <div className="relative -top-1/3 aspect-square w-32 overflow-hidden rounded-full border-[6px] border-white bg-gray-100 shadow-profilePic @2xl:w-[130px] @5xl:-top-2/3 @5xl:w-[150px] dark:border-gray-50 3xl:w-[200px]">
          <Image
            src={shop?.logoUrl}
            alt={(lang === 'ar' ? shop?.nameAr : shop?.nameEn) as string}
            width={300}
            height={250}
            className="w-full object-cover h-full"
          />
        </div>
        <div>
          <Title as="h2" className="mb-1 mt-2 sm:mt-0 inline-flex items-center gap-3 text-xl font-bold text-gray-900">
            {lang === 'ar' ? shop?.nameAr : shop?.nameEn}
          </Title>
          {shop?.shopType !== undefined && (
            <Text className="text-sm text-gray-500">
              {shop.shopType === 0 ? t('restaurant') : t('shop')}
            </Text>
          )}
        </div>
        {children}
      </div>
    </div>

  );
}