import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { Button } from 'rizzui';
import axios from 'axios';
import EditProduct from '@/app/shared/ecommerce/product/edit';
import NotFound from '@/app/not-found';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'تعديل منتج | حدّث بيانات منتجاتك بسرعة'
        : 'Edit Product | Update Your Product Details Quickly',
      lang,
      undefined,
      lang === 'ar'
        ? 'قم بتعديل تفاصيل المنتج مثل الاسم، السعر، الصور، أو الفئة لتحسين تجربة العملاء.'
        : 'Update product details such as name, price, images, or category to enhance customer experience.'
    ),
  };
}

async function fetchProductById(shopId: string, productId: string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Products/GetById/${shopId}/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function fetchShopData(lang: string, shopId: string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Shop/GetById/${shopId}`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
    console.log("Language: ", response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching date:', error);
    return null;
  }
}

async function fetchProducts(lang: string, shopId: string) {
  try {
    const response = await axios.get(
      `https://testapi.ordrat.com/api/Products/GetAll/${shopId}?PageNumber=1&PageSize=2000`,
      {
        headers: {
          'Accept-Language': lang,
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching date:', error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const { lang, id } = params;
  const shopId = GetCookiesServer('shopId');
  const product = await fetchProductById(shopId as string, id);
  const products = await fetchProducts(lang, shopId as string);
  const shopData = await fetchShopData(lang, shopId as string);
  console.log("product: ", product);

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
        name: lang === 'ar' ? 'المنتجات' : 'Products',
      },
      {
        name: lang === 'ar' ? 'تعديل' : 'Update',
      },
    ],
  };

  return (
    <>
      {product ?
        <div className="">
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
          <EditProduct lang={lang} product={product} allProducts={products.entities.filter((p: any) => p.id !== id)} currencyAbbreviation={shopData.currencyAbbreviation} languages={shopData.languages} />
        </div>
        :
        <NotFound />
      }
    </>
  );
}