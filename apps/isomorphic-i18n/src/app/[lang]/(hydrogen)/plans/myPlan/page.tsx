import { metaObject } from '@/config/site.config';
import AllPlans from '@/app/components/plans/allPlans/AllPlans';
import MyPlan from '@/app/components/plans/myPlan/MyPlan';
import PageHeader from '@/app/shared/page-header';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'باقة متجري | متابعة تفاصيل اشتراكك'
        : 'My Plan | Track Your Subscription Details',
      lang,
      undefined,
      lang === 'ar'
        ? 'تابع حالة اشتراكك، تاريخ التجديد، والمزايا الحالية لباقتك.'
        : 'Track your current subscription status, renewal date, and available features.'
    ),
  };
}

export default function Plan({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const pageHeader = {
    title: lang === 'ar' ? 'خطتي' : 'My Plan',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'خطتي' : 'My Plan',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <MyPlan lang={lang} />
  </>;
}
