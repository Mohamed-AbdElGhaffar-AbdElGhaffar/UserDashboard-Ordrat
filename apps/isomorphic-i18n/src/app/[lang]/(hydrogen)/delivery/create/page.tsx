import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import AddDriver from '@/app/components/delivery/addDriver/AddDriver';
import { API_BASE_URL } from '@/config/base-url';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
export const metadata = {
  ...metaObject('Create Delivery'),
};

const API_URL = 'https://testapi.ordrat.com/api/Branch/GetByShopId/952E762C-010D-4E2B-8035-26668D99E23E';

async function getBranches(lang: string, shopId:string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Branch/GetByShopId/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch Branches');
    const data = await res.json();

    return data.map((branch: any) => ({
      label: branch.name,
      value: branch.id
    }));
  } catch (error) {
    console.error('Error fetching Branches:', error);
    return [];
  }
}

export default async function CreateDeliveryPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  // const branches = await getBranches(lang, shopId as string);
  const cookiebranches = GetCookiesServer('branches') as string;
  const cookiesBranches = JSON.parse(cookiebranches);
  const branches = cookiesBranches.map((branch: any) => ({
    label: lang == 'ar'? branch.nameAr : branch.nameEn,
    value: branch.id
  }))
  const pageHeader = {
    title: lang === 'ar' ? 'سائقي التوصيل' : 'Delivery Drivers',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        href: `/${lang}/delivery`,
        name: lang === 'ar' ? 'سائقي التوصيل' : 'Delivery Drivers',
      },
      {
        name: lang === 'ar' ? 'إضافة سائق' : 'Add Driver',
      },
    ],
  };  
  return (
    <>
      <div className='px-4'>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
        <AddDriver lang={lang} branchOption={branches} />
      </div>
    </>
  );
}
