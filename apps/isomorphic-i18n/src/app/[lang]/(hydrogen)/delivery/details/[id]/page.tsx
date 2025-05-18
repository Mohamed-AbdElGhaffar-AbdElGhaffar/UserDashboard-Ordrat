import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { Button } from 'rizzui';
import axios from 'axios';
import EditProduct from '@/app/shared/ecommerce/product/edit';
import DriverDetails from '@/app/components/delivery/Details/Details';
import NotFound from '@/app/not-found';

export const metadata = {
  ...metaObject('Delivery Details'),
};

async function fetchDeliveryById(driverId: string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Delivery/GetDeliverById/${driverId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
}
async function fetchDeliveryOrderStats(driverId: string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Delivery/GetNumbersOfOrdersByDeliveryId/${driverId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching details:', error);
    return null;
  }
}

export default async function DetailsPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const { lang, id } = params;

  const details = await fetchDeliveryById(id);
  const orderStats = await fetchDeliveryOrderStats(id);

  const pageHeader = {
    title: lang === 'ar' ? 'منتجات المتجر' : 'Store Products',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        href: `/${lang}/storeProducts/products`,
        name: lang === 'ar' ? 'منتجات المتجر' : 'Store Products',
      },
      {
        href: `/${lang}/delivery`,
        name: lang === 'ar' ? 'سائقي التوصيل' : 'Delivery Drivers',
      },
      {
        name: lang === 'ar' ? 'تفاصيل' : 'Details',
      },
    ],
  };

  return (
    <>
      {details?
        <div>
          <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
            {/* <Link
              href={`/${lang}/storeProducts/products`}
              className="mt-4 w-full @lg:mt-0 @lg:w-auto"
            >
              <Button as="span" className="w-full @lg:w-auto">
                {lang === 'ar' ? 'الغاء' : 'Cancel'}
              </Button>
            </Link> */}
          </PageHeader>
          {/* Pass the fetched product data to the CreateEditProduct component */}
          <DriverDetails lang={lang} driverDetails={details} orderStats={orderStats} />
        </div>
        :
        <NotFound />
      }
    </>
  );
}