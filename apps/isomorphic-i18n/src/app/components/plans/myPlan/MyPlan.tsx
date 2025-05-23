'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client';
import masterCard from '@public/assets/mastercard.svg'
import Image from 'next/image';
import { faBasketShopping, faChartLine, faCheck, faCircleCheck, faCoins, faCrown, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosClient from '../../context/api';
import { GeoLocationResult } from '@/types';
import ScheduleOfPlans from '../../ui/scheduleOfPlans/ScheduleOfPlans';
import SubscriptionTable from '../../SubscriptionTable';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import whatsapp from '@public/assets/whatsapp-color-svgrepo-com.svg'
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'
import sarIconWhite from '@public/assets/Saudi_Riyal_Symbol-white.svg.png'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Progressbar } from 'rizzui';

type wallet = {
    icon: any;
    name: string;
    price: string | number;
    currency: string;
    color: any
}
type deductedBalance = {
    balanceDeductedForVisites: number,
    balanceDeductedForOrders: number,
    balanceDeductedForWhatsapp: number,
    balance: number,
    currencyName: number,
    currencyAbbreviation: string,
}

type SellerPlanSubscription = {
    id: string;
    planId: string;
    planName: string;
    nextPlanName: string;
    nextPlanId: string;
    sellerId: string;
    nextPlanMonthlyPriceInEgp: string;
    nextPlanMonthlyPrice: string;
    startDate: string;
    endDate: string;
    cancelledAt: string;
    createdAt: string;
    autoRenewal: boolean;
    price: number;
    currency: 0 | 1 | 2 | 3;
    subscriptionStatus: number;
    paymentStatus: number;
};
type RechargePackage = {
    id: string;
    nameAr: string;
    nameEn: string;
    egyptionAmount: number;
    dollarAmount: number;
    ryialAmount: number;
};

