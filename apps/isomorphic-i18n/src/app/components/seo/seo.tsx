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
import UpdateAddStoreButton from "../store/UpdateAddStoreButton";
import UpdateSeoStoreButton from "../store/UpdateSeoStoreButton";
import RoleExist from "../ui/roleExist/RoleExist";
import { GetCookiesClient } from "../ui/getCookiesClient/GetCookiesClient";
const QuillEditor = dynamic(() => import("@ui/quill-editor"), {
    ssr: false,
});
export default function Seo({ lang }: { lang?: string }) {
    const { t, i18n } = useTranslation(lang!, "form");
    const [loading, setLoading] = useState(false);
    const { couponData, setCouponData, shop, setShop } = useUserContext();
    const shopId = GetCookiesClient('shopId');
    const [shoplang, setshoplang] = useState();

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
        { label: 'true', value: true },
        { label: 'false', value: false },
    ]

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

                            <div className="mx-auto  grid w-full max-w-screen-4xl gap-7 @2xl:gap-9 @3xl:gap-11">
                                <div title={lang === 'ar' ? 'تحسين محركات البحث' : 'Seo'} className='space-y-4 border border-muted bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg'>
                                    <div className="flex justify-between ">
                                        <h3 className="text-base font-semibold sm:text-lg">{t('seo')}</h3>
                                        {/* <button>{lang == "en" ? "Update Store" : 'تعديل متجر'}</button> */}
                                        <RoleExist PageRoles={['UpdateShop']}>
                                            <UpdateSeoStoreButton lang={lang} title={lang == "en" ? "Update" : 'تعديل '} buttonLabel={lang == "en" ? "Update" : 'تعديل '} modalBtnLabel={lang == "en" ? "Update " : 'تعديل '} onSuccess={() => {
                                                console.log('true');
                                            }} />
                                        </RoleExist>
                                    </div>
                                    <div className="">
                                        <div className="">
                                            {(shoplang === 0 || shoplang === 2) && (
                                                <>
                                                    <CustomInput
                                                        label={t('titleAr')}
                                                        placeholder={t('titleAr')}
                                                        id='titleAr'
                                                        // size='lg'
                                                        readOnly={true}
                                                        value={shop?.titleAr}

                                                        name='titleAr'
                                                        className='mb-1'
                                                    />
                                                    <span className="text-xs font-medium ">{lang === 'ar' ? 'عنوان الصفحة الرئيسية باللغة العربية (يظهر في نتائج البحث)' : 'Home page title in Arabic (appears in search results)'}</span>
                                                </>
                                            )}
                                        </div>
                                        {(shoplang === 1 || shoplang === 2) && (

                                            <div className=" mt-4">
                                                <CustomInput
                                                    label={t('titleEn')}
                                                    placeholder={t('titleEn')}
                                                    id='titleEn'
                                                    // size='lg'
                                                    readOnly={true}
                                                    value={shop?.titleEn}
                                                    name='titleEn'
                                                    className='mb-1'
                                                />
                                                <span className="text-xs font-medium">{lang === 'ar' ? 'عنوان الصفحة الرئيسية باللغة الإنجليزية (يظهر في نتائج البحث)' : 'Home page title in English (appears in search results)'}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="">
                                        {(shoplang === 0 || shoplang === 2) && (

                                            <div className="">
                                                <Textarea
                                                    label={t('MetaDescriptionAr')}
                                                    placeholder={t('MetaDescriptionAr')}
                                                    id='MetaDescriptionAr'
                                                    size='lg'
                                                    readOnly
                                                    name='MetaDescriptionAr'
                                                    value={shop?.metaDescriptionAr}
                                                    className='mb-1'
                                                />
                                                <span className="text-xs font-medium">{lang === 'ar' ? 'وصف الموقع باللغة العربية (يظهر في نتائج البحث)' : 'Website description in Arabic (appears in search results)'}</span>
                                            </div>
                                        )}
                                        {(shoplang === 1 || shoplang === 2) && (

                                            <div className="mt-4">
                                                <Textarea
                                                    label={t('MetaDescriptionEn')}
                                                    placeholder={t('MetaDescriptionEn')}
                                                    id='MetaDescriptionEn'
                                                    size='lg'
                                                    value={shop?.metaDescriptionEn}
                                                    readOnly
                                                    name='MetaDescriptionEn'
                                                    className='mb-1'
                                                />
                                                <span className="text-xs font-medium">{lang === 'ar' ? 'وصف الموقع باللغة الإنجليزية (يظهر في نتائج البحث)' : 'Website description in English (appears in search results)'}</span>
                                            </div>
                                        )}
                                    </div>
                                    {(shoplang === 0 || shoplang === 2) && (
                                        <div className="">
                                            <h4 className="text-base my-3">
                                                {lang === 'ar' ? 'معاينة ظهور موقعك في نتائج البحث' : 'Preview your site\'\s appearance in search results'}
                                            </h4>
                                            <div className="bg-[#F8F9FA] rounded-lg p-5">
                                                <p className="font-medium ">{lang === 'ar' ? 'نتائج البحث باللغة العربية' : 'Search results in Arabic'}</p>
                                                <div className="bg-white rounded-lg p-3 mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-[#F3F5F6] rounded-full border">
                                                            <Image width={20} height={20} className={`w-full h-full `} src={shop?.logoUrl} alt={shop?.titleAr as string} />
                                                        </div>
                                                        <div className="">

                                                            <p className="text-[#4A5568] font-medium text-sm ">{shop?.nameAr}</p>
                                                            <a href={` https://${shop?.subdomainName}`} className="text-[#006621] font-medium text-xs ">{` https://${shop?.subdomainName}`}</a>
                                                        </div>
                                                    </div>
                                                    <p className="text-[#1A0DAB] font-semibold text-lg fontA mt-1">{shop?.titleAr}</p>
                                                    <p className="text-[#4A5568] font-medium text-base fontA">{shop?.metaDescriptionAr}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {(shoplang === 1 || shoplang === 2) && (
                                        <div className="mt-2">
                                            <div className="bg-[#F8F9FA] rounded-lg p-5">
                                                <p className="font-medium ">{lang === 'ar' ? 'نتائج البحث باللغة الانجليزية' : 'Search results in English'}</p>
                                                <div className="bg-white rounded-lg p-3 mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-[#F3F5F6] rounded-full border">
                                                            <Image width={20} height={20} className={`w-full h-full `} src={shop?.logoUrl} alt={shop?.titleAr as string} />
                                                        </div>
                                                        <div className="">

                                                            <p className="text-[#4A5568] font-medium text-sm ">{shop?.nameEn}</p>
                                                            <a href={` https://${shop?.subdomainName}`} className="text-[#006621] font-medium text-xs ">{` https://${shop?.subdomainName}`}</a>
                                                        </div>
                                                    </div>
                                                    <p className="text-[#1A0DAB] font-semibold text-lg fontA mt-1">{shop?.titleEn}</p>
                                                    <p className="text-[#4A5568] font-medium text-base fontA">{shop?.metaDescriptionEn}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </>
                    );
                }}
            </Form>
        </>
    );
}

