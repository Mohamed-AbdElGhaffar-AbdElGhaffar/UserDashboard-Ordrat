import { metaObject } from '@/config/site.config';
import Refund from '@/app/components/term/refund/Refund';
import PageHeader from '@/app/shared/page-header';
import WidgetCard from '@components/cards/widget-card';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import axios from 'axios';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'سياسة الاسترجاع | شروط استرجاع الطلبات'
        : 'Refund Policy | Terms for Returning Orders',
      lang,
      undefined,
      lang === 'ar'
        ? 'اطلع على الشروط والأحكام الخاصة باسترجاع أو إلغاء الطلبات.'
        : 'Read the terms and conditions for returning or canceling orders.'
    ),
  };
}

async function fetchShopData(lang: string, shopId:string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Shop/GetById/${shopId}`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
    console.log("Language: ",response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching date:', error);
    return null;
  }
}
export default async function RefundPolicy({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
    const shopId = GetCookiesServer('shopId');
      console.log("shopId: ",shopId);
      const shopData = await fetchShopData(lang, shopId as string);
        
  const pageHeader = {
    title: lang === 'ar' ? 'سياسة الاسترداد' : 'Refund Policy',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'سياسة الاسترداد' : 'Refund Policy',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <Refund lang={lang} languages={shopData.languages}  />
    <WidgetCard
      title={lang === 'ar' ? 'إرشادات الاسترداد' : 'Refund Guidelines'}
      className="mt-5"
    >
      <ul className="ps-5 list-disc text-[#4A5568] font-medium text-base mt-3">
        {lang === 'ar' ? (
          <>
            <li className="mb-2">يجب تقديم طلب الاسترداد خلال 7 أيام من تاريخ الشراء.</li>
            <li className="mb-2">يُشترط أن يكون المنتج في حالته الأصلية وغير مستخدم.</li>
            <li className="mb-2">يتم معالجة الاسترداد خلال 3-5 أيام عمل بعد الموافقة.</li>
            <li>قد يتم خصم رسوم شحن أو خدمات حسب الحالة.</li>
          </>
        ) : (
          <>
            <li className="mb-2">Refund requests must be submitted within 7 days of purchase.</li>
            <li className="mb-2">The product must be unused and in its original condition.</li>
            <li className="mb-2">Refunds are processed within 3–5 business days after approval.</li>
            <li>Shipping or service fees may be deducted depending on the case.</li>
          </>
        )}
      </ul>
    </WidgetCard>

  </>;
}
