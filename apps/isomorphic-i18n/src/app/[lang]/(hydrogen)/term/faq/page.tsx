import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import FaqTable from '@/app/shared/tan-table/faqTable';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import axios from 'axios';

export const metadata = {
  ...metaObject('FAQ'),
};
 
async function fetchShopData(lang: string, shopId:string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Shop/GetById/${shopId}`,
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

async function getShopFAQs(lang: string, shopId:string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/FAQCategory/GetShopFAQs/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      title: item.title,
      userName: item.name,
      metaDescription: item.metaDescription,
      image: item.imageUrl,
      faqNumber: item.faQs.length,
      faQs: item.faQs,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function FAQ({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const shopData = await fetchShopData(lang, shopId as string);
  const shopFAQs = await getShopFAQs(lang, shopId as string);

  const pageHeader = {
    title: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQs',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQs',
      },
    ],
  };
  return<>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <FaqTable  lang={lang} languages={shopData.languages} shopFAQs={shopFAQs} />
  </>;
}
