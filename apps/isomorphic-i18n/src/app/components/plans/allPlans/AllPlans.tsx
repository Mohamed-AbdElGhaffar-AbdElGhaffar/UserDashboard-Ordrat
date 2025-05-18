'use client'
import React, { useEffect, useState } from 'react'
import price from '@public/assets/price1.svg'
import priceMain from '@public/assets/priceMain.svg'
import { faCircleCheck, faCircleChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
// import { getPlans } from '@/app/lib/api/plan';
import Link from 'next/link';
import axiosClient from '../../context/api';
import { useGuardContext } from '../../context/GuardContext';
import { useTranslation } from '@/app/i18n/client';

export type PlanFeature = {
    feature: {
        id: string;
        name: string;
        description: string;
    };
};

export type Plan = {
    id: string;
    planFeatures: PlanFeature[];
    name: string;
    description: string;
    annualPrice: number;
    monthlyPrice: number;
    isActive: boolean;
};
function AllPlans({ lang }: { lang?: string }) {
    const { t } = useTranslation(lang!, "pricing1");
    const [active, setactive] = useState<boolean>(true)
    // const { t , i18n } = useTranslation(lang!, "pricing")

    const [activeyear, setactiveYear] = useState<boolean>(false)
    const [plan, setplan] = useState<Plan[]>([])
    const { setGuard } = useGuardContext();

    const fetchData = async () => {
        try {
            const response = await axiosClient.get(`api/Plan/GetAll`, {
                headers: {
                    'Accept-Language': lang,
                },
            });
            const data = await response.data;
            setplan(data)


        } catch (error) {
            // setGuard(false);
            // localStorage.clear();
            // router.push(`/${lang}/signin`);
            console.error('Error fetching plans:', error);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);
    const handelClick = () => {
        setactive(true)
        setactiveYear(false)
    }
    const handelClickYear = () => {
        setactive(false)
        setactiveYear(true)
    }

    return <>
        <div className="">
            <div className="flex flex-col gap-5 items-center justify-center mt-10">
                <div className="bg-[#F5F5F5] rounded-full w-48 h-12 px-1 flex items-center">
                    <div
                        className={`flex-1 text-center text-base font-normal py-2 cursor-pointer rounded-full transition-all ${active ? 'bg-redColor text-white' : 'text-mainTextColor'
                            }`}
                        onClick={handelClick}
                    >
                        {t('monthly')}
                    </div>
                    <div
                        className={`flex-1 text-center py-2 text-base font-normal cursor-pointer  rounded-full transition-all ${activeyear ? 'bg-redColor text-white' : 'text-mainTextColor'
                            }`}
                        onClick={handelClickYear}
                    >
                        {t('yearly')}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <p className='text-lg font-normal'>{t('chooseCurrency')}</p>
                    <FontAwesomeIcon icon={faCircleChevronDown} />
                </div>
            </div>
            {active && (

                <div className="grid lg:grid-cols-3 grid-cols-1 gap-10 my-20">
                    {plan.map((i, index) =>
                        <div key={index} className={`${index === 1 ? "bg-redColor" : "bg-white lg:translate-y-16 shadowContanier"}  rounded-3xl w-full flex flex-col justify-between`}>
                            <div className="p-10 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between relative">
                                        <div className={` flex gap-5  ${index === 1 ? "mt-7" : "mt-0"}`} >
                                            <Image width={100} height={60} src={index == 1 ? priceMain : price} className='w-10 sm:w-20' alt='price' />

                                            <div >
                                                <p className={`text-sm sm:text-lg font-normal ${index === 1 ? "text-white" : "text-[#191A1580]"}`}>{i.name}</p>
                                                <h3 className={`text-lg sm:text-2xl font-bold ${index === 1 ? 'text-white' : 'text-black'}`}>{i.name}</h3>
                                            </div>
                                            {index === 1 &&
                                                <p className='absolute  -end-6 sm:end-0 -top-3 px-3 sm:px-6 py-3 rounded-xl bg-[#FFFFFF33] text-white'>{t('popular')}</p>
                                            }
                                        </div>
                                    </div>
                                    <h3 className={`sm:text-base text-sm font-normal my-6 ${index === 1 ? 'text-white' : 'text-[#191A1580]'}`}>{i.description}</h3>
                                    <p className={`text-4xl font-bold mb-4 ${index === 1 ? 'text-white' : 'text-black'}`}>{i.monthlyPrice} {t('price')}
                                        <span className={`text-base ${index === 1 ? 'text-white' : 'text-[#191A1580]'}`}>
                                            /{t('monthly')}
                                        </span>
                                    </p>
                                    <span className={`text-base font-bold ${index === 1 ? 'text-white' : 'text-black'}`}>{t('included')}</span>
                                    <ul className="space-y-2 mb-4 mt-3">
                                        {i.planFeatures?.map((feature, idx) =>
                                            <li key={idx} className={`flex items-center gap-2 text-base sm:text-lg font-normal ${index === 1 ? 'text-white' : 'text-black'}`}>
                                                <FontAwesomeIcon icon={faCircleCheck} className={`mt-1 text-xl ${index === 1 ? 'text-white' : 'text-redColor'}`} />
                                                {feature.feature.name}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <Link href={lang === "ar" ? `/${lang}/الحجز` : `/${lang}/booking`}>
                                    <button className={`text-lg w-full h-14 mt-5 rounded-full duration-200 ${index === 1 ? 'bg-white text-redColor hover:border hover:border-white hover:bg-transparent hover:text-white' : 'bg-redColor text-white hover:border hover:border-redColor hover:bg-transparent hover:text-redColor'}`}>
                                        {index === 1 ?
                                            t('thisPlan')
                                            :
                                            t('upgrade')
                                        }
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {activeyear && (
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-10 my-20">
                    {plan.map((i, index) =>
                        <div key={index} className={`${index === 1 ? "bg-redColor" : "bg-white lg:translate-y-16 shadowContanier"}  rounded-3xl w-full flex flex-col justify-between`}>
                            <div className="p-10 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between relative">
                                        <div className={` flex gap-5  ${index === 1 ? "mt-7" : "mt-0"}`} >
                                            <Image width={100} height={60} src={index == 1 ? priceMain : price} className='w-10 sm:w-20' alt='price' />

                                            <div >
                                                <p className={`text-sm sm:text-lg font-normal ${index === 1 ? "text-white" : "text-[#191A1580]"}`}>{i.name}</p>
                                                <h3 className={`text-lg sm:text-2xl font-bold ${index === 1 ? 'text-white' : 'text-black'}`}>{i.name}</h3>
                                            </div>
                                            {index === 1 &&
                                                <p className='absolute  -end-6 sm:end-0 -top-3 px-3 sm:px-6 py-3 rounded-xl bg-[#FFFFFF33] text-white'>{t('popular')}</p>
                                            }
                                        </div>
                                    </div>
                                    <h3 className={`sm:text-base text-sm font-normal my-6 ${index === 1 ? 'text-white' : 'text-[#191A1580]'}`}>{i.description}</h3>
                                    <p className={`text-4xl font-bold mb-4 ${index === 1 ? 'text-white' : 'text-black'}`}>{i.annualPrice} {t('price')}
                                        <span className={`text-base ${index === 1 ? 'text-white' : 'text-[#191A1580]'}`}>
                                            /{t('monthly')}
                                        </span>
                                    </p>
                                    <span className={`text-base font-bold ${index === 1 ? 'text-white' : 'text-black'}`}>{t('included')}</span>
                                    <ul className="space-y-2 mb-4 mt-3">
                                        {i.planFeatures?.map((feature, idx) =>
                                            <li key={idx} className={`flex items-center gap-2 text-base sm:text-lg font-normal ${index === 1 ? 'text-white' : 'text-black'}`}>
                                                <FontAwesomeIcon icon={faCircleCheck} className={`mt-1 text-xl ${index === 1 ? 'text-white' : 'text-redColor'}`} />
                                                {feature.feature.name}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <Link href={lang === "ar" ? `/${lang}/الحجز` : `/${lang}/booking`}>
                                    <button className={`text-lg w-full h-14 mt-5 rounded-full duration-200 ${index === 1 ? 'bg-white text-redColor hover:border hover:border-white hover:bg-transparent hover:text-white' : 'bg-redColor text-white hover:border hover:border-redColor hover:bg-transparent hover:text-redColor'}`}>
                                        {index === 1 ?
                                            t('thisPlan')
                                            :
                                            t('upgrade')
                                        }
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

    </>
}

export default AllPlans