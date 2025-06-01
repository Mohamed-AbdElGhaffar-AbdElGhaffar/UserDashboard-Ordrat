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
        ? 'أكمل إعداد متجرك'
        : 'Complete Store Progress',
      lang,
      undefined,
      lang === 'ar'
      ? 'تابع تنفيذ المهام الأساسية لإعداد متجرك وابدأ البيع بسرعة وكفاءة.'
      : 'Follow the essential steps to complete your store setup and start selling quickly and efficiently.'  
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

async function fetchShopHighPriority(lang: string, shopId:string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/ShopHighPriority/items?shopId=${shopId}`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
    
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
  const shopHighPriority = await fetchShopHighPriority(lang, shopId as string);

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
  console.log("shopHighPriority.tasks: ",shopHighPriority.tasks);
  
  return <>
    <StoreProgressLayout 
      lang={lang} 
      shopData={shopData} 
      initialTasks={shopHighPriority.tasks} 
      initialTotal={shopHighPriority.summary.total} 
      initialCompleted={shopHighPriority.summary.completed}
      pageHeader={pageHeader}
    />
  </>;
}
