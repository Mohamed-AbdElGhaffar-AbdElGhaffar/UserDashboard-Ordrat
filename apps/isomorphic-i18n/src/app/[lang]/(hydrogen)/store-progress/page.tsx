import StoreProgressLayout from '@/app/components/store-progress/StoreProgressLayout/StoreProgressLayout';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import BranchesTable from '@/app/shared/tan-table/branchesTable';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import axios from 'axios';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'الفروع | إدارة الفروع الخاصة بك'
        : 'Branches | Manage Your Store Locations',
      lang,
      undefined,
      lang === 'ar'
        ? 'أضف فروع جديدة وحدد بيانات الموقع والخدمات المتاحة بكل سهولة.'
        : 'Add new branches and define location and available services easily.'
    ),
  };
}

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

export default async function storeProgress({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const shopData = await fetchShopData(lang, shopId as string);

  const pageHeader = {
    title: lang === 'ar' ? 'أكمل إعداد متجرك' : 'Complete Store Progress',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'أكمل إعداد متجرك' : 'Complete Store Progress',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <StoreProgressLayout lang={lang} shopData={shopData} />
  </>;
}
