import WhatsApp from '@/app/components/marketing-tools/whatsApp/WhatsApp';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import LogoutButtom from '@/app/shared/whatsAppLogoutButtom';
import { metaObject } from '@/config/site.config';
import axios from 'axios';

export const metadata = {
  ...metaObject('WhatsApp - Marketing tools'),
};

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
        name: lang === 'ar' ? 'الواتساب' : 'WhatsApp',
      },
    ],
  };
  return <>
    <WhatsApp lang={lang} checksession={checksession} pageHeader={pageHeader} />
  </>;
}
