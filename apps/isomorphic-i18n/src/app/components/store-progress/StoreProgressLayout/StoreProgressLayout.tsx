'use client';

import { useEffect, useState } from "react";
import { GetCookiesServer } from "../../ui/getCookiesServer/GetCookiesServer";
import ProgressSummary from "../ProgressSummary/ProgressSummary";
import StoreHeader from "../StoreHeader/StoreHeader";
import TasksPanel from "../TasksPanel/TasksPanel";
import { GetCookiesClient } from "../../ui/getCookiesClient/GetCookiesClient";
import { API_BASE_URL } from "@/config/base-url";
import axiosClient from "../../context/api";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useUserContext } from "../../context/UserContext";
import PageHeader from "@/app/shared/page-header";
import NotFound from "@/app/not-found";

interface tasksProps {
  taskId: string,
  title: string,
  description: string,
  completed: boolean,
  link: string,
}
interface PageHeaderType {
  title: string;
  breadcrumb: {href?: string; name: string;}[];
}
interface StoreProgressLayoutProps {
  lang: string;
  shopData: any;
  initialTasks: tasksProps[];
  initialCompleted: number;
  initialTotal: number;
  pageHeader: PageHeaderType;
}

export default function StoreProgressLayout({ lang, shopData, initialTasks, initialTotal, initialCompleted, pageHeader }: StoreProgressLayoutProps) {
  const text = {
    currency: lang === 'ar' ? "ج.م" : "EGP",
  }
  // const tasks = [
  //   {
  //     id: 'store-info',
  //     titleAr: 'معلومات المتجر',
  //     titleEn: 'Store Info',
  //     descAr: 'اسم المتجر، الشعار، والوصف',
  //     descEn: 'Store name, logo, and description',
  //     completed: true,
  //     link: `/${lang}/statics`,
  //   },
  //   {
  //     id: 'products',
  //     titleAr: 'إضافة المنتجات',
  //     titleEn: 'Add Products',
  //     descAr: 'أضف منتجاتك الأولى',
  //     descEn: 'Add your first products',
  //     completed: false,
  //     link: `/${lang}/statics`,
  //   },
  //   {
  //     id: 'profile',
  //     titleAr: 'الملف التجاري',
  //     titleEn: 'Business Profile',
  //     descAr: 'معلومات الشركة والتراخيص',
  //     descEn: 'Company and license info',
  //     completed: true,
  //     link: `/${lang}/statics`,
  //   },
  //   {
  //     id: 'payment',
  //     titleAr: 'طرق الدفع',
  //     titleEn: 'Payment Methods',
  //     descAr: 'فيزا، مدى، تحويل بنكي',
  //     descEn: 'Visa, Mada, Bank Transfer',
  //     completed: true,
  //     link: `/${lang}/statics`,
  //   },
  //   {
  //     id: 'shipping',
  //     titleAr: 'خيارات الشحن',
  //     titleEn: 'Shipping Options',
  //     descAr: 'مناطق التوصيل والأسعار',
  //     descEn: 'Delivery areas and pricing',
  //     completed: false,
  //     link: `/${lang}/statics`,
  //   },
  //   {
  //     id: 'design',
  //     titleAr: 'تصميم المتجر',
  //     titleEn: 'Store Design',
  //     descAr: 'الألوان والقوالب',
  //     descEn: 'Colors and templates',
  //     completed: false,
  //     link: `/${lang}/statics`,
  //   },
  // ];
  // const completed = 3;
  // const total = 6;
  
  const [tasks, setTasks] = useState<tasksProps[]>(initialTasks);
  const [total, setTotal] = useState<number>(initialTotal);
  const [completed, setCompleted] = useState<number>(initialCompleted);
  const [loading, setLoading] = useState<boolean>(true);
  const { progressData, productData, tablesData, couponData, setProgressData } = useUserContext();

  const shopId = GetCookiesClient('shopId');

  async function fetchShopProgressData() {
    try {
      const response = await axiosClient.get('/api/ShopHighPriority/items', {
        params: { shopId },
        headers: {
          'Accept-Language': lang,
        },
      });

      const data = response.data;
      const apiTasks = data.tasks;
      const apiTotal = data.summary.total;
      const apiCompleted = data.summary.completed;

      const isTasksDifferent =
        JSON.stringify(apiTasks.map((t: any) => [t.taskId, t.completed])) !==
        JSON.stringify(initialTasks.map(t => [t.taskId, t.completed]));

      const isTotalDifferent = apiTotal !== initialTotal;
      const isCompletedDifferent = apiCompleted !== initialCompleted;

      if (isTasksDifferent || isTotalDifferent || isCompletedDifferent) {
        setTasks(apiTasks);
        setTotal(apiTotal);
        setCompleted(apiCompleted);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch shop progress data:', error);
      setLoading(false);
    }
  }
  useEffect(() => {
    if (shopId) {
      fetchShopProgressData();
    }
  }, [lang, shopId, initialTasks, initialTotal, initialCompleted]);

  useEffect(() => {
    if (progressData == true || productData == true || tablesData == true || couponData == true) {
      fetchShopProgressData();
      setProgressData(false);
    }
  }, [progressData, productData, tablesData, couponData]); 

  if (completed === total && !loading) {
    return <NotFound />;
  }

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <div className="progress-dashboard grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 my-6">
        {loading ? (
          <>
            <div className="bg-white rounded-xl p-6 shadow">
              <Skeleton height={30} className="mb-4" />
              <Skeleton count={3} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <Skeleton height={30} className="mb-4" />
              <Skeleton count={4} />
            </div>
          </>
        ) : (
          <>
            <ProgressSummary lang={lang} total={total} completed={completed} />
            <TasksPanel lang={lang} tasks={tasks} />
          </>
        )}
      </div>
    </div>
  );
}