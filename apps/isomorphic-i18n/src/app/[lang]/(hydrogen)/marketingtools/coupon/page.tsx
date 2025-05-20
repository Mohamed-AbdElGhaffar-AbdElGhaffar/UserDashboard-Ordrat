import PageHeader from '@/app/shared/page-header';
import CouponTable from '@/app/shared/tan-table/couponTable';
import { metaObject } from '@/config/site.config';
import WidgetCard from '@components/cards/widget-card';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'الكوبونات | قدّم خصومات لجذب العملاء'
        : 'Coupons | Offer Discounts to Attract Customers',
      lang,
      undefined,
      lang === 'ar'
        ? 'أنشئ كوبونات خصم مخصصة لزيادة المبيعات وتحفيز العملاء على الشراء.'
        : 'Create custom discount coupons to boost sales and encourage purchases.'
    ),
  };
}

export default function Coupon({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const pageHeader = {
    title: lang === 'ar' ? 'الكوبون' : 'Coupon',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        href: `/${lang}/marketingtools`,
        name: lang === 'ar' ? 'ادوات التسويق' : 'Marketing Tools',
      },
      {
        name: lang === 'ar' ? 'الكوبون' : 'Coupon',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <CouponTable lang={lang} />

    <WidgetCard title=
      {lang === 'ar' ? 'نصائح وإرشادات' : 'Tips and advice'}
      className='mt-5'
    >
      <ul className="ps-5 list-disc text-[#4A5568] font-medium text-base mt-3">
        {lang === 'ar' ? (
          <>
            <li className="mb-2">استخدم كوبونات النسبة المئوية للحملات الترويجية العامة والكوبونات الرقمية للمنتجات عالية القيمة.</li>
            <li className="mb-2">حدد تاريخ انتهاء واضح للكوبونات لخلق شعور بالإلحاح لدى العملاء.</li>
            <li className="mb-2">تتبع عدد مرات استخدام الكوبونات لتقييم فعالية حملاتك التسويقية.</li>
            <li>استخدم كوبونات إضافية للعملاء المميزين كأداة للاحتفاظ بهم.</li>
          </>
        ) : (
          <>
            <li className="mb-2">Use percentage-based coupons for general promotions and digital coupons for high-value items.</li>
            <li className="mb-2">Set a clear expiration date to create urgency for your customers.</li>
            <li className="mb-2">Track coupon usage to measure your campaign’s effectiveness.</li>
            <li>Reward loyal customers with exclusive coupons to encourage retention.</li>
          </>
        )}
      </ul>
    </WidgetCard>

  </>;
}
