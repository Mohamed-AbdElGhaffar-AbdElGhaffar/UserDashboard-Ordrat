import TablesPage from '@/app/components/tablesPage/TablesPage';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import { RoleServerExist } from '@/app/components/ui/roleServerExist/RoleServerExist';
import PageHeader from '@/app/shared/page-header';
import TableAddButton from '@/app/shared/tableAddButtom';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import axios from 'axios';
import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import { Button } from 'rizzui';

export const metadata = {
  ...metaObject('Tables'),
};

async function getTables(lang: string, shopId:string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Table/GetAllShopTables/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch tables');
    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
}

async function fetchShopData(lang: string, shopId:string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Shop/GetById/${shopId}`,
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

export default async function Tables({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const mainBranch = GetCookiesServer('mainBranch');  
  const tables = await getTables(lang, mainBranch as string);  
  const shopData = await fetchShopData(lang, shopId as string);
  const pageHeader = {
    title: lang === 'ar' ? 'الطاولات' : 'Tables',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'الطاولات' : 'Tables',
      },
    ],
  };

  
  const addTable = RoleServerExist([
    'sellerDashboard-tables-create',
  ]);
  return <>
  <div className='px-4'>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} >
      {addTable && (
        <TableAddButton className="mt-4 w-full @lg:mt-0 @lg:w-auto" buttonLabel={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} languages={shopData.languages} lang={lang}/>
      )}
    </PageHeader>
    <TablesPage  lang={lang} languages={shopData.languages} tables={tables}/>
  </div>
  </>;
}
