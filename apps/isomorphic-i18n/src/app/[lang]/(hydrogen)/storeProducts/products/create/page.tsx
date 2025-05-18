import Link from 'next/link';
import { PiPlusBold } from 'react-icons/pi';
import CreateEditProduct from '@/app/shared/ecommerce/product/create-edit';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui';
import { routes } from '@/config/routes';
import cn from '@utils/class-names';
import axios from 'axios';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';

export const metadata = {
  ...metaObject('Create Product'),
};

async function fetchProducts(lang: string, shopId:string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Products/GetAll/${shopId}?PageNumber=1&PageSize=2000`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
    // console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching date:', error);
    return null;
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

export default async function CreateProductPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');

  const products = await fetchProducts(lang, shopId as string);
  const shopData = await fetchShopData(lang, shopId as string);

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
        href: `/${lang}/storeProducts/products`,
        name: lang === 'ar' ? 'اضافة منتجات' : 'Products',
      },
      {
        name: lang === 'ar' ? 'اضافة' : 'Add',
      },
    ],
  };  return (
    <>
      <div className=''>
        <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
          {/* <Link
            href={routes.eCommerce.createProduct}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Product
            </Button>
          </Link> */}
        </PageHeader>

        <CreateEditProduct lang={lang} allProducts={products.entities} languages={shopData.languages}/>
      </div>
    </>
  );
}
