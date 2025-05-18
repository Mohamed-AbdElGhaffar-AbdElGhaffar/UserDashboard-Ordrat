import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import AddDriver from '@/app/components/delivery/addDriver/AddDriver';
import Chat from '@/app/components/ui/Chat/Chat';
import { API_BASE_URL } from '@/config/base-url';
export const metadata = {
  ...metaObject('Delivery Chat'),
};

const API_URL = 'https://testapi.ordrat.com/api/Branch/GetByShopId/952E762C-010D-4E2B-8035-26668D99E23E';

export default async function CreateDeliveryPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
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
        name: lang === 'ar' ? 'محادثة' : 'chat',
      },
    ],
  };  
  return (
    <>
      <div className='mb-[-1.5rem] lg:mb-[-2rem] 4xl:mb-[-2.25rem] md:mx-[-1.25rem] lg:mx-[-1.5rem] 3xl:mx-[-2rem] 4xl:mx-[-2.5rem] mt-[-24px] lg:mt-[-28px]'>
        {/* <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} /> */}
        <Chat lang={lang}/>
      </div>
    </>
  );
}
