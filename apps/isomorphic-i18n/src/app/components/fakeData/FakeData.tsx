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
import UpdateFakeDataStoreButton from "../store/UpdateFakeDataStoreButton";
import { getFakeData } from "@/app/lib/api/fakeData";
import RoleExist from "../ui/roleExist/RoleExist";
import { GetCookiesClient } from "../ui/getCookiesClient/GetCookiesClient";
const QuillEditor = dynamic(() => import("@ui/quill-editor"), {
    ssr: false,
});

export default function FakeData({ lang }: { lang?: string }) {
    const { t, i18n } = useTranslation(lang!, "form");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>();
    const { couponData, setCouponData, } = useUserContext();
    const shopId = GetCookiesClient('shopId');
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const data = await getFakeData({ lang,shopId:shopId as any });
                if (data) {
                    setData(data)
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
        if (couponData) {
            fetchData();
            setCouponData(false);
        }
    }, [lang, couponData]);


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
                                <div title={t('fakeData')} className='space-y-4 border border-muted bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg'>
                                    <div className="flex justify-between ">
                                        <h3 className="text-base font-semibold sm:text-lg">{t('fakeData')}</h3>
                                        {/* <button>{lang == "en" ? "Update Store" : 'تعديل متجر'}</button> */}
                                        <RoleExist PageRoles={['UpdateFakeData', 'CreateFakeData']}>
                                            <UpdateFakeDataStoreButton lang={lang} title={lang == "en" ? "Update" : 'تعديل'} buttonLabel={lang == "en" ? "Update" : 'تعديل'} modalBtnLabel={lang == "en" ? "Update" : 'تعديل'} onSuccess={() => {
                                                console.log('true');
                                            }} />
                                        </RoleExist>
                                    </div>

                                    <div className="mb-3 sm:flex items-center gap-2">
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {t('IsFakeViewersAvailable')} :
                                        </label>
                                        <div className={`${data?.isFakeViewersAvailable ? "bg-[#B9F9CF]" : "bg-[#fc9090]"
                                            } flex items-center gap-2 w-fit py-1 px-3 rounded-full`}>
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${data?.isFakeViewersAvailable ? "bg-green-500" : "bg-red-500"
                                                    }`}
                                            />
                                            <span className="text-sm font-medium">
                                                {data?.isFakeViewersAvailable ? t("active") : t("deactive")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="sm:flex justify-between gap-10 my-5">
                                        <div className="sm:w-1/2">
                                            <CustomInput
                                                label={t('MinimumFakeViewers')}
                                                placeholder={t('MinimumFakeViewers')}
                                                id="MinimumFakeViewers"
                                                name="MinimumFakeViewers"
                                                readOnly
                                                value={data?.minimumFakeViewers}
                                                className=""
                                            />
                                        </div>
                                        <div className="sm:w-1/2 sm:mt-0 mt-3">
                                            <CustomInput
                                                label={t('MaximumFakeViewers')}
                                                placeholder={t('MaximumFakeViewers')}
                                                id="MaximumFakeViewers"
                                                name="MaximumFakeViewers"
                                                readOnly
                                                value={data?.maximumFakeViewers}
                                                className=""
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3 sm:flex items-center gap-2">
                                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                            {t('IsFakeSoldNumberAvailable')} :
                                        </label>
                                        <div className={`${data?.isFakeSoldNumberAvailable ? "bg-[#B9F9CF]" : "bg-[#fc9090]"
                                            } flex items-center gap-2 w-fit py-1 px-3 rounded-full`}>
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${data?.isFakeSoldNumberAvailable ? "bg-green-500" : "bg-red-500"
                                                    }`}
                                            />
                                            <span className="text-sm font-medium">
                                                {data?.isFakeSoldNumberAvailable ? t("active") : t("deactive")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="sm:flex justify-between gap-10 my-5">

                                        <div className="sm:w-1/2 sm:mt-0 mt-3">
                                            <CustomInput
                                                label={t('MinimumFakeSoldNumber')}
                                                placeholder={t('MinimumFakeSoldNumber')}
                                                id="MinimumFakeSoldNumber"
                                                name="MinimumFakeSoldNumber"
                                                readOnly
                                                value={data?.minimumFakeSoldNumber}
                                                className=""
                                            />
                                        </div>
                                        <div className="sm:w-1/2 sm:mt-0 mt-3">
                                            <CustomInput
                                                label={t('MaximumFakeSoldNumber')}
                                                placeholder={t('MaximumFakeSoldNumber')}
                                                id="MaximumFakeSoldNumber"
                                                name="MaximumFakeSoldNumber"
                                                readOnly
                                                value={data?.maximumFakeSoldNumber}
                                                className=""
                                            />
                                        </div>
                                    </div>
                                    <CustomInput
                                        label={t('LastSoldNumberInHours')}
                                        placeholder={t('LastSoldNumberInHours')}
                                        id="LastSoldNumberInHours"
                                        name="LastSoldNumberInHours"
                                        readOnly
                                        value={data?.lastSoldNumberInHours}
                                        className=""
                                    />

                                </div>
                            </div>
                            {/* <div className="mx-auto  mt-3 grid w-full max-w-screen-4xl gap-7 @2xl:gap-9 @3xl:gap-11">
                                <div className='space-y-4 border border-muted bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg'>
                                    <div className="flex justify-between ">
                                        <h3 className="text-base font-semibold sm:text-lg">{lang === 'ar' ? 'نصائح وإرشادات' : 'Tips and advice'}</h3>
                                    </div>
                                    <div className="bg-[#F8F9FA] rounded-lg p-4  border-s-4 border-redColor">
                                        <p className="text-lg font-semibold text-[#2C3E50]">{lang === 'ar' ? 'كيف تحسن تجربة عملائك' : 'How to improve your customer experience'}</p>
                                        <ul className="ps-8 list-disc text-[#2C3E50] font-medium text-base mt-3">
                                            <li className="mb-2">{t('couponsHint')}</li>
                                            <li className="mb-2">{t('freeShippingHint')}</li>
                                            <li className="mb-2">{t('viewersHint')}</li>
                                            <li>{t('salesTimeHint')}</li>
                                        </ul>


                                    </div>
                                </div>
                            </div> */}
                             <WidgetCard title={lang === 'ar' ? 'كيف تحسن تجربة عملائك' : 'How to improve your customer experience'} className="mt-5">
                                            <ul className="ps-5 list-disc text-[#4A5568] font-medium text-base mt-3">
                                            <li className="mb-2">{t('couponsHint')}</li>
                                            <li className="mb-2">{t('freeShippingHint')}</li>
                                            <li className="mb-2">{t('viewersHint')}</li>
                                            <li>{t('salesTimeHint')}</li>
                                            </ul>
                                        </WidgetCard>
                        </>
                    );
                }}
            </Form>
        </>
    );
}