function MyPlan({ lang }: { lang: string }) {
    const { t } = useTranslation(lang!, "pricing1");
    const [loading, setLoading] = useState(false);
    const [activePlan, setActivePlan] = useState<SellerPlanSubscription>();
    const [bulk, setBulk] = useState([]);
    const [plan, setPlan] = useState<string>('');
    const [SubscriptionWallet, setSubscriptionWallet] = useState<deductedBalance>();
    const [location, setLocation] = useState<GeoLocationResult | null>(null);
    const [currency, setCurrency] = useState<string>('');
    const router = useRouter();
    const sellerId = localStorage.getItem('sellerId')
    const totalBalance =
        (SubscriptionWallet?.balanceDeductedForVisites || 0) +
        (SubscriptionWallet?.balanceDeductedForOrders || 0) +
        (SubscriptionWallet?.balanceDeductedForWhatsapp || 0) +
        (SubscriptionWallet?.balance || 0);

    const WalletArr = SubscriptionWallet ? [
        {
            icon: <FontAwesomeIcon icon={faWallet} className='w-5 h-5' />,
            name: lang === 'ar' ? 'الرصيد الحالي' : 'Current Balance',
            price: SubscriptionWallet.balance || 0,
            currency: SubscriptionWallet.currencyAbbreviation,
            color: 'text-[#E84654]',
        }, {
            icon: <FontAwesomeIcon icon={faChartLine} className='w-5 h-5' />,
            name: lang === 'ar' ? 'المستهلك من المشاهدات' : 'Views Deducted',
            price: SubscriptionWallet.balanceDeductedForVisites || 0,
            currency: SubscriptionWallet.currencyAbbreviation,
            color: 'text-[#FFC107]',
            percentage: totalBalance
                ? ((SubscriptionWallet.balanceDeductedForVisites / totalBalance) * 100).toFixed(2)
                : 0,
        },
        {
            icon: <FontAwesomeIcon icon={faBasketShopping} className='w-5 h-5' />,
            name: lang === 'ar' ? 'المستهلك من الطلبات' : 'Orders Deducted',
            price: SubscriptionWallet.balanceDeductedForOrders || 0,
            currency: SubscriptionWallet.currencyAbbreviation,
            color: 'text-[#2196F3]',
            percentage: totalBalance
                ? ((SubscriptionWallet.balanceDeductedForOrders / totalBalance) * 100).toFixed(2)
                : 0,
        },
        {
            icon: <FontAwesomeIcon icon={faWhatsapp} className='w-5 h-5' />,
            name: lang === 'ar' ? 'المستهلك من الواتساب' : 'WhatsApp Deducted',
            price: SubscriptionWallet.balanceDeductedForWhatsapp || 0,
            currency: SubscriptionWallet.currencyAbbreviation,
            color: 'text-[#4CAF50]',
            percentage: totalBalance
                ? ((SubscriptionWallet.balanceDeductedForWhatsapp / totalBalance) * 100).toFixed(2)
                : 0,
        },

    ] : [];

    const currencyLabels: Record<number, { ar: string; en: string }> = {
        0: { ar: 'دولار', en: 'USD' },
        1: { ar: 'جنيه', en: 'EGP' },
        2: { ar: 'ريال', en: 'SAR' },
    };
    useEffect(() => {
        console.log("🚨 مسح الفاتورة عند مغادرة الصفحة");
        localStorage.removeItem("invoiceNumber");

    }, []);
    const fetchActivePlan = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`/api/SellerPlanSubscription/GetSellerPlanActiveSubscription/${sellerId}`, {
                headers: {
                    "Accept-Language": lang,
                },
            });
            if (response.data) {
                setActivePlan(response.data);
                setPlan(response.data.planName);
            } else {
                console.warn('No active plans found');
            }
        } catch (error) {
            console.error('Error fetching active plan:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchBulk = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('api/Bulk/GetAllBulk');
            setBulk(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchSubscriptionWallet = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(`api/SubscriptionWallet/GetSellerSubscriptionWallet/${sellerId}`, {
                headers: {
                    "Accept-Language": lang,
                },
            });

            // تحويل الرقم إلى نص باستخدام currencyLabels

            setSubscriptionWallet(response.data);
            setCurrency(response.data.currencyAbbreviation);
        } catch (error) {
            console.error('Error fetching subscription wallet:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchActivePlan();
        fetchBulk();
        fetchSubscriptionWallet();
    }, []);
    const getAmountWithCurrency = (
        amount: RechargePackage,
        currency: string,
        lang: string
    ): { amountValue: number; currencyName: string } => {
        let amountValue = 0;
        let currencyName = '';

        switch (currency) {
            case 'US Dollar':
            case 'دولار امريكي':
            case 'USD':
            case 'دولار':
                amountValue = amount.dollarAmount;
                currencyName = lang === 'ar' ? 'دولار' : 'USD';
                break;

            case 'ج.م':
            case 'EGP':
                amountValue = amount.egyptionAmount;
                currencyName = lang === 'ar' ? 'ج.م' : 'EGP';
                break;

            case 'SAR':
            case 'ر.س':
            case 'ريال':
                amountValue = amount.ryialAmount;
                currencyName = lang === 'ar' ? 'ريال' : 'SAR';
                break;

            default:
                amountValue = amount.dollarAmount;
                currencyName = lang === 'ar' ? 'دولار' : 'USD';
                break;
        }

        return {
            amountValue,
            currencyName,
        };
    };
    const Progressbar = ({ value, lang }: { value: number; lang: string }) => {
        return (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{
                        width: `${value}%`,
                        transformOrigin: lang === 'ar' ? 'right' : 'left',
                        direction: lang === 'ar' ? 'rtl' : 'ltr',
                    }}
                />
            </div>
        );
    };
    const handleRecharge = async (amountValue: string, bulkId: string, egyptionAmount: number) => {
        try {
            const rechargeData = {
                amountValue: amountValue,
                egyptionAmount: egyptionAmount
            };
            localStorage.setItem('rechargeInfo', JSON.stringify(rechargeData));
            const response = await axiosClient.post('/api/SubscriptionWalletRecharge/Create', {
                sellerId: sellerId,
                bulkId: bulkId
            }, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                toast.success(lang === 'ar' ? 'جاري التحويل للدفع...' : 'Redirecting to payment page...');
                localStorage.setItem("rechargeId", response.data);
                localStorage.removeItem("SubscriptionId");
                localStorage.removeItem("updateSubscriptionId");
                router.push('/pay');
            } else {
                toast.error('فشلت عملية الشحن. حاول مرة أخرى.');
            }
        } catch (error) {
            console.error('Error during recharge:', error);
            toast.error('حدث خطأ أثناء الشحن.');
        }
    };
    const upgrade = async () => {
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            const payload = {
                createSellerPlanSubscriptionDto: {
                    planId: activePlan?.nextPlanId,
                    sellerId: sellerId,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    price: activePlan?.nextPlanMonthlyPrice || 0,
                    currency: activePlan?.currency || 0
                }
            };
            const response = await axiosClient.put(`/api/SellerPlanSubscription/SwitchSellerPlanSubscribetion${activePlan?.id}/${activePlan?.nextPlanId}`,
                payload, {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                toast.success(lang === 'ar' ? 'جاري التحويل للدفع...' : 'Redirecting to payment page...');
                localStorage.setItem("SubscriptionId", response.data);
                localStorage.removeItem("rechargeId");
                localStorage.removeItem("updateSubscriptionId");
                router.push('/pay');
            } else {
                toast.error('فشلت عملية الشحن. حاول مرة أخرى.');
            }
        } catch (error) {
            console.error('Error during recharge:', error);
            toast.error('حدث خطأ أثناء الترقية.');
        }
    };
    const update = async () => {
        try {

            const response = await axiosClient.put(`/api/SellerPlanSubscription/RenewSellerPlanSubscription/renew/${sellerId}`,
                {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'application/json'
                    }
                });
            if (response.status === 200) {
                toast.success(lang === 'ar' ? 'جاري التحويل للدفع...' : 'Redirecting to payment page...');
                localStorage.setItem("updateSubscriptionId", response.data);
                localStorage.setItem("oldSubscriptionId", activePlan?.id as string);
                localStorage.removeItem("rechargeId");
                localStorage.removeItem("SubscriptionId");
                router.push('/pay');
            } else {
                toast.error('فشلت عملية التجديد. حاول مرة أخرى.');
            }
        } catch (error) {
            console.error('Error during recharge:', error);
            toast.error('حدث خطأ أثناء الترقية.');
        }
    };
    return <>
        <div className="grid sm:grid-cols-2 gap-10">
            {activePlan && (
                <>
                    <div className={` ${(activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan') ? 'bg-gradient-to-br  hover:-translate-y-1 duration-200 from-red-100 to-white border border-red-400 border-opacity-30 shadow-sm rounded-xl p-6 dashboard-card relative overflow-hidden' : 'bg-white shadow-md rounded-xl p-6 hover:-translate-y-1 duration-200'}`}>
                        <div className="mb-3">
                            <div className="flex justify-between items-start">

                                <p className='text-sm font-medium text-gray-500'>
                                    {t('SUBSCRIPTION')}
                                </p>
                                {(activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan') ?
                                    <FontAwesomeIcon icon={faCrown} className='text-red-600 text-xl' />
                                    :
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <FontAwesomeIcon icon={faCircleCheck} className='text-red-600 text-lg' />
                                    </div>
                                }
                            </div>
                            <h4 className='font-semibold text-xl'>
                                {activePlan.planName}
                            </h4>
                            <p className='flex items-center gap-1'>
                                <span className='text-2xl font-bold text-red-600'>
                                    {activePlan.price}
                                </span>
                                /
                                {activePlan.currency === 2 && lang === 'ar' ? (
                                    <Image src={sarIcon} alt="SAR" width={30} height={30} />
                                ) : (
                                    <span className='text-gray-600 font-normal text-base'>
                                        {currencyLabels[activePlan.currency]?.[lang === 'ar' ? 'ar' : 'en']}
                                    </span>
                                )}

                            </p>
                        </div>
                        {(activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan') ?
                            <p className='font-normal text-[#5C5C5C] text-sm'>
                                {t('renewTime')}{" "}
                                {new Date(activePlan.endDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            :
                            ''}
                        {(activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan') ?
                            <>
                                <ul className="mb-4 mt-3 text-sm text-gray-700 space-y-1.5  ">
                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar' ? 'عدد الطلبات غير محدود' : 'Orders Unlimited'}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar' ? 'أدوات تسويق عبر الواتساب غير محدود' : 'Whatsapp Marketing Tools Unlimited'}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar' ? 'عدد الزيارات غير محدود' : '  Visits Unlimited '}
                                    </li>
                                </ul>

                     
                                <button onClick={
                                    () => update()
                                } className='action-button  hover:-translate-y-1 duration-200 mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'>
                                    {lang === 'ar' ? 'تجديد' : 'Renewal'}
                                </button>
                            </>
                            :
                            (activePlan?.planName === 'خطة التوفير' || activePlan?.planName === 'Saving Plan') ?
                                <ul className="mb-4 mt-3 text-sm text-gray-700 space-y-1.5  ">
                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar'
                                            ? `عدد الطلبات ${activePlan?.currency === 1
                                                ? '٥٠ قرش / طلب'
                                                : activePlan?.currency === 2
                                                    ? '10 هللة / طلب'
                                                    : '0.02 دولار / طلب'}`
                                            : `Orders ${activePlan?.currency === 1
                                                ? '50pt per order'
                                                : activePlan?.currency === 2
                                                    ? '10 halala per order'
                                                    : 'USD 0.02 per order'}`}
                                    </li>

                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar'
                                            ? `أدوات تسويق عبر الواتساب ${activePlan?.currency === 1
                                                ? '٥ قروش / رسالة'
                                                : activePlan?.currency === 2
                                                    ? '1 هللة / رسالة'
                                                    : '0.002 دولار / رسالة'}`
                                            : `Whatsapp Marketing Tools ${activePlan?.currency === 1
                                                ? '5pt per message'
                                                : activePlan?.currency === 2
                                                    ? '1 halala per message'
                                                    : 'USD 0.002 per message'}`}
                                    </li>

                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar'
                                            ? `عدد الزيارات ${activePlan?.currency === 1
                                                ? '5 قروش / زيارة'
                                                : activePlan?.currency === 2
                                                    ? 'ربع هللة / زيارة'
                                                    : '0.0004 دولار / زيارة'}`
                                            : `Visits ${activePlan?.currency === 1
                                                ? '5pt per visit'
                                                : activePlan?.currency === 2
                                                    ? '0.25 halala per visit'
                                                    : 'USD 0.0004 per visit'}`}
                                    </li>

                                </ul>
                                : <ul className="mb-4 mt-3 text-sm text-gray-700 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar' ? 'عدد الطلبات محدود' : 'Orders Limited'}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar' ? 'أدوات التسويق عبر واتساب محدود' : 'WhatsApp Marketing Tools Limited'}
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                        {lang === 'ar' ? 'عدد الزيارات محدود' : 'Visits Count Limited'}
                                    </li>
                                </ul>
                        }
                    </div>
                    {activePlan.nextPlanName && (
                        <div className="bg-gradient-to-br  hover:-translate-y-1 duration-200 from-red-100 to-white border border-red-400 border-opacity-30 shadow-sm rounded-xl p-6 dashboard-card relative overflow-hidden ">
                            <div className="absolute top-0 left-0  bg-red-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">{lang === 'ar' ? 'موصي به' : 'Recommended'}</div>
                            <div className="mb-3 mt-1">
                                <div className="flex items-start justify-between">

                                    <p className='text-sm font-medium text-red-600'>
                                        {lang === 'ar' ? 'الخطة التالية' : 'Next Plan'}
                                    </p>
                                    <div className="">
                                        <FontAwesomeIcon icon={faCrown} className='text-red-600 text-xl' />
                                    </div>
                                </div>
                                <h4 className='font-semibold text-xl'>
                                    {activePlan.nextPlanName || 'N/A'}
                                </h4>
                                <p className='flex items-center gap-1'>
                                    <span className='text-2xl font-bold text-red-600'>
                                        {activePlan.nextPlanMonthlyPrice}
                                    </span>
                                    /
                                    {activePlan.currency === 2 && lang === 'ar' ? (
                                        <Image src={sarIcon} alt="SAR" width={30} height={30} />
                                    ) : (
                                        <span className='text-gray-600 font-normal text-base'>
                                            {currencyLabels[activePlan.currency]?.[lang === 'ar' ? 'ar' : 'en']}
                                        </span>
                                    )}

                                </p>
                            </div>
                            {/* <p className='font-normal text-[#5C5C5C] text-sm'>
                                    {t('nextPlanPriceEgp')}{" "}
                                    {activePlan.nextPlanMonthlyPriceInEgp || '???'} {lang === 'ar' ? 'جنيه' : 'EGP'}
                                </p> */}
                            {(activePlan?.nextPlanName === 'خطة مميزة' || activePlan?.nextPlanName === 'VIP Plan') ?
                                <>
                                    <ul className="mb-4 mt-3 text-sm text-gray-700 space-y-1.5  ">
                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar' ? 'عدد الطلبات غير محدود' : 'Orders Unlimited'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar' ? 'أدوات تسويق عبر الواتساب غير محدود' : 'Whatsapp Marketing Tools Unlimited'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar' ? 'عدد الزيارات غير محدود' : '  Visits Unlimited '}
                                        </li>
                                    </ul>
                                </>
                                :
                                (activePlan?.nextPlanName === 'خطة التوفير' || activePlan?.nextPlanName === 'Saving Plan') ?
                                    <ul className="mb-4 mt-3 text-sm text-gray-700 space-y-1.5  ">
                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar'
                                                ? `عدد الطلبات ${activePlan?.currency === 1
                                                    ? '٥٠ قرش / طلب'
                                                    : activePlan?.currency === 2
                                                        ? '10 هللة / طلب'
                                                        : '0.02 دولار / طلب'}`
                                                : `Orders ${activePlan?.currency === 1
                                                    ? '50pt per order'
                                                    : activePlan?.currency === 2
                                                        ? '10 halala per order'
                                                        : 'USD 0.02 per order'}`}
                                        </li>

                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar'
                                                ? `أدوات تسويق عبر الواتساب ${activePlan?.currency === 1
                                                    ? '٥ قروش / رسالة'
                                                    : activePlan?.currency === 2
                                                        ? '1 هللة / رسالة'
                                                        : '0.002 دولار / رسالة'}`
                                                : `Whatsapp Marketing Tools ${activePlan?.currency === 1
                                                    ? '5pt per message'
                                                    : activePlan?.currency === 2
                                                        ? '1 halala per message'
                                                        : 'USD 0.002 per message'}`}
                                        </li>

                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar'
                                                ? `عدد الزيارات ${activePlan?.currency === 1
                                                    ? '5 قروش / زيارة'
                                                    : activePlan?.currency === 2
                                                        ? 'ربع هللة / زيارة'
                                                        : '0.0004 دولار / زيارة'}`
                                                : `Visits ${activePlan?.currency === 1
                                                    ? '5pt per visit'
                                                    : activePlan?.currency === 2
                                                        ? '0.25 halala per visit'
                                                        : 'USD 0.0004 per visit'}`}
                                        </li>

                                    </ul>
                                    : <ul className="mb-4 text-sm text-gray-700 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar' ? 'عدد الطلبات محدود' : 'Orders Limited'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar' ? 'أدوات التسويق عبر واتساب محدود' : 'WhatsApp Marketing Tools Limited'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faCheck} className="text-red-500" />
                                            {lang === 'ar' ? 'عدد الزيارات محدود' : 'Visits Count Limited'}
                                        </li>
                                    </ul>
                            }
                            <button onClick={
                                () => upgrade()
                            } className='action-button  hover:-translate-y-1 duration-200 mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'>
                                {lang === 'ar' ? 'ترقية' : 'Upgrade'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
        <div className={` ${activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan' ? '' : ' pb-3  mt-8'}`}>
            {
                (activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan') ? ''
                    :
                    <>
                        <h3 className='text-2xl py-3'>{lang === 'ar' ? 'المحفظة' : 'Wallet'}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 ">
                            {WalletArr.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={` ${idx === 0 ? 'bg-redColor' : 'bg-white'} shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-w-[220px] p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.color}`}
                                >
                                    <div className="flex justify-between w-full">
                                        <div className="text-start">
                                            <p className={`${idx === 0 ? 'text-white' : 'text-gray-500'}`}>{item.name}</p>
                                            <h3 className={`text-2xl font-bold mt-2 flex items-center gap-1 ${idx === 0 ? 'text-white' : 'text-gray-900 '}`}>
                                                {item.price} <span className={`text-2xl   ${idx === 0 ? 'text-white' : 'text-gray-900 '}`}>{item.currency === 'ر.س' ? idx === 0 ? <Image src={sarIconWhite} alt="SAR" width={18} height={18} /> : <Image src={sarIcon} alt="SAR" width={18} height={18} /> : item.currency}</span>
                                            </h3>
                                        </div>
                                        <span className={`w-12 h-12 flex items-center justify-center mb-5 rounded-full ${idx === 0 ? 'icon-container bg-white bg-opacity-20 text-white' : 'bg-[#FDECED] text-redColor'}`}>
                                            {item.icon}
                                        </span>
                                    </div>
                                    {idx === 0 ? '' :
                                        <>
                                            <Progressbar lang={lang} value={item.percentage as any} />
                                            <p className={`text-sm ${idx === 0 ? "text-white" : "text-gray-500"} mt-2 text-start`}>
                                                {item.percentage as any}% {lang === 'ar' ? 'من الميزانية المخصصة' : 'of allocated budget'}
                                            </p>
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
                    </>
            }
            {(
                (activePlan?.planName === 'الخطة التجريبية' || activePlan?.planName === 'Trial Plan') ||
                (activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan')
            ) ?
                '' :
                <>
                    <div className="bg-white flex sm:flex-row flex-col gap-5 sm:justify-between w-full sm:items-center p-8 rounded-xl mt-10 mb-10">
                        <div className="flex items-start gap-2 ">
                            <div className="bg-red-100 p-2 rounded-lg">
                                <FontAwesomeIcon icon={faCoins} className='text-red-600 text-lg' />
                            </div>
                            <div className="">
                                <h3 className='text-lg '>{lang === 'ar' ? 'شحن الرصيد' : 'Balance recharge'}</h3>
                                <p className='text-base text-gray-600 '>{lang === 'ar' ? 'قم بشحن رصيدك للاستمرار باستخدام الخدمات' : 'Top up your balance to continue using the services'}</p>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 ">
                            {bulk.map((amount: RechargePackage, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-red-200 rounded-lg p-4 text-center hover:bg-red-50 transition-all cursor-pointer"                            >
                                    <div className="text-2xl font-bold text-gray-800 mb-3">
                                        <div className="text-2xl font-bold text-gray-800 mb-3 flex justify-center items-center gap-2">
                                            {getAmountWithCurrency(amount, currency, lang).amountValue}{" "}
                                            <span className="text-lg text-gray-800">{currency?.toUpperCase?.() === 'ر.س' ?
                                                <Image src={sarIcon} alt="SAR" width={18} height={18} />
                                                : currency?.toUpperCase?.()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const { amountValue, currencyName } = getAmountWithCurrency(amount, currency, lang);
                                            handleRecharge(amountValue as any, amount.id, amount.egyptionAmount);
                                            if (amountValue !== undefined && currencyName !== undefined) {
                                                localStorage.setItem('rechargeAmount', amountValue.toString());
                                                localStorage.setItem('currencyName', currencyName);
                                            }
                                        }}
                                        className="bg-[#fce5e7] text-[#E84654] px-5 py-2 rounded-lg text-sm font-semibold transition hover:bg-[#E84654] hover:text-white"
                                    >
                                        {lang === 'ar' ? 'شحن الآن' : 'Recharge Now'}
                                    </button>
                                    <div className="absolute top-0 right-0 h-1 w-full bg-[#E84654] scale-x-0 hover:scale-x-100 origin-right transition-transform duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            }
        </div>
        <SubscriptionTable lang={lang} />
        <ScheduleOfPlans lang={lang} plan={plan} ActivePlan={activePlan} />
    </>
}

export default MyPlan