'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client';
import masterCard from '@public/assets/mastercard.svg'
import Image from 'next/image';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosClient from '../../context/api';
import { GeoLocationResult } from '@/types';
import ScheduleOfPlans from '../../ui/scheduleOfPlans/ScheduleOfPlans';
import SubscriptionTable from '../../SubscriptionTable';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import whatsapp from '@public/assets/whatsapp-color-svgrepo-com.svg'
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

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

    const WalletArr = SubscriptionWallet ? [
        {
            icon: (
                <svg className="balance-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>

            ),
            name: lang === 'ar' ? 'الرصيد الحالي' : 'Current Balance',
            price: SubscriptionWallet.balance || 0,
            currency: SubscriptionWallet.currencyAbbreviation,
            color: 'text-[#4CAF50]',
        },
        {
            icon: (
                <svg className="balance-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            ),
            name: lang === 'ar' ? 'المستهلك من المشاهدات' : 'Views Deducted',
            price: SubscriptionWallet.balanceDeductedForVisites || 0,
            currency: SubscriptionWallet.currencyAbbreviation,
            color: 'text-[#FFC107]',
        },
        {
            icon: (
                <svg className="balance-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            ),
            name: lang === 'ar' ? 'المستهلك من الطلبات' : 'Orders Deducted',
            price: SubscriptionWallet.balanceDeductedForOrders || 0,
            currency: SubscriptionWallet.currencyAbbreviation,
            color: 'text-[#2196F3]',
        },
        {
            icon: <Image
                src={whatsapp}
                alt="WhatsApp"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
            />,
            name: lang === 'ar' ? 'المستهلك من الواتساب' : 'What\'\sApp Deducted',

            price: SubscriptionWallet.balanceDeductedForWhatsapp || 0,
            currency: SubscriptionWallet.currencyAbbreviation,
            color: 'text-[#4CAF50]',
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
                router.push('/pay');
            } else {
                toast.error('فشلت عملية الشحن. حاول مرة أخرى.');
            }
        } catch (error) {
            console.error('Error during recharge:', error);
            toast.error('حدث خطأ أثناء الترقية.');
        }
    };
    return <>
        <div className="">
            {/* <h1 className='text-2xl font-semibold mb-6'>{t('myPlan')}</h1> */}
            <div className="grid sm:grid-cols-2 gap-10">
                {activePlan && (
                    <>
                        <div className="bg-white shadow-md rounded-lg px-6 py-8">
                            <div className="mb-3">
                                <p className='text-lg text-redColor font-semibold'>
                                    {t('SUBSCRIPTION')}
                                </p>
                                <h4 className='font-semibold text-2xl'>
                                    {activePlan.planName}
                                </h4>
                                <h4 className='font-semibold text-2xl flex items-center gap-1'>
                                    {activePlan.price} /
                                    {activePlan.currency === 2 && lang === 'ar' ? (
                                    <Image src={sarIcon} alt="SAR" width={30} height={30} />
                                    ) : (
                                    currencyLabels[activePlan.currency]?.[lang === 'ar' ? 'ar' : 'en']
                                    )}
                
                                </h4>
                            </div>
                            <p className='font-normal text-[#5C5C5C] text-sm'>
                                {t('renewTime')}{" "}
                                {new Date(activePlan.endDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            {(activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan')?
                                <button onClick={
                                    () => upgrade()
                                } className='bg-redColor mt-2 text-white rounded-full w-32 py-3 font-medium'>
                                    {lang === 'ar' ? 'تجديد' : 'Renewal'}
                                </button>
                                :''
                            }
                        </div>
                        {activePlan.nextPlanName && (
                            <div className="bg-white shadow-md  rounded-lg px-6 py-8">
                                <div className="mb-3">
                                    <p className='text-lg text-blue-500 font-semibold'>
                                        {lang === 'ar' ? 'الخطة التالية' : 'Next Plan'}
                                    </p>
                                    <h4 className='font-semibold text-2xl'>
                                        {activePlan.nextPlanName || 'N/A'}
                                    </h4>
                                         <h4 className='font-semibold text-2xl flex items-center gap-1'>
                                    {activePlan.nextPlanMonthlyPrice} /
                                    {activePlan.currency === 2 && lang === 'ar' ? (
                                    <Image src={sarIcon} alt="SAR" width={30} height={30} />
                                    ) : (
                                    currencyLabels[activePlan.currency]?.[lang === 'ar' ? 'ar' : 'en']
                                    )}
                                </h4>
                                </div>
                                {/* <p className='font-normal text-[#5C5C5C] text-sm'>
                                    {t('nextPlanPriceEgp')}{" "}
                                    {activePlan.nextPlanMonthlyPriceInEgp || '???'} {lang === 'ar' ? 'جنيه' : 'EGP'}
                                </p> */}
                                <button onClick={
                                    () => upgrade()
                                } className='bg-redColor text-white rounded-full w-32 py-3 font-medium'>
                                    {lang === 'ar' ? 'ترقية' : 'Upgrade'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
           <>
            <div className={` ${activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan' ?'': 'bg-white shadow-md rounded-lg pb-3  mt-8'}`}>
                {
                (activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan')?''
                :
                <>
                <h3 className='text-2xl px-6 py-3'>{lang === 'ar' ? 'المحفظة' : 'Wallet'}</h3>
                <div className="w-full h-[1px] bg-[#bebebe]"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 px-6">
                    {WalletArr.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col items-center justify-center text-center min-w-[220px] p-5 bg-gradient-to-br from-white to-[#f8f9fa] rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.color}`}
                        >
                            <span className="w-10 mb-5">
                                {typeof item.icon === 'string' ? (
                                    <img src={item.icon} alt={item.name} className="w-10 h-10 object-contain" />
                                ) : (
                                    item.icon
                                )}
                            </span>
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <p className={`text-xl flex items-center gap-1 ${item.color}`}>
                                {item.price} <span className="text-xl text-gray-600">{item.currency ==='ر.س'?<Image src={sarIcon} alt="SAR" width={18} height={18} />:item.currency}</span>
                            </p>
                        </div>
                    ))}
                </div>
</>
                }
                
{(
  ( activePlan?.planName === 'الخطة التجريبية' ||  activePlan?.planName === 'Trial Plan') ||
  (activePlan?.planName === 'خطة مميزة' || activePlan?.planName === 'VIP Plan')
)? 
'':
                 <>
                    <div className="flex items-center gap-1 px-6 my-6">
                        <svg className="w-5 h-5 text-[#E84654]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 6v18h18"></path>
                            <path d="M14 12l-2-2v4z"></path>
                            <path d="M18 9l-4 3v5"></path>
                            <path d="M15 4h5v5"></path>
                        </svg>
                        <h3 className='text-lg '>{lang === 'ar' ? 'شحن الرصيد' : 'Balance recharge'}</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
                        {bulk.map((amount: RechargePackage, idx) => (
                            <div
                                key={idx}
                                className="flex- min-w-[180px] bg-white border-2 border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg hover:border-[#E84654] transition relative"
                            >
                                <div className="text-2xl font-bold text-gray-800 mb-3">
                                    <div className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        {getAmountWithCurrency(amount, currency, lang).amountValue}{" "}
                                        <span className="text-lg text-gray-500">{currency?.toUpperCase?.()==='ر.س'? 
                                    <Image src={sarIcon} alt="SAR" width={18} height={18} />
                                        :currency?.toUpperCase?.()}</span>
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
                                    className="bg-[#fce5e7] text-[#E84654] px-5 py-2 rounded-full text-sm font-semibold transition hover:bg-[#E84654] hover:text-white"
                                >
                                    {lang === 'ar' ? 'شحن الآن' : 'Recharge Now'}
                                </button>
                                <div className="absolute top-0 right-0 h-1 w-full bg-[#E84654] scale-x-0 hover:scale-x-100 origin-right transition-transform duration-300"></div>
                            </div>
                        ))}
                    </div>
                 </>
             }
            </div>
           </>
            <SubscriptionTable lang={lang} />
            <ScheduleOfPlans lang={lang} plan={plan} ActivePlan={activePlan} />
        </div>
    </>
}

export default MyPlan