import DriversListPage from '@/app/components/delivery/Delivery';
import Delivery from '@/app/components/delivery/Delivery';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import POSSlider from '@/app/components/ui/posSlider/POSSlider';
import { RoleServerExist } from '@/app/components/ui/roleServerExist/RoleServerExist';
import PageHeader from '@/app/shared/page-header';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { Button } from 'rizzui';

export const metadata = {
  ...metaObject('Delivery'),
};

// const API_URL = 'https://testapi.ordrat.com/api/Branch/GetByShopId/952E762C-010D-4E2B-8035-26668D99E23E';

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
      id: branch.id,
      name: branch.name,
      value: branch.name.toLowerCase().replace(/\s+/g, '-'),
      icon: ''
    }));
  } catch (error) {
    console.error('Error fetching Branches:', error);
    return [];
  }
}

export default async function DeliveryDrivers({
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
    id: branch.id,
    name: lang == 'ar'? branch.nameAr : branch.nameEn,
    value: lang == 'ar'? branch.nameAr.toLowerCase().replace(/\s+/g, '-') : branch.nameEn.toLowerCase().replace(/\s+/g, '-'),
    icon: ''
  }))
  const pageHeader = {
    title: lang === 'ar' ? 'سائقي التوصيل' : 'Delivery Drivers',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'سائقي التوصيل' : 'Delivery Drivers',
      },
    ],
  };

  
  const addDelivery = RoleServerExist([
    'sellerDashboard-delivery-create',
  ]);
  return <>
  <div className='px-4'>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} >
      {addDelivery && (
        <Link
          href={`/${lang}/delivery/create`}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
            {lang === 'ar' ? 'إضافة سائق' : 'Add Driver'}
          </Button>
        </Link>
      )}
    </PageHeader>
    <POSSlider allItems={lang=='ar'?'كل السائقين':'All Drivers'} lang={lang} filterOptions={branches}/>
    <DriversListPage  lang={lang}  filterOptions={branches}/>
  </div>
  </>;
}
