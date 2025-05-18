import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import BranchesTable from '@/app/shared/tan-table/branchesTable';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import axios from 'axios';

export const metadata = {
  ...metaObject('Branches'),
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

async function getBranches(lang: string, shopId:string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Branch/GetByShopId/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();

    return data.map((branch: any) => ({
      id: branch.id,
      name: branch.name,
      userName: branch.name,
      totalSales:
        lang === 'ar'
          ? `${branch.monthlyPrice || 0} جنيه`
          : `${branch.monthlyPrice || 0} EGP`,
      status:
        branch.isActive? lang === 'ar'
          ? `نشط`
          : `Active`:lang === 'ar'
          ? `غير نشط`
          : `Not Active`,
      isActive: branch.isActive? `Active`:`Inactive`,
      openAt: branch.openAt,
      closedAt: branch.closedAt,
      deliveryTime: branch.deliveryTime,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Branches({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  console.log("shopId: ",shopId);
  const shopData = await fetchShopData(lang, shopId as string);
  const branches = await getBranches(lang, shopId as string);

  const pageHeader = {
    title: lang === 'ar' ? 'الفروع' : 'Branches',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'الفروع' : 'Branches',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <BranchesTable  lang={lang} languages={shopData.languages} branches={branches}/>
  </>;
}
