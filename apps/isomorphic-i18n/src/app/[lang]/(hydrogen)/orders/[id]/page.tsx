import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import NotFound from '@/app/not-found';
import OrderView from '@/app/shared/ecommerce/order/order-view'
import PageHeader from '@/app/shared/page-header';
import { API_BASE_URL } from '@/config/base-url';
import { CartProvider } from '@/store/quick-cart/cart.context';
import React from 'react';

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

export default async function OrderId({
  params: { lang, id },
}: {
  params: {
    lang: string;
    id: string;
  };
})  {
  const order = await getOrderById(id, lang);
  console.log("order: ",order);
  
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
  const cookiebranches = GetCookiesServer('branches') as string;
  const cookiesBranches = JSON.parse(cookiebranches);
  const branches = cookiesBranches?.map((branch: any) => ({
    id: branch.id,
    name: lang == 'ar'? branch.nameAr : branch.nameEn,
    value: lang == 'ar'? branch.nameAr.toLowerCase().replace(/\s+/g, '-') : branch.nameEn.toLowerCase().replace(/\s+/g, '-'),
    icon: ''
  }))
  console.log("endUser: ",endUser);
  console.log("branches: ",branches);
  return <>
  {order?
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CartProvider>
        <OrderView lang={lang} initialOrder={order} phone={endUser?.phoneNumber || ''} branches={branches} />
      </CartProvider>
    </>
  :
    <NotFound />
  }
  </>
}