import { metaObject } from '@/config/site.config';
import AllPlans from '@/app/components/plans/allPlans/AllPlans';
import MyPlan from '@/app/components/plans/myPlan/MyPlan';
import PageHeader from '@/app/shared/page-header';
import Pay from '@/app/components/pay/Pay';

export const metadata = {
  ...metaObject('Plans'),
};

export default function pay({
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
    <Pay lang={lang} />
  </>;
}
