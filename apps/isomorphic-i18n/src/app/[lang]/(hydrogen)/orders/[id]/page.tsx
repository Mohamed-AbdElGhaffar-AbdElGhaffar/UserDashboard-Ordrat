import { fetchShopData } from '@/app/api/shop';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import NotFound from '@/app/not-found';
import OrderView from '@/app/shared/ecommerce/order/order-view'
import PageHeader from '@/app/shared/page-header';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import { CartProvider } from '@/store/quick-cart/cart.context';
import React from 'react';

export async function generateMetadata({
  params: { lang, id },
}: {
  params: {
    lang: string;
    id: string;
  };
}) {
  const order = await getOrderById(id, lang);

  return {
    ...metaObject(
      lang === 'ar'
        ? `تفاصيل الطلب #${order.orderNumber} | منصة أوردات`
        : `Order Details #${order.orderNumber} | Ordrat Platform`,
      lang,
      undefined,
      lang === 'ar'
        ? `شاهد تفاصيل الطلب رقم ${order.orderNumber} من خلال لوحة التحكم في منصة أوردات.`
        : `View order #${order.orderNumber} details through the Ordrat dashboard.`
    ),
  };
}

async function getOrderById(id: string, lang: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Order/GetById/GetById/${id}`, {
      headers: {
        'Accept-Language': lang,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch order');
    return await res.json();
  } catch (err) {
    console.error('Error fetching order:', err);
    return null;
  }
}
async function getEndUserById(id: string, lang: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/EndUser/GetById/${id}`, {
      headers: {
        'Accept-Language': lang,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch order');
    return await res.json();
  } catch (err) {
    console.error('Error fetching order:', err);
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
async function fetchDeliveryById(driverId?: string) {
  if (driverId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Delivery/GetDeliverById/${driverId}`, {
        headers: {
          // 'Accept-Language': lang || 'en',
        },
        cache: 'no-store',
      });
  
      if (!response.ok) throw new Error('Failed to fetch Branches');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching details:', error);
      return null;
    }
  }
}
async function fetchOrderLocationDirection(lang: string, orderId?: string) {
  if (orderId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Order/GetLocationDirectionForOrder/${orderId}`, {
        headers: {
          'Accept-Language': lang || 'en',
        },
        cache: 'no-store',
      });
  
      if (!response.ok) throw new Error('Failed to fetch Location&Direction');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Location&Direction:', error);
      return null;
    }
  }
}
const GUID_EMPTY = "00000000-0000-0000-0000-000000000000";
export default async function OrderId({
  params: { lang, id },
}: {
  params: {
    lang: string;
    id: string;
  };
})  {
  const order = await getOrderById(id, lang);
  const pageHeader = {
    title: lang === 'ar' ? 'الطلبات' : 'Orders',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        href: `/${lang}/orders`,
        name: lang === 'ar' ? 'الطلبات' : 'Orders',
      },
      {
        name: `#${order?.orderNumber || ''}`,
      },
    ],
  };

  const endUser = await getEndUserById(order?.endUserId, lang);
  const shopId = GetCookiesServer('shopId');
  // const branches = await getBranches(lang, shopId as string);
  const shopData = await fetchShopData(lang, shopId as string);
  const cookiebranches = GetCookiesServer('branches') as string;
  const cookiesBranches = JSON.parse(cookiebranches);
  const branches = cookiesBranches?.map((branch: any) => ({
    id: branch.id,
    name: lang == 'ar'? branch.nameAr : branch.nameEn,
    value: lang == 'ar'? branch.nameAr.toLowerCase().replace(/\s+/g, '-') : branch.nameEn.toLowerCase().replace(/\s+/g, '-'),
    icon: ''
  }));
  const deliveryInfo = order.type === 2 && (order.status === 2 || order.status === 3 || order.status === 4) && order.deliveryId != GUID_EMPTY || null
    ? await fetchDeliveryById(order.deliveryId)
    : null;
  const LocationDirection = order.type === 2 && (order.status === 2 || order.status === 3) && order.deliveryId != GUID_EMPTY || null
    ? await fetchOrderLocationDirection(lang ,order.id)
    : null;

  return <>
  {order?
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CartProvider>
        <OrderView 
          lang={lang} 
          initialOrder={order} 
          orderPrint={order} 
          userData={endUser} 
          phone={endUser?.phoneNumber || ''} 
          branches={branches} 
          delivery={deliveryInfo} 
          currencyAbbreviation={shopData?.currencyAbbreviation}
          initialLocationDirection={LocationDirection}
        />
      </CartProvider>
    </>
  :
    <NotFound />
  }
  </>
}