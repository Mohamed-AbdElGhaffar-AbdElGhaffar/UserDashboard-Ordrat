import { metaObject } from '@/config/site.config';
import AllPlans from '@/app/components/plans/allPlans/AllPlans';
import MyPlan from '@/app/components/plans/myPlan/MyPlan';
import Privacy from '@/app/components/term/privacy/Privacy';
import PageHeader from '@/app/shared/page-header';
import WidgetCard from '@components/cards/widget-card';
import axios from 'axios';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'سياسة الخصوصية | حماية بيانات العملاء'
        : 'Privacy Policy | Protecting Customer Data',
      lang,
      undefined,
      lang === 'ar'
        ? 'تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية عند استخدام منصتنا.'
        : 'Learn how we collect, use, and protect your personal data when using our platform.'
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

export default async function PrivacyPolicy({
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
    title: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        href: `/${lang}/term/faq`,
        name: lang === 'ar' ? 'سياسات المتجر' : 'Store Policies',
      },
      {
        name: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <Privacy lang={lang} languages={shopData.languages} />
    <WidgetCard
      title={lang === 'ar' ? 'إرشادات الخصوصية' : 'Privacy Guidelines'}
      className="mt-5"
    >
      <ul className="ps-5 list-disc text-[#4A5568] font-medium text-base mt-3">
        {lang === 'ar' ? (
          <>
            <li className="mb-2">نحن لا نشارك بياناتك الشخصية مع أي طرف ثالث دون موافقتك.</li>
            <li className="mb-2">يتم تخزين جميع المعلومات باستخدام تقنيات أمان متقدمة لحمايتك.</li>
            <li className="mb-2">يمكنك طلب حذف بياناتك في أي وقت عبر إعدادات الحساب.</li>
            <li>نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتقديم محتوى مخصص.</li>
          </>
        ) : (
          <>
            <li className="mb-2">We do not share your personal data with third parties without your consent.</li>
            <li className="mb-2">All information is stored using advanced security technologies for your protection.</li>
            <li className="mb-2">You can request to delete your data anytime through account settings.</li>
            <li>We use cookies to improve your experience and deliver personalized content.</li>
          </>
        )}
      </ul>
    </WidgetCard>

  </>;
}
