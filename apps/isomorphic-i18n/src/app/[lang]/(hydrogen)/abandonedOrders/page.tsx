import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import AbandonedOrdersTable from '@/app/shared/tan-table/abandonedOrdersTable';
import BranchesTable from '@/app/shared/tan-table/branchesTable';
import { metaObject } from '@/config/site.config';
import WidgetCard from '@components/cards/widget-card';
import axios from 'axios';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'الطلبات المهجورة | استرجع العملاء الذين لم يكملوا الطلب'
        : 'Abandoned Orders | Recover Lost Sales from Incomplete Orders',
      lang,
      undefined,
      lang === 'ar'
        ? 'تعرّف على الطلبات التي لم تُكمل، وتواصل مع العملاء لإعادة تنشيطها.'
        : 'Identify incomplete orders and re-engage customers to complete their purchase.'
    ),
  };
}
export default async function AbandonedOrders({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  console.log("shopId: ", shopId);

  const pageHeader = {
    title: lang === 'ar' ? 'الطلبات' : 'Abandoned Orders',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'الطلبات المهجورة' : 'Abandoned Orders',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <AbandonedOrdersTable lang={lang} shopId={shopId as string} />
    <WidgetCard className='mt-5' title={lang === 'ar' ? 'ارشادات التواصل' : 'Contact Information Tips'}>
      <ul className="ps-5 list-disc text-[#4A5568] font-medium text-base mt-3">
        <li className='mb-2'>
          {lang === 'ar' ?
            'تواصل مع العميل عبر رقم الهاتف المدرج، ويفضل استخدام تطبيق الواتساب لسرعة التواصل.' :
            'Reach out to the customer using the provided phone number. Prefer using WhatsApp for quick communication.'}
        </li>
        <li className='mb-2'>
          {lang === 'ar' ?
            'تأكد من التحقق من صحة رقم الهاتف قبل محاولة الاتصال.' :
            'Verify the phone number before attempting to contact.'}
        </li>
        <li className='mb-2'>
          {lang === 'ar' ?
            'يمكنك إرسال رسالة نصية بسيطة توضح رغبتك في استكمال الطلب.' :
            'You can send a simple text message explaining your intention to complete the order.'}
        </li>
        <li className='mb-2'>
          {lang === 'ar' ?
            'في حالة عدم الرد، حاول مرة أخرى في وقت لاحق مع مراعاة أوقات الراحة.' :
            'If there is no response, try again later while considering appropriate contact times.'}
        </li>
        <li>
          {lang === 'ar' ?
            'احتفظ بسجل المحادثات لمعرفة التحديثات والاستجابة من العميل.' :
            'Keep a record of the conversation to track updates and customer responses.'}
        </li>
      </ul>
    </WidgetCard>
  </>;
}
