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
import { GetCookiesClient } from "../ui/getCookiesClient/GetCookiesClient";
const QuillEditor = dynamic(() => import("@ui/quill-editor"), {
    ssr: false,
});

export default function Qr({ lang }: { lang?: string }) {
    const { t, i18n } = useTranslation(lang!, "form");
    const [loading, setLoading] = useState(false);
    const { couponData, setCouponData, shop, setShop } = useUserContext();
    const shopId = GetCookiesClient('shopId');

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const data: ShopInfo | null = await getShop({ lang,shopId:shopId as string });
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data: ShopInfo | null = await getShop({ lang,shopId:shopId as string });
                if (data) {
                    setShop(data);
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
                                <div title={t('addsetting')} className='space-y-4 border border-muted bg-gray-0 p-5 dark:bg-gray-50 lg:p-7 rounded-lg'>
                                    <div className="flex justify-between ">
                                        <h3 className="text-base font-semibold sm:text-lg">{t('Qr')}</h3>
                                        {/* <button>{lang == "en" ? "Update Store" : 'تعديل متجر'}</button> */}
                                        <UpdateSeoStoreButton lang={lang} title={lang == "en" ? "Update" : 'تعديل '} buttonLabel={lang == "en" ? "Update" : 'تعديل '} modalBtnLabel={lang == "en" ? "Update " : 'تعديل '} onSuccess={() => {
                                            console.log('true');
                                        }} />            </div>
                                        <div className="sm:flex justify-between gap-10">
                                            <div className="sm:w-1/2">
                                                <CustomInput
                                                    label={t('titleAr')}
                                                    placeholder={t('titleAr')}
                                                    id='titleAr'
                                                    // size='lg'
                                                    readOnly={true}
                                                    value={shop?.titleAr}

                                                    name='titleAr'
                                                    className=''
                                                />
                                            </div>
                                            <div className="sm:w-1/2 sm:mt-0 mt-3">
                                                <CustomInput
                                                    label={t('titleEn')}
                                                    placeholder={t('titleEn')}
                                                    id='titleEn'
                                                    // size='lg'
                                                    readOnly={true}
                                                    value={shop?.titleEn}


                                                    name='titleEn'
                                                    className=''
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:flex justify-between gap-10">
                                            <div className="sm:w-1/2">
                                                <Textarea
                                                    label={t('MetaDescriptionAr')}
                                                    placeholder={t('MetaDescriptionAr')}
                                                    id='MetaDescriptionAr'
                                                    size='lg'
                                                    readOnly
                                                    name='MetaDescriptionAr'
                                                    value={shop?.metaDescriptionAr}


                                                    className=''
                                                />
                                            </div>
                                            <div className="sm:w-1/2 sm:mt-0 mt-3">
                                                <Textarea
                                                    label={t('MetaDescriptionEn')}
                                                    placeholder={t('MetaDescriptionEn')}
                                                    id='MetaDescriptionEn'
                                                    size='lg'
                                                    value={shop?.metaDescriptionEn}
                                                    readOnly
                                                    name='MetaDescriptionEn'
                                                    className=''
                                                />
                                            </div>
                                        </div>
                                    {/* <WidgetCard title={t('seo')} className='space-y-4'>
                                        <div className="sm:flex justify-between gap-10 my-5">
                                            <div className="sm:w-1/2">
                                                <CustomInput
                                                    label={t('showAllCouponsInSideBar')}
                                                    placeholder={t('showAllCouponsInSideBar')}
                                                    id="showAllCouponsInSideBar"
                                                    name="showAllCouponsInSideBar"
                                                    readOnly
                                                    value={shop?.showAllCouponsInSideBar ? "Yes" : "No"}
                                                    className=""
                                                />
                                            </div>
                                            <div className="sm:w-1/2 sm:mt-0 mt-3">
                                                <CustomInput
                                                    label={t('applyFreeShppingOnTarget')}
                                                    placeholder={t('applyFreeShppingOnTarget')}
                                                    id="applyFreeShppingOnTarget"
                                                    name="applyFreeShppingOnTarget"
                                                    readOnly
                                                    value={shop?.applyFreeShppingOnTarget ? "Yes" : "No"}
                                                    className=""
                                                />
                                            </div>
                                        </div>
                                        <CustomInput
                                            label={t('freeShppingTarget')}
                                            placeholder={t('freeShppingTarget')}
                                            id="freeShppingTarget"
                                            name="freeShppingTarget"
                                            readOnly
                                            value={shop?.freeShppingTarget}
                                            className=""
                                        />
                                    </WidgetCard> */}
                                </div>
                            </div>
                        </>
                    );
                }}
            </Form>
        </>
    );
}

