import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { Button } from 'rizzui';
import axios from 'axios';
import EditProduct from '@/app/shared/ecommerce/product/edit';
import NotFoundImg from '@public/notFound.svg';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import { API_BASE_URL } from '@/config/base-url';
import ChooseDelivery from '@/app/components/delivery/chooseDelivery/ChooseDelivery';
import NotFound from '@/app/not-found';

export const metadata = {
  ...metaObject('FAQ Details'),
};

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

export default async function AssignOrderToDelivery({
  params: { lang, id },
}: {
  params: { lang: string; id: string };
}) {
  const shopId = GetCookiesServer('shopId');
  const order = await getOrderById(id, lang);
  const branches = await getBranches(lang, shopId as string);
  const pageHeader = {
    title: lang === 'ar' ? 'تعيين الطلب' : 'Assign Order',
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
        name: lang === 'ar' ? 'تعيين الطلب' : 'Assign Order',
      },
      {
        name: `#${order?.orderNumber || ''}`,
      },
    ],
  };
  
  return (
    <>
      {order?
        <>
          {order.type != 2?
            <div className="my-10 text-center">
              <img src={NotFoundImg.src} alt="Not Found" className="mx-auto" width="750" height="500"/>
              <p className="font-medium text-xl">
                {lang === "ar"
                  ? "لا يوجد عنوان لهذا الطلب"
                  : "No Address for this order"}
              </p>
            </div>
          :
          <ChooseDelivery lang={lang} branches={branches} orderId={id} pageHeader={pageHeader}/>
          }
          {/* <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} /> */}
        </>
        :
        <NotFound />
      }
    </>
  );
}