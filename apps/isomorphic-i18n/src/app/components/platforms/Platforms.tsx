"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faFloppyDisk, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../context/api";
import CustomInput from "@/app/components/ui/customForms/CustomInput";
import googlean from '@public/assets/google-analytics-svgrepo-com.svg';
import googleAds from '@public/assets/google-ads-svgrepo-com.svg';
import googleman from '@public/assets/google-tag-manager-svgrepo-com.svg';
import hotgar from '@public/assets/idpIPxVnhg_1744610071053.png';
import snapchat from '@public/assets/snapchat-svgrepo-com.svg';
import tiktok from '@public/assets/tiktok-logo-logo-svgrepo-com.svg';
import meta from '@public/assets/meta-12368.svg';
import delete1 from '@public/assets/delete.png';
import PencilIcon from '@components/icons/pencil';
import TrashIcon from "@components/icons/trash";
import RoleExist from "../ui/roleExist/RoleExist";
import { GetCookiesClient } from "../ui/getCookiesClient/GetCookiesClient";

interface Pixel {
    id: string;
    name: string;
}

export default function Platforms({ lang }: { lang?: string }) {
    const [pixels, setPixels] = useState<Pixel[]>([]);
    const [loading, setLoading] = useState(false);
    const [pixelValues, setPixelValues] = useState<{ [id: string]: string }>({});
    const [selectedPixel, setSelectedPixel] = useState<string | null>(null);
    const [assignedPixelIds, setAssignedPixelIds] = useState<string[]>([]);
    const [selectedPixelToDelete, setSelectedPixelToDelete] = useState<string | null>(null);
    const shopId = GetCookiesClient('shopId');

    const getPixels = async () => {
        try {
            const res = await axiosClient.get("/api/Pixel/GetAll");
            setPixels(res.data);
        } catch (error) {
            console.error("Failed to load pixels:", error);
        }
    };

    useEffect(() => {
        getPixels();
    }, []);

    const handleChange = (id: string, value: string) => {
        setPixelValues((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (pixelId: string) => {
        const pixelCode = pixelValues[pixelId];
        if (!pixelCode) return toast.error("Please enter pixel code");
        try {
            setLoading(true);

            if (assignedPixelIds.includes(pixelId)) {
                // Update
                await axiosClient.put(`/api/ShopPixel/Update/${shopId}/${pixelId}`, { pixelCode });
                toast.success(lang === 'ar' ? "تم التعديل بنجاح" : "Updated successfully");

            } else {
                // Create
                await axiosClient.post("api/ShopPixel/AssignPixelToShop", {
                    pixelCode,
                    pixelId,
                    shopId,
                });
                toast.success(lang === 'ar' ? "تم الانشاء بنجاح" : "Created successfully");
                setPixelValues((prev) => ({
                    ...prev,
                    [pixelId]: pixelCode, // ← يحدث القيمة داخل الحالة
                }));
                setAssignedPixelIds((prev) => [...prev, pixelId]);
            }

        } catch (err) {
            console.error(err);
            toast.error("Failed to save pixel");
        } finally {
            setLoading(false);
        }
    };

    const getShopPixelValues = async () => {
        try {
            const res = await axiosClient.get(`/api/ShopPixel/GetPixelsByShopId/${shopId}`);
            const pixelData = res.data;

            const mappedValues: { [id: string]: string } = {};
            const ids: string[] = [];

            pixelData.forEach((item: { id: string; pixelCode: string }) => {
                mappedValues[item.id] = item.pixelCode;
                ids.push(item.id);
            });

            setPixelValues(mappedValues);
            setAssignedPixelIds(ids); // ← هنا بنخزن الـ IDs اللي متسجلة
        } catch (error) {
            console.error("Failed to load shop pixel values:", error);
        }
    };


    useEffect(() => {
        getPixels();
        getShopPixelValues();
    }, []);

    const pixelLabels: {
        [key: string]: {
            en: string;
            ar: string;
            placeholder?: string;
            howToGetEn?: string;
            howToGetAr?: string;
        };
    } = {
        "Meta Pixel ID": {
            en: "Tracks user behavior such as page views, add to cart, and purchases on Facebook & Instagram.",
            ar: "بيتابع نشاط الزوار زي مشاهدة الصفحات، الإضافة للسلة، والشراء.",
            placeholder: "Ex: 123456789012345",
            howToGetEn: ` Go to Meta Events Manager\n Select/Create Pixel\n Open Settings\n Click "Install Manually"\n Copy Pixel ID.`,
            howToGetAr: ` ادخل على مدير الأحداث\n اختار أو أنشئ بيكسل جديد\n افتح الإعدادات\n اضغط على "تثبيت يدوي"\n انسخ Pixel ID.`,
        },
        "Meta Access Token": {
            en: "Enables server-side tracking via Meta Conversions API for more accurate attribution.",
            ar: "بيسمح بتتبع الأحداث من السيرفر (CAPI) لتقارير أدق، خاصة بعد قيود الخصوصية.",
            placeholder: "Ex: EAABsbCS1iHgBAKJZAZBZA9I7yVnBZCx...",
            howToGetEn: ` Open Meta Events Manager\n Scroll to "Conversions API" section\n Click "Generate Access Token"`,
            howToGetAr: ` افتح صفحة مدير الأحداث\n انزل لجزء "Conversions API"\n اضغط "Generate Access Token"`,
        },
        "TikTok Pixel ID": {
            en: "Captures key e-commerce events like product views, cart, and purchase for TikTok ad tracking.",
            ar: "يتتبع مشاهدة المنتجات، الإضافة للسلة، والشراء لتحسين استهداف إعلانات تيك توك.",
            placeholder: "Ex: CN2A0H8JK0XXXXXXXX",
            howToGetEn: ` Go to TikTok Ads Manager\n Click "Assets > Events"\n Select "Web Events"\n Choose "Manual Setup"\n Copy Pixel ID.`,
            howToGetAr: ` ادخل على TikTok Ads Manager\n اختار "Events"\n اختار "Web Events"\n حدد "إعداد يدوي"\n انسخ Pixel ID.`,
        },
        "TikTok Access Token": {
            en: "Used to send server-side events to TikTok via the Events API.",
            ar: "بيستخدم لإرسال الأحداث من السيرفر مباشرةً لـ TikTok.",
            placeholder: "Ex: ttp-access-token-prod_abc123xyz456",
            howToGetEn: ` Go to your Web Event\n Open Settings\n Go to "Events API"\n Click "Generate Token"`,
            howToGetAr: ` افتح إعدادات البيكسل\n روح لجزء "Events API"\n اضغط "Generate Access Token"`,
        },
        "Google Ads Conversion ID": {
            en: "Tracks conversion actions like purchases for Google Ads optimization and bidding.",
            ar: "يتتبع الشراء وغيره من التحويلات في Google Ads لتحسين الأداء.",
            placeholder: "Ex: AW-9876543210",
            howToGetEn: ` Open Google Ads\n Go to "Tools & Settings"\n Click "Conversions"\n Create or select an action\n Copy the Conversion ID`,
            howToGetAr: ` افتح Google Ads\n ادخل على "الإعدادات والأدوات"\n اختار "التحويلات"\n أنشئ أو اختار إجراء تحويل\n انسخ Conversion ID`,
        },
        "Google Ads Conversion Label": {
            en: "Identifies specific conversion type (purchase, lead, etc.) within your Google Ads account.",
            ar: "يعرف نوع التحويل اللي بيتتبع (شراء، تسجيل، الخ).",
            placeholder: "Ex: abcDEFghijk123LMN",
            howToGetEn: ` Follow same steps as Conversion ID\n Conversion Label appears next to the ID during tag setup`,
            howToGetAr: ` نفس خطوات الحصول على Conversion ID\n Conversion Label بيظهر بجانبه أثناء إعداد الوسم`,
        },
        "GA4 Measurement ID": {
            en: "Tracks site behavior and sends event data to Google Analytics ",
            ar: "يرسل بيانات الأحداث وتحركات الزوار إلى Google Analytics ",
            placeholder: "Ex: G-ABC123XYZ4",
            howToGetEn: ` Go to Google Analytics\n Open "Admin"\n Select "Data Streams > Web"\n Copy the Measurement ID`,
            howToGetAr: ` افتح Google Analytics\n اختار "الإعدادات"\n ادخل على "تدفق البيانات > Web"\n انسخ Measurement ID`,
        },
        "GA4 API Secret": {
            en: "Used for sending server-side events to GA4 via Measurement Protocol.",
            ar: "مطلوب لإرسال الأحداث من السيرفر مباشرة إلى GA",
            placeholder: "Ex: W9d82kHsjr0LmT6xYpZ",
            howToGetEn: ` Go to same page as Measurement ID\n Scroll to "Measurement Protocol API"\n Click "Create Secret"`,
            howToGetAr: ` من نفس صفحة Measurement ID\n انزل لجزء "Measurement Protocol API"\n اضغط "Create API Secret"`,
        },
        "Snap Pixel ID": {
            en: "Tracks user actions like purchases and cart additions for Snapchat ad analytics.",
            ar: "يتتبع سلوك الزوار بعد الضغط على إعلان سناب مثل الشراء والإضافة للسلة.",
            placeholder: "Ex: abc-456def-789ghi",
            howToGetEn: ` Go to Snapchat Ads Manager\n Open Events Manager\n Create or select a Pixel\n Choose "Install Manually"`,
            howToGetAr: ` افتح Snap Ads Manager\n ادخل على Events Manager\n اختار أو أنشئ Pixel\n اختار "تثبيت يدوي"`,
        },
        "Snap Access Token": {
            en: "Used with Snap Conversions API for server-side tracking.",
            ar: "بيستخدم لإرسال بيانات التحويل من السيرفر مباشرة.",
            placeholder: "Ex: Bearer eyJhbGciOiJIUzI1NiIsInR..",
            howToGetEn: ` Open Business Settings\n Go to API Tokens\n Click "Generate Token"`,
            howToGetAr: ` افتح إعدادات الحساب\n اختار API Tokens\n اضغط "Generate Token"`,
        },
        "Hotjar Site ID": {
            en: "Tracks user behavior (heatmaps, sessions), helps optimize UX—not ad conversions.",
            ar: "Hotjar بيراقب تحركات المستخدمين زي خرائط الحرارة وجلسات التصفح لتحسين تجربة الموقع، مش لتتبع الإعلانات.",
            placeholder: "Ex: 2948576",
            howToGetEn: ` Go to Hotjar Dashboard\n Select your site\n Open "Tracking Code"\n Copy the Site ID`,
            howToGetAr: ` ادخل على Hotjar Dashboard\n اختار الموقع\n افتح "Tracking Code"\n انسخ Site ID`,
        },
        "Google Tag Manager": {
            en: "Google Tag Manager allows you to manage all your tracking codes (Meta Pixel, TikTok, GA4, etc.) from a single interface — without editing your website’s code every time. It’s ideal for marketing teams and fast testing.",
            ar: "Google Tag Manager بيسمحلك تتحكم في كل أكواد التتبع (زي Meta و TikTok و GA4) من لوحة واحدة من غير ما تدخل كل مرة على كود الموقع. ممتاز للفرق التسويقية والاختبارات السريعة.",
            placeholder: "Ex: GTM-5THB123",
            howToGetEn: ` Go to Google Tag Manager\n Open your Workspace\n Copy the GTM ID from top right`,
            howToGetAr: ` افتح Google Tag Manager\n ادخل على مساحة العمل\n انسخ معرف GTM من الزاوية العلوية`,
        },
    };
    useEffect(() => {
        if (selectedPixel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedPixel]);

    const pixelImages: { [key: string]: any } = {
        "GA4 API Secret": googlean,
        "GA4 Measurement ID": googlean,
        "Google Ads Conversion ID": googleAds,
        "Google Ads Conversion Label": googleAds,
        "Hotjar Site ID": hotgar,
        "Meta Access Token": meta,
        "Meta Pixel ID": meta,
        "Snap Access Token": snapchat,
        "Snap Pixel ID": snapchat,
        "TikTok Access Token": tiktok,
        "TikTok Pixel ID": tiktok,
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1  md:grid-cols-2 3xl:grid-cols-3 gap-5">
                {pixels.map((pixel) => (
                    <div
                        key={pixel.id}
                        className="border bg-white rounded-lg p-5 flex items-start gap-5"
                    >
                        <Image
                            className="rounded-lg w-10 h-10"
                            src={pixelImages[pixel.name] || googleman}
                            alt={pixel.name}
                        />
                        <div className="w-full">
                            <h4 className="font-medium text-base leading-tight flex flex-col-reverse lg:flex-row justify-between gap-y-2">
                            
                                <div className="flex items-center gap-1">
                                    {pixel?.name}
                                    <FontAwesomeIcon
                                        icon={faCircleQuestion}
                                        className={`text-slate-600 cursor-pointer transition-transform ${lang === 'ar' ? 'scale-x-[-1]' : ''}`}
                                        onClick={() => setSelectedPixel(pixel.name)}
                                    />
                                </div>

                              
                                <div className={`${assignedPixelIds.includes(pixel.id) ? "bg-[#B9F9CF]" : "bg-[#fc9090]"} flex items-center gap-2 w-fit py-1 px-3 rounded-full`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${assignedPixelIds.includes(pixel.id) ? "bg-green-500" : "bg-red-500"}`} />
                                    <span className="text-sm font-medium">
                                        {assignedPixelIds.includes(pixel.id)
                                            ? (lang === 'ar' ? 'مفعل' : 'Activated')
                                            : (lang === 'ar' ? 'غير مفعل' : 'Deactivated')}
                                    </span>
                                </div>
                            </h4>

                            <p className="font-normal text-sm my-2">
                                {lang === 'en' ? pixelLabels[pixel.name]?.en : pixelLabels[pixel.name]?.ar}
                            </p>
                            <RoleExist PageRoles={['GetPixelsByShopId', 'PixelUpdate', 'AssignPixelToShop', 'DeassignPixelFromShop']}>
                                <div className="flex items-center gap-2">
                                    <div className="w-full">
                                        <CustomInput
                                            name={pixel.id}
                                            className="input-placeholder text-[16px]" inputClassName='text-[16px]'
                                            value={pixelValues[pixel.id] || ""}
                                            placeholder={pixelLabels[pixel.name]?.placeholder || ""}
                                            onChange={(e: any) =>
                                                handleChange(pixel.id, e.target.value)
                                            }
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSubmit(pixel.id)}
                                        className={`rounded-lg border hover:!border-gray-900 hover:text-gray-700 border-[#E3E3E3] ${assignedPixelIds.includes(pixel.id) ? "bg-transparent" : "bg-transparent"} p-2`}
                                    >
                                        {/* <FontAwesomeIcon
                                            icon={faFloppyDisk}
                                            className="text-white text-lg"
                                        /> */}
                                        <PencilIcon className="h-4 w-4 " />

                                    </button>

                                    <button
                                        type="button"
                                        className={`rounded-lg border  border-[#E3E3E3] ${assignedPixelIds.includes(pixel.id) ? "bg-transparent hover:!border-gray-900 hover:text-gray-700" : "bg-transparent cursor-not-allowed"} p-2`}
                                        onClick={() => {
                                            if (assignedPixelIds.includes(pixel.id)) {
                                                setSelectedPixelToDelete(pixel.id);
                                            }
                                        }}
                                        disabled={!assignedPixelIds.includes(pixel.id)}
                                    >
                                        <TrashIcon className="h-4 w-4 " />
                                    </button>

                                </div>
                            </RoleExist>
                        </div>
                    </div>
                ))}

            </div>
            {selectedPixelToDelete && (
                <div
                    className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center px-4 sm:px-0"
                    onClick={() => setSelectedPixelToDelete(null)}
                >
                    <div
                        className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6 sm:p-7 text-center animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <Image
                            src={delete1}
                            alt="delete"
                            className="w-12 h-12 mx-auto mb-3"
                        />

              
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                            {lang === "ar" ? "هل أنت متأكد من حذف هذا العنصر؟" : "Are you sure you want to delete this item?"}
                        </h2>

                
                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={async () => {
                                    try {
                                        await axiosClient.delete(`/api/ShopPixel/DeassignPixelFromShop/${shopId}/${selectedPixelToDelete}`);
                                        toast.success(lang === 'ar' ? "تم الحذف بنجاح" : "Deleted successfully");

                                        setPixelValues(prev => {
                                            const updated = { ...prev };
                                            delete updated[selectedPixelToDelete];
                                            return updated;
                                        });

                                        setAssignedPixelIds(prev => prev.filter(id => id !== selectedPixelToDelete));
                                    } catch (err) {
                                        toast.error(lang === 'ar' ? "فشل في الحذف" : "Failed to delete");
                                        console.error(err);
                                    } finally {
                                        setSelectedPixelToDelete(null);
                                    }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-md"
                            >
                                {lang === "ar" ? "نعم" : "Yes"}
                            </button>

                            <button
                                onClick={() => setSelectedPixelToDelete(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-md"
                            >
                                {lang === "ar" ? "إلغاء" : "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {selectedPixel && (
                <div
                    className="fixed inset-0 z-[10000] bg-black/40 flex items-center justify-center px-4 sm:px-0"
                    onClick={() => setSelectedPixel(null)}
                >
                    <div
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg px-6 sm:px-8 py-4 sm:py-5 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedPixel(null)}
                            className="absolute top-4 end-4 text-gray-400 hover:text-black transition"
                            aria-label="Close"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-xl" />
                        </button>

                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                            {selectedPixel}
                        </h2>

                        <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed">
                            {lang === "en"
                                ? pixelLabels[selectedPixel]?.en
                                : pixelLabels[selectedPixel]?.ar}
                        </p>

                        <h4 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
                            {lang === "en" ? "How to Get" : "طريقة الحصول"}
                        </h4>

                        <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-700 mb-4">
                            {(lang === "en"
                                ? pixelLabels[selectedPixel]?.howToGetEn
                                : pixelLabels[selectedPixel]?.howToGetAr
                            )
                                ?.split("\n")
                                .map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                        </ol>

                        {pixelLabels[selectedPixel]?.placeholder && (
                            <div className="text-xs text-gray-500 mt-3 border-t pt-3">
                                <strong className="text-gray-600">
                                </strong>{" "}
                                {pixelLabels[selectedPixel].placeholder}
                            </div>
                        )}
                    </div>
                </div>
            )}



        </form>
    );
}
