import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { POS_CART_KEY } from '@/config/constants';
import { metaObject } from '@/config/site.config';
import POSPageView from '@/app/shared/point-of-sale';
import POSDrawer from '@/app/shared/point-of-sale/pos-drawer';
import PosSearch from '@/app/shared/point-of-sale/pos-search';
// import { CartProvider } from '../../../../../../isomorphic/src/store/quick-cart/cart.context';
import { CartProvider } from '@/store/quick-cart/cart.context';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'نقطة البيع | نظام إدارة مبيعات المتجر'
        : 'Point of Sale | In-Store Sales Management System',
      lang,
      undefined,
      lang === 'ar'
        ? 'إدارة مبيعاتك داخل المتجر من خلال نظام نقطة بيع متكامل.'
        : 'Manage your in-store sales using an integrated point of sale system.'
    ),
  };
}
const API_URL = 'https://testapi.ordrat.com/api/Category/GetAll/952E762C-010D-4E2B-8035-26668D99E23E';
import PizzaIcon from '@components/icons/pizza';
import { API_BASE_URL } from '@/config/base-url';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';

async function getCategories(lang: string, shopId:string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Category/GetAll/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();

    return data.map((category: any) => ({
      id: category.id,
      name: category.name,
      value: category.name.toLowerCase().replace(/\s+/g, '-'),
      icon: category.bannerUrl || '',
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

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

async function fetchShopData(lang: string, shopId:string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Shop/GetById/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch Shop Data');
    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching Shop Data:', error);
    return [];
  }
}

async function fetchBranchZones(shopId: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/Branch/GetByShopId/${shopId}`,
      {
        headers: {
          Accept: "*/*",
          "Accept-Language": "en",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch branch zones");
    }

    const data = await res.json();
    return data.map((branch: any) => ({
      id: branch.id,
      lat: branch.centerLatitude,
      lng: branch.centerLongitude,
      zoonRadius: branch.coverageRadius,
    }));
  } catch (error) {
    console.error("Error fetching branch zones:", error);
    return [];
  }
}

async function fetchDefaultUsers(lang: string, shopId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/EndUser/GetAll/${shopId}?PageNumber=1&PageSize=10&Name=Default+User`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch default users');
    const data = await res.json();

    return data.entities || [];
  } catch (error) {
    console.error('Error fetching default users:', error);
    return [];
  }
}

export default async function PointOfSalePage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const mainBranch = GetCookiesServer('mainBranch');
  const categories = await getCategories(lang, shopId as string);
  const allDatatables = await getTables(lang, mainBranch as string);
  const tables = allDatatables.map((table: any) => ({
    value: table.id,
    label: lang === 'ar' ? `(${table.tableNumber.toString()}) ${table.descriptionAr}` : `(${table.tableNumber.toString()}) ${table.descriptionEn}`,
    // label: table.tableNumber.toString(),
  }));;
  // const branches = await getBranches(lang, shopId as string);
  const cookiebranches = GetCookiesServer('branches') as string;
  const cookiesBranches = JSON.parse(cookiebranches);
  const branches = cookiesBranches.map((branch: any) => ({
    label: lang == 'ar'? branch.nameAr : branch.nameEn,
    value: branch.id
  }))
  const shopData = await fetchShopData(lang, shopId as string);
  const branchZones = await fetchBranchZones(shopId as string);
  const defaultUsers = await fetchDefaultUsers(lang, shopId as string);
  console.log("branchZones:", branchZones);
  const pageHeader = {
    title: lang =='ar'?'الكاشير':'Point of Sale (POS)',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang =='ar'?'المتجر':'Store',
      },
      {
        name: lang =='ar'?'الكاشير':'Point of Sale',
      },
    ],
  };
  
  return (
    <CartProvider cartKey={POS_CART_KEY}>
      <div>
        <PageHeader
          title={pageHeader.title}
          breadcrumb={pageHeader.breadcrumb}
          className="[&_h2]:font-lexend [&_h2]:font-bold"
        >
          <PosSearch lang={lang}/>
        </PageHeader>
        <POSPageView 
          lang={lang} 
          filterOptions={categories} 
          tables={tables}
          defaultUser={defaultUsers.id || "9fd5a273-7273-4a2b-ab50-0bc908d3381e"} 
          branchOption={branches} 
          allDatatables={allDatatables} 
          languages={shopData.languages} 
          branchZones={branchZones}
          freeShppingTarget={shopData.freeShppingTarget}
          currencyAbbreviation={shopData.currencyAbbreviation}
        />
        <POSDrawer 
          className="xl:hidden" 
          lang={lang} 
          tables={tables}
          defaultUser={defaultUsers.id || "9fd5a273-7273-4a2b-ab50-0bc908d3381e"} 
          branchOption={branches} 
          allDatatables={allDatatables} 
          languages={shopData.languages} 
          branchZones={branchZones}
          freeShppingTarget={shopData.freeShppingTarget}
        />
      </div>
    </CartProvider>
  );
}
