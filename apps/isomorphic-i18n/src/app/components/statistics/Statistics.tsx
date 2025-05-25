'use client'
import { useTranslation } from '@/app/i18n/client';
import {
    faBriefcase,
    faLayerGroup,
    faShapes,
    faShoppingCart,
    faUsers,
    faTruck,
    faBan,
    faPercentage,
    faDollarSign,
    faTrophy,
    faStar,
    faAward
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';
import doc from '@public/assets/063b11c8f7959938056ec05de5a53c6f.png'
import 'swiper/css';

import Image from 'next/image';
import StatsCards from '@/app/shared/executive/stats-cards';
import Patients from '@/app/shared/appointment/dashboard/patients';
import AreaChartList from '@/app/[lang]/(hydrogen)/widgets/cards/area-chart-list';
import BarChartList from '@/app/[lang]/(hydrogen)/widgets/cards/bar-chart-list';
import ProfitWidget from '@/app/shared/ecommerce/dashboard/profit-widget';
import TopProductList from '@/app/[lang]/(hydrogen)/widgets/cards/top-product-list';
import Spending from '@/app/shared/financial/dashboard/spending';
import LowStockProductList from '@/app/[lang]/(hydrogen)/widgets/cards/low-product-list copy';
import StorageSummary from '@/app/shared/file/dashboard/storage-summary';
import TrafficAnalytics from '@/app/shared/traffic-analytics';
import FlowOnDevices from '@/app/shared/flow-on-devices';
import ProfileVisits from '@/app/shared/profile-visits';
import TotalProfitLoss from '@/app/shared/total-profit-loss';
import ReactDatePicker from '../datepicker';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import { GetCookiesClient } from '../ui/getCookiesClient/GetCookiesClient';
import DropdownAction from '@components/charts/dropdown-action';

type Image = {
    id: string;
    imageUrl: string;
    isPrimary: boolean;
};

type Product = {
    id: string;
    name: string;
    description: string;
    title: string;
    metaDescription: string;
    images: Image[];
    price: number;
    isActive: boolean;
    createdAt: string;
    lastUpdatedAt: string;
    numberOfSales: number;
    isTopSelling: boolean;
    isTopRated: boolean;
    oldPrice: number;
};
type customers = {
    phoneNumber: string,
    ordersCount: number,
    profits: number,
    createdAt: string
}

export interface ShopStatistics {
    totalOrders: number;
    paidOrders: number;
    unpaidOrders: number;
    paidRevenue: number;
    unpaidRevenue: number;
    totalRevenue: number;
    activeOrders: number;
    totalCost: number;
    avgSellingPrice: number;
    avgCostPerOrder: number;
    grossProfit: number;
    profitMarginPercent: number;
    visitsCount: number;
    cvrRate: number;
    abandonedCheckouts: number;
    abandonedCheckoutsPct: number;
    timesAddToCart: number;
    timesAddToCartPct: number;
    timesReachCheckout: number;
    timesReachCheckoutPct: number;
    timesSuccessOrder: number;
    timesSuccessOrderPct: number;
    cancelledOrders: number;
    periodType: string;
    totalOrdersGrowthPct: number;
    totalRevenueGrowthPct: number;
    grossProfitGrowthPct: number;
    visitsGrowthPct: number;
    cancelledOrdersGrowthPct: number;
    prevTotalOrders: number;
    prevPaidOrders: number;
    prevUnpaidOrders: number;
    prevPaidRevenue: number;
    prevUnpaidRevenue: number;
    prevTotalRevenue: number;
    prevActiveOrders: number;
    prevGrossProfit: number;
    prevVisitsCount: number;
    prevAbandonedCheckouts: number;
    prevAbandonedCheckoutsPct: number;
    prevTimesAddToCart: number;
    prevTimesAddToCartPct: number;
    prevTimesReachCheckout: number;
    prevTimesReachCheckoutPct: number;
    prevTimesSuccessOrder: number;
    prevTimesSuccessOrderPct: number;
    prevCVRRate: number;
    prevCancelledOrders: number;
    activeOrdersGrowthPct: number;
    paidOrdersGrowthPct: number;
    unpaidOrdersGrowthPct: number;
    paidRevenueGrowthPct: number;
    unpaidRevenueGrowthPct: number;
    avgOrderValueGrowthPct: number;
    periodStart: string;
    periodEnd: string;
    prevPeriodStart: string;
    prevPeriodEnd: string;
    currencyAbbreviationEn: string;
    currencyAbbreviationAr: string;
    totalOrdersChart: ChartData[];
    activeOrdersChart: ChartData[];
    cancelledOrdersChart: ChartData[];
    paidRevenueChart: ChartData[];
    paidOrdersChart: ChartData[];
    unpaidOrdersChart: ChartData[];
    totalRevenueChart: ChartData[];
    activeRevenueChart: ChartData[];
    unpaidRevenueChart: ChartData[];
    statusRevenueChart: StatusChartData[];
    grossProfitChart: StatusChartData[];
    visitsChart: ChartData[];
    deviceSummaries: DeviceSummary[];
    avgOrderValueChart: ChartData[];
    countrySummaries: CountrySummary[];
    abandonedCheckoutsChart: ChartData[];
    addToCartChart: ChartData[];
    reachedCheckoutChart: ChartData[];
    successOrderChart: ChartData[];
    cvrRateChart: ChartData[];
    orderStatusSummaries: OrderStatusSummary[];
    paymentStatusSummaries: PaymentStatusSummary[];
    paymentMethodSummaries: PaymentMethodSummary[];
    branchSummaries: BranchSummary[];
    topSellingProducts: TopSellingProduct[];
    lowStockProducts: LowStockProduct[];
    intervals: Interval[];
}

export interface ChartData {
    intervalNum: number;
    label: string;
    count: number;
}

export interface StatusChartData extends ChartData {
    status: number;
    statusName: string;
}

export interface OrderStatusSummary {
    status: number;
    statusName: string;
    orderCount: number;
    totalRevenue: number;
    percentage: number;
}
export type CountrySummary = {
    country: string;
    visitsCount: number;
    abandonedCheckouts: number;
    completedOrders: number;
    totalAddToCardCount: number;
    conversionRate: number;      // معدل التحويل
    abandomnmentRate: number;    // معدل الهجر
};

export interface PaymentStatusSummary {
    isPaid: boolean;
    paymentStatus: string;
    orderCount: number;
    totalRevenue: number;
    percentage: number;
}
export type DeviceSummary = {
    deviceType: string;        // نوع الجهاز (Desktop أو Mobile)
    visitsCount: number;       // عدد الزيارات
    abandonedCheckouts: number; // عدد الطلبات المهجورة
    completedOrders: number;    // عدد الطلبات المكتملة
    totalAddToCartCount: number; // عدد العناصر المضافة للسلة
    conversionRate: number;     // معدل التحويل
    abandonmentRate: number;    // معدل الهجر
    percentage: number;         // نسبة الجهاز من الاستخدام
};

export interface PaymentMethodSummary {
    paymentMethod: number;
    paymentMethodName: string;
    orderCount: number;
    totalRevenue: number;
    percentage: number;
}

export interface BranchSummary {
    branchId: string;
    branchNameEn: string;
    branchNameAr: string;
    totalOrders: number;
    activeOrders: number;
    paidOrders: number;
    unpaidOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    paidRevenue: number;
    unpaidRevenue: number;
    totalCost: number;
    grossProfit: number;
    profitMarginPercent: number;
    avgOrderValue: number;
}

export interface TopSellingProduct {
    productId: string;
    productNameEn: string;
    productNameAr: string;
    price: number;
    totalQuantitySold: number;
    activeQuantitySold: number;
    totalRevenue: number;
    productImage: any;
    activeRevenue: number;
    totalProfit: number;
    categoryNameEn: string;
    categoryNameAr: string;
    paidQuantitySold: number;
    unpaidQuantitySold: number;
    paidRevenue: number;
    unpaidRevenue: number;
}

export interface LowStockProduct {
    productId: string;
    productNameEn: string;
    productNameAr: string;
    price: number;
    buyingPrice: number;
    productImage: any;
    categoryNameEn: string;
    categoryNameAr: string;
    branchNameEn: string;
    branchNameAr: string;
    branchId: string;
    currentStock: number;
}

export interface Interval {
    intervalNum: number;
    label: string;
    startDate: string;
    endDate: string;
}

const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
function Statistics({
    lang,


}: {
    lang: string;

}) {
    const { t } = useTranslation(lang, "statistics");
    const [statistics, setStatistics] = useState<ShopStatistics | null>(null);
    const [couponData, setCouponData] = useState<boolean>(false);
    const shopId = GetCookiesClient('shopId');
    const [animateFilter, setAnimateFilter] = useState(false);

    const { mainBranch } = useUserContext();
    const [starDate, setStartDate] = useState<[Date | null, Date | null]>([null, null]);
    const handleDateChange = (dates: [Date | null, Date | null]) => {
        setStartDate(dates);
        setViewType('');
    };
    const [isDateFiltered, setIsDateFiltered] = useState<boolean>(false);


    async function fetchShopStatistics(from?: string, to?: string) {
        if (!mainBranch || !shopId) return;

        try {
            let url = `https://testapi.ordrat.com/api/ShopStatistics/dashboard?shopId=${shopId}&branchId=${mainBranch}`;

            if (from && to) {
                url += `&from=${from}&to=${to}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Accept-Language': lang,
                },
            });
            console.log("Fetched statistics:", response.data);
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching shop statistics:', error);
        }
    }
    const [viewType, setViewType] = useState<string>('');
    useEffect(() => {
        if (!mainBranch) return;
        let from = '';
        let to = '';

        if (viewType) {
            [from, to] = getDateRange(viewType);
        }

        if (starDate[0] && starDate[1]) {
            from = formatDate(starDate[0]);
            to = formatDate(starDate[1]);

        }
        setIsDateFiltered(true);
        fetchShopStatistics(from, to);
    }, [mainBranch, starDate, viewType, lang]);

    const viewOptions = [
        { value: 'Daily', label: lang === 'ar' ? 'يومي' : 'Daily' },
        { value: 'Weekly', label: lang === 'ar' ? 'أسبوعي' : 'Weekly' },
        { value: 'Monthly', label: lang === 'ar' ? 'شهري' : 'Monthly' },
        { value: 'Yearly', label: lang === 'ar' ? 'سنوي' : 'Yearly' },

    ];
    const getDateRange = (viewType: string): [string, string] => {
        const today = new Date();
        let startDate = new Date();

        switch (viewType) {
            case 'Weekly':
                startDate.setDate(today.getDate() - 7);
                break;
            case 'Monthly':
                startDate.setMonth(today.getMonth() - 1);
                break;
            case 'Yearly':
                startDate.setFullYear(today.getFullYear() - 1);
                break;
            case 'Daily':
            default:
                startDate = today;
                break;
        }

        const from = formatDate(startDate);
        const to = formatDate(today);
        return [from, to];
    };
    const handleViewTypeChange = (type: string) => {
        setViewType(type);
        setAnimateFilter(false); // أوقف الأنيميشن القديمة
        setTimeout(() => setAnimateFilter(true), 50)
        const [from, to] = getDateRange(type);
        setIsDateFiltered(true);
        setStartDate([null, null]);
        fetchShopStatistics(from, to);
    };


    const clearDateFilter = () => {
        setStartDate([null, null]);
        setViewType('');
        setIsDateFiltered(false);
        fetchShopStatistics();
    };

    const getPeriodLabel = (lang: string, viewType: string, isDateFiltered: boolean): string => {
        if (!isDateFiltered) return '';
        if (viewType === 'Daily') return lang === 'ar' ? 'مقارنة باليوم السابق' : 'Than the previous day';
        if (viewType === 'Weekly') return lang === 'ar' ? 'مقارنة بالأسبوع السابق' : 'Than last week';
        if (viewType === 'Monthly') return lang === 'ar' ? 'مقارنة بالشهر السابق' : 'Than last month';
        if (viewType === 'Yearly') return lang === 'ar' ? 'مقارنة بالعام السابق' : 'Than last year';
        if (starDate[0] && starDate[1]) return lang === 'ar' ? 'مقارنة بالفترة السابقة' : 'Than previous period';
        return '';
    };
    const periodLabel = getPeriodLabel(lang, viewType, isDateFiltered);
    return <>
        <div className="mb-4 flex flex-col sm:flex-row sm:w-fit w-full sm:items-center gap-2">
            <ReactDatePicker
                startDate={starDate?.[0]!}
                endDate={starDate?.[1]!}
                onChange={(dates: any) => handleDateChange(dates)}
                monthsShown={1}
                placeholderText={lang === 'ar' ? "اختر تاريخًا في فترة زمنية معينة" : "Select Date in a Range"}
                selectsRange
                className="w-full sm:w-64 md:w-80 input-placeholder text-[16px]"
                calendarClassName='text-[16px]'
                dateFormat="yyyy-MM-dd"
            />
            <div className="sm:flex-none flex sm:w-auto w-full gap-3">
                <div className="flex items-center sm:w-auto w-2/3 gap-5">
                    {/* <CustomLegend className="hidden @[28rem]:mt-0 @[28rem]:inline-flex" /> */}
                    <DropdownAction
                        className="h-full w-full rounded-md border flex items-center justify-center "
                        options={viewOptions}
                        selectClassName="h-full py-1"
                        activeClassName="h-full py-1"
                        onChange={(value: string) => handleViewTypeChange(value)}
                        dropdownClassName="!z-0"
                    />
                </div>
                <button
                    onClick={clearDateFilter}
                    className=" px-4 py-3 bg-redColor sm:w-auto w-1/3 text-white hover:border hover:bg-transparent hover:border-redColor hover:text-black rounded-md"
                    disabled={!isDateFiltered}
                >
                    {lang === 'ar' ? 'إلغاء' : 'Clear'}
                </button>
            </div>
        </div>
        <StatsCards
            viewType={viewType}
            lang={lang}
            currency={lang === 'ar' ? statistics?.currencyAbbreviationAr : statistics?.currencyAbbreviationEn}
            periodStart={statistics?.periodStart}
            periodEnd={statistics?.periodEnd}
            prevPeriodStart={statistics?.prevPeriodStart}
            prevPeriodEnd={statistics?.prevPeriodEnd}
            periodLabel={periodLabel}
            visitsCount={statistics?.visitsCount ?? 0}
            visitsGrowthPct={statistics?.visitsGrowthPct ?? 0}
            visitsChart={statistics?.visitsChart ?? []}
            totalOrders={statistics?.totalOrders ?? 0}
            totalOrdersGrowthPct={statistics?.totalOrdersGrowthPct ?? 0}
            totalOrdersChart={statistics?.totalOrdersChart ?? []}
            totalRevenue={statistics?.totalRevenue ?? 0}
            totalRevenueGrowthPct={statistics?.totalRevenueGrowthPct ?? 0}
            totalRevenueChart={statistics?.totalRevenueChart ?? []}
            grossProfit={statistics?.grossProfit ?? 0}
            grossProfitGrowthPct={statistics?.grossProfitGrowthPct ?? 0}
            grossProfitChart={statistics?.grossProfitChart ?? []}
            abandonedCheckouts={statistics?.abandonedCheckouts ?? 0}
            abandonedCheckoutsPct={statistics?.abandonedCheckoutsPct ?? 0}
            abandonedCheckoutsChart={statistics?.abandonedCheckoutsChart ?? []}
            timesAddToCart={statistics?.timesAddToCart ?? 0}
            timesAddToCartPct={statistics?.timesAddToCartPct ?? 0}
            addToCartChart={statistics?.addToCartChart ?? []}
            timesReachCheckout={statistics?.timesReachCheckout ?? 0}
            timesReachCheckoutPct={statistics?.timesReachCheckoutPct ?? 0}
            successOrderChart={statistics?.successOrderChart ?? []}
            timesSuccessOrderPct={statistics?.timesSuccessOrderPct ?? 0}
            reachedCheckoutChart={statistics?.reachedCheckoutChart ?? []}
            timesSuccessOrder={statistics?.timesSuccessOrder ?? 0}
            cvrRate={statistics?.cvrRate ?? 0}
            cvrRateChart={statistics?.cvrRateChart ?? []}
            activeOrders={statistics?.activeOrders ?? 0}
            activeOrdersGrowthPct={statistics?.activeOrdersGrowthPct ?? 0}
            activeOrdersChart={statistics?.activeOrdersChart ?? []}
            paidOrders={statistics?.paidOrders ?? 0}
            paidOrdersGrowthPct={statistics?.paidOrdersGrowthPct ?? 0}
            paidOrdersChart={statistics?.paidOrdersChart ?? []}
            unpaidOrders={statistics?.unpaidOrders ?? 0}
            unpaidOrdersGrowthPct={statistics?.unpaidOrdersGrowthPct ?? 0}
            unpaidOrdersChart={statistics?.unpaidOrdersChart ?? []}
            cancelledOrders={statistics?.cancelledOrders ?? 0}
            cancelledOrdersGrowthPct={statistics?.cancelledOrdersGrowthPct ?? 0}
            cancelledOrdersChart={statistics?.cancelledOrdersChart ?? []}
            paidRevenue={statistics?.paidRevenue ?? 0}
            paidRevenueGrowthPct={statistics?.paidRevenueGrowthPct ?? 0}
            paidRevenueChart={statistics?.paidRevenueChart ?? []}
            unpaidRevenue={statistics?.unpaidRevenue ?? 0}
            unpaidRevenueGrowthPct={statistics?.unpaidRevenueGrowthPct ?? 0}
            unpaidRevenueChart={statistics?.unpaidRevenueChart ?? []}
            avgSellingPrice={statistics?.avgSellingPrice ?? 0}
            avgOrderValueGrowthPct={statistics?.avgOrderValueGrowthPct ?? 0}
            avgOrderValueChart={statistics?.avgOrderValueChart ?? []}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 4xl:grid-cols-4 gap-6">
            <Spending
                lang={lang!}
                timesAddToCartPct={statistics?.timesAddToCartPct}
                timesReachCheckoutPct={statistics?.timesReachCheckoutPct}
                timesSuccessOrderPct={statistics?.timesSuccessOrderPct}
                cvrRate={statistics?.cvrRate}
                className="w-full mt-10" />
            <AreaChartList
                currency={lang === 'ar' ? statistics?.currencyAbbreviationAr : statistics?.currencyAbbreviationEn}
                paidRevenue={statistics?.paidRevenue}
                unpaidOrders={statistics?.unpaidOrders}
                paidOrders={statistics?.paidOrders}
                cancelledOrders={statistics?.cancelledOrders}
                avgSellingPrice={statistics?.avgSellingPrice}
                paidRevenueChart={statistics?.paidRevenueChart}
                lang={lang!} className='w-full mt-10' />
            <TotalProfitLoss lang={lang}
                currency={lang === 'ar' ? statistics?.currencyAbbreviationAr as any : statistics?.currencyAbbreviationEn as any}
                branchSummaries={statistics?.branchSummaries || []} className="col-span-full 4xl:order-last" />
            <StorageSummary currency={lang === 'ar' ? statistics?.currencyAbbreviationAr : statistics?.currencyAbbreviationEn} lang={lang} totalOrder={statistics?.totalOrders} paymentStatusSummaries={statistics?.paymentStatusSummaries} className="@4xl:col-span-4 @[96.937rem]:col-span-3 4xl:mt-10" />
            <TrafficAnalytics orderStatusSummaries={statistics?.orderStatusSummaries || []} lang={lang} className=" @2xl:col-span-6 @7xl:order-8 @7xl:col-span-4 @7xl:row-span-1 4xl:mt-10" />
            <FlowOnDevices lang={lang} deviceSummaries={statistics?.deviceSummaries || []} className=" @2xl:col-span-6 @7xl:order-7 @7xl:col-span-4 @7xl:row-span-1 " />
            <ProfileVisits lang={lang} countrySummaries={statistics?.countrySummaries || []} className="@2xl:col-span-6 @7xl:col-span-4 @7xl:row-span-2" />
            <TopProductList currency={lang === 'ar' ? statistics?.currencyAbbreviationAr : statistics?.currencyAbbreviationEn} topSellingProducts={statistics?.topSellingProducts} lang={lang} className='w-full ' />
            <LowStockProductList LowStockProducts={statistics?.lowStockProducts || []} lang={lang} className='w-full' />
        </div>

    </>
}

export default Statistics;
