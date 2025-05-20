import WhatsApp from '@/app/components/marketing-tools/whatsApp/WhatsApp';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import LogoutButtom from '@/app/shared/whatsAppLogoutButtom';
import { metaObject } from '@/config/site.config';
import axios from 'axios';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'واتساب | تواصل فوري مع عملائك'
        : 'WhatsApp | Instant Communication with Your Customers',
      lang,
      undefined,
      lang === 'ar'
        ? 'قم بربط واتساب بالمتجر لتلقي الاستفسارات والطلبات مباشرة من الزبائن.'
        : 'Connect WhatsApp to your store to receive inquiries and orders instantly.'
    ),
  };
}

async function fetchChecksession(shopId: string, lang: string) {
  try {
    const response = await axios.get(`https://testapi.ordrat.com/api/Whatsapp/checksession/${shopId}`, {
      headers: {
        'Accept': '*/*',
        'Accept-Language': lang,
      },
    })
    return response.data;
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
}

export default async function WhatsAppPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');

  const checksession = await fetchChecksession(shopId as string, lang);
  console.log("checksession: ",checksession);
  
  const pageHeader = {
    title: lang === 'ar' ? 'الواتساب' : 'WhatsApp',
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
        name: lang === 'ar' ? 'الواتساب' : 'WhatsApp',
      },
    ],
  };
  return <>
    <WhatsApp lang={lang} checksession={checksession} pageHeader={pageHeader} />
  </>;
}
