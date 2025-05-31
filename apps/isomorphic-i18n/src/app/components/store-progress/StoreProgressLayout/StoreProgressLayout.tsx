'use client';

import { GetCookiesServer } from "../../ui/getCookiesServer/GetCookiesServer";
import ProgressSummary from "../ProgressSummary/ProgressSummary";
import StoreHeader from "../StoreHeader/StoreHeader";
import TasksPanel from "../TasksPanel/TasksPanel";

interface StoreProgressLayoutProps {
  lang: string;
  shopData: any;
}

export default function StoreProgressLayout({ lang, shopData }: StoreProgressLayoutProps) {
  const text = {
    currency: lang === 'ar' ? "ج.م" : "EGP",
  }
  const tasks = [
    {
      id: 'store-info',
      titleAr: 'معلومات المتجر',
      titleEn: 'Store Info',
      descAr: 'اسم المتجر، الشعار، والوصف',
      descEn: 'Store name, logo, and description',
      completed: true,
      link: `/${lang}/statics`,
    },
    {
      id: 'products',
      titleAr: 'إضافة المنتجات',
      titleEn: 'Add Products',
      descAr: 'أضف منتجاتك الأولى',
      descEn: 'Add your first products',
      completed: false,
      link: `/${lang}/statics`,
    },
    {
      id: 'profile',
      titleAr: 'الملف التجاري',
      titleEn: 'Business Profile',
      descAr: 'معلومات الشركة والتراخيص',
      descEn: 'Company and license info',
      completed: true,
      link: `/${lang}/statics`,
    },
    {
      id: 'payment',
      titleAr: 'طرق الدفع',
      titleEn: 'Payment Methods',
      descAr: 'فيزا، مدى، تحويل بنكي',
      descEn: 'Visa, Mada, Bank Transfer',
      completed: true,
      link: `/${lang}/statics`,
    },
    {
      id: 'shipping',
      titleAr: 'خيارات الشحن',
      titleEn: 'Shipping Options',
      descAr: 'مناطق التوصيل والأسعار',
      descEn: 'Delivery areas and pricing',
      completed: false,
      link: `/${lang}/statics`,
    },
    {
      id: 'design',
      titleAr: 'تصميم المتجر',
      titleEn: 'Store Design',
      descAr: 'الألوان والقوالب',
      descEn: 'Colors and templates',
      completed: false,
      link: `/${lang}/statics`,
    },
  ];
  const completed = 3;
  const total = 6;
  return (
    <div>
      {/* <StoreHeader lang={lang} /> */}
      <div className="progress-dashboard grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 my-6">
        <ProgressSummary lang={lang} total={total} completed={completed}/>
        <TasksPanel lang={lang} tasks={tasks} />
      </div>
      {/* <StoreActions lang={lang} /> */}
    </div>
  );
}