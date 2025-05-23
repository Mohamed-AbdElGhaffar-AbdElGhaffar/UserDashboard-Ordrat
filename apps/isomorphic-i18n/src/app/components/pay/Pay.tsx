'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import nbeLogo from '@public/assets/NBE-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

declare global {
    interface Window {
        errorCallback: (error: any) => void;
        cancelCallback: () => void;
        completeCallback: (resultIndicator: string) => void;
    }

    const Checkout: any;
}

export default function Pay({ lang }: { lang: string }) {
    const [message, setMessage] = useState(lang === 'ar' ? 'جاري تحميل بوابة الدفع...' : 'Loading payment gateway...');
    const [messageType, setMessageType] = useState<'loading' | 'success' | 'error'>('loading');
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [priceOnly, setPriceOnly] = useState<string | null>(null);
    const [currency, setcurrency] = useState<string | null>(null);
    const [priceInEGP, setPriceInEGP] = useState<string | null>(null);
    const [invoice, setInvoice] = useState<string | null>(null);
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);
    useEffect(() => {

        const rechargeInfoString = localStorage.getItem("rechargeInfo");
        const subscriptionId = localStorage.getItem("SubscriptionId");
        const updateSubscriptionId = localStorage.getItem("updateSubscriptionId");
        const currencyName = localStorage.getItem("currencyName");

        if (rechargeInfoString) {
            try {
                const rechargeInfo = JSON.parse(rechargeInfoString);
                const price = rechargeInfo.amountValue;
                const egp = rechargeInfo.egyptionAmount;

                setcurrency(currencyName);
                setPriceOnly(String(price));
                setPriceInEGP(String(egp));
                setSelectedPlan(String(egp));
                console.log("✅ بيانات الشحن من rechargeInfo:", rechargeInfo);
            } catch (e) {
                console.warn("⚠️ rechargeInfo موجود لكن غير قابل للقراءة.");
            }
        } else if (subscriptionId) {
            // fallback لو مفيش rechargeInfo بس في SubscriptionId
            setSelectedPlan("0");
            setPriceOnly("0");
            setPriceInEGP("0");
            console.log("ℹ️ استخدام SubscriptionId فقط بدون بيانات شحن.");
        } else if (updateSubscriptionId) {
            setSelectedPlan("0");
            setPriceOnly("0");
            setPriceInEGP("0");
            console.log("ℹ️ استخدام SubscriptionId فقط بدون بيانات شحن.");
        } else {
            console.error("❌ لم يتم العثور على معلومات الشحن أو اشتراك.");
        }
    }, []);

    useEffect(() => {
        if (selectedPlan !== null && !redirecting) {
            window.errorCallback = (error) => {
                console.error("❌ Checkout Error:", error);
                setMessage("حدث خطأ أثناء الدفع. حاول مرة أخرى.");
                setMessageType("error");
                setLoading(false);
            };

            window.completeCallback = (resultIndicator) => {
                console.log("✅ الدفع تم بنجاح:", resultIndicator);
                setMessage("تم الدفع بنجاح!");
                setMessageType("success");
                setLoading(false);
                sessionStorage.removeItem("HostedCheckout_sessionId");
            };

            window.cancelCallback = () => {
                setMessage("تم إلغاء العملية.");
                setMessageType("error");
                setLoading(false);
                sessionStorage.removeItem("HostedCheckout_sessionId");
            };
            // const script = document.createElement("script");
            // script.src = "https://test-nbe.gateway.mastercard.com/static/checkout/checkout.min.js";
            // script.src = "https://nbe.gateway.mastercard.com/static/checkout/checkout.min.js";
            // script.setAttribute("data-error", "errorCallback");
            // script.setAttribute("data-cancel", "cancelCallback");
            // script.setAttribute("data-complete", "completeCallback");
            // script.onload = () => initiateCheckout();
            // document.body.appendChild(script);
            initiateCheckout();

        }
    }, [selectedPlan, redirecting]);

    const createInvoiceBeforeCheckout = async (): Promise<string | null> => {
        const existingInvoice = localStorage.getItem("invoiceNumber");
        if (existingInvoice) {
            console.log("🧾 الفاتورة موجودة بالفعل:", existingInvoice);
            return existingInvoice;
        }

        const rechargeId = localStorage.getItem("rechargeId")
        const subscriptionId = localStorage.getItem("SubscriptionId")
        const updateSubscriptionId = localStorage.getItem("updateSubscriptionId")
        const oldSubscriptionId = localStorage.getItem("oldSubscriptionId")



        const rechargeInfoString = localStorage.getItem("rechargeInfo");
        let rechargeInfo = null;
        try {
            if (rechargeInfoString && rechargeInfoString.startsWith("{")) {
                rechargeInfo = JSON.parse(rechargeInfoString);
            }
        } catch (e) {
            console.warn("⚠️ فشل في قراءة rechargeInfo");
        }

        if (!subscriptionId && !rechargeId && !updateSubscriptionId) {
            console.error("❌ لا توجد معلومات لإنشاء الفاتورة (لا SubscriptionId ولا rechargeId).");
            return null;
        }

        let url = "https://testapi.ordrat.com/api/Invoice/Create";

       if (updateSubscriptionId && oldSubscriptionId) {
  url += `?OldSellerPlanSubscriptionId=${oldSubscriptionId}&sellerPlanSubscriptionId=${updateSubscriptionId}&period=monthly&invoiceType=3`;
} else if (subscriptionId) {
  url += `?sellerPlanSubscriptionId=${subscriptionId}&period=monthly&invoiceType=1`;
} else if (rechargeId) {
  url += `?subscriptionWalletRechargeId=${rechargeId}&invoiceType=2`;
}

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        const invoiceNumber = data.id;
        localStorage.setItem("invoiceNumber", invoiceNumber);

        console.log("🧾 فاتورة تم إنشاؤها:", invoiceNumber);
        return invoiceNumber;
    };


    const initiateCheckout = async () => {
        try {
            sessionStorage.removeItem("HostedCheckout_sessionId");
            const invoiceNumber = await createInvoiceBeforeCheckout();
            if (!invoiceNumber as any) {
                setMessage(lang === 'ar' ? "فشل إنشاء الفاتورة." : "Failed to create invoice.");
                setMessageType("error");
                setLoading(false);
                return;
            }
            // const geoId = localStorage.getItem("sellerId") ?? "test";
            const res = await fetch(`https://testapi.ordrat.com/api/KashierPayment/initiate-checkout/${invoiceNumber}?redirectBaseUrl=${`http://localhost:3004/${lang}/plans/myPlan`}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const result = await res.json();
            // if (result.sessionId && typeof Checkout !== "undefined") {
            //     Checkout.configure({ session: { id: result.sessionId } });
            //     Checkout.showEmbeddedPage("#embed-target");
            //     setMessage(lang === 'ar' ? "بوابة الدفع جاهزة." : "Payment gateway is ready.");
            //     setMessageType("success");
            // } else {
            //     setMessage(lang === 'ar' ? "حدثت مشكلة أثناء إعداد بوابة الدفع." : "There was a problem while preparing the payment gateway.");
            //     setMessageType("error");
            // }

            if (result.paymentUrl) {
                console.log("🔁 Redirecting to payment URL:", result.paymentUrl);
                window.location.href = result.paymentUrl;
                return;
            } else {
                setMessage(lang === 'ar' ? "حدثت مشكلة أثناء إعداد بوابة الدفع." : "There was a problem while preparing the payment gateway.");
                setMessageType("error");
            }


            setLoading(false);
        } catch (err) {
            setMessage(lang === 'ar' ? `حدث خطأ غير متوقع.` : `An unexpected error occurred.`);
            setMessageType("error");
            setLoading(false);
        }
    };

    const renderStatusIcon = () => {
        switch (messageType) {
            case 'success':
                return <span>✅</span>;
            case 'error':
                return <span>❌</span>;
            default:
                return <span>⏳</span>;
        }
    };

    const getMessageStyle = () => {
        switch (messageType) {
            case "success":
                return "bg-green-100 text-green-700";
            case "error":
                return "bg-red-100 text-red-700";
            case "loading":
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    // ✅ في حالة التحويل بسبب السعر = 0
    if (redirecting) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin mb-4" />
                <p className="text-sm">{lang === 'ar' ? "جاري تحويلك إلى إعدادات المتجر..." : "Redirecting to seller settings..."}</p>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>بوابة الدفع | Ordrat</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>


            {/* <div className="max-w-xl mx-auto  pb-10 text-center font-elTajawal rounded-3xl bg-white p-5">
                <div className="flex justify-center mb-4">
                    <Image src={nbeLogo} alt="National Bank of Egypt" height={60} />
                </div>
                <p className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm sm:text-base font-medium mb-4 ${getMessageStyle()}`}>
                    {renderStatusIcon()}
                    {message}
                </p>
                {Number(priceOnly) !== Number(priceInEGP) && (
                    <div className="bg-blue-100 rounded-lg px-3 py-4 text-black font-medium flex items-center gap-2 text-sm sm:text-base">
                        <FontAwesomeIcon icon={faCircleExclamation} className="text-blue-400" />
                        <p>
                            {lang === 'ar'
                                ? `سيتم دفع مبلغ ${priceOnly} ${currency} بالجنية المصري بما يعادل مبلغ ${selectedPlan} ج.م`
                                : `An amount of ${priceOnly} ${currency} will be paid in Egyptian Pounds, equivalent to ${selectedPlan} EGP`}
                        </p>
                    </div>
                )}


                {loading && (
                    <div className="mt-6">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto" />
                    </div>
                )}

                {messageType === 'error' ? (
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition"
                    >
                        {lang === 'ar' ? 'تحديث الصفحه' : 'Refresh the page'}
                    </button>
                ) : (
                    <div id="embed-target" className="p-3 rounded-2xl" />
                )}
            </div> */}
        </>
    );
}
