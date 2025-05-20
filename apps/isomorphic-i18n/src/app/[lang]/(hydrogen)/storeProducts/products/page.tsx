// import ProductsCategory from '@/app/components/storeProducts/products/productsCategory';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import ProductTable from '@/app/shared/tan-table/productTable';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import cn from '@utils/class-names';
import Link from 'next/link';
import { Button } from 'rizzui';
export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'المنتجات | إدارة وتحديث محتوى المتجر'
        : 'Products | Manage and Update Store Content',
      lang,
      undefined,
      lang === 'ar'
        ? 'أضف منتجات جديدة، حدد أسعارها، وقم بإدارتها بكفاءة لتعزيز المبيعات.'
        : 'Add new products, set prices, and manage inventory efficiently to boost sales.'
    ),
  };
}

async function getProducts(lang: string, shopId:string) {
  try {
    const queryParams = new URLSearchParams({
      PageNumber: (1).toString(),
      PageSize: (5).toString(),
    });
    const res = await fetch(`${API_BASE_URL}/api/Products/GetAll/${shopId}?${queryParams}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();

    return data.entities.map((item: any) => ({
      id: item.id,
      name: lang=='ar'? item.nameAr : item.nameEn || '----',
      categoryName: lang=='ar'? item.categoryNameAr : item.categoryNameEn || '----',
      oldPrice: `${item.oldPrice}` || 'NaN',
      price: `${item.finalPrice}` || 'NaN',
      status: item.isActive? lang === 'ar'
      ? `نشط`
      : `Active`:lang === 'ar'
      ? `غير نشط`
      : `Not Active`,
      isActive: item.isActive? `Active`:`Inactive`,
      isTopSelling: item.isTopSelling
      ? lang === 'ar' ? 'نعم' : 'Yes'
      : lang === 'ar' ? 'لا' : 'No',
    isTopRated: item.isTopRated
      ? lang === 'ar' ? 'نعم' : 'Yes'
      : lang === 'ar' ? 'لا' : 'No',
      numberOfSales: `${item.numberOfSales}` || '----',
      userName: lang=='ar'? item.nameAr : item.nameEn || '----',
      description: lang=='ar'? item.descriptionAr : item.descriptionEn || '----',
      imageUrl: item.images.length > 0 ? item.images[0].imageUrl : 'https://via.placeholder.com/150',
      createdAt: item.createdAt,
      lastUpdatedAt: item.lastUpdatedAt,
      stocks: item.stocks || [],
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Products({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const products = await getProducts(lang, shopId as string);

  const pageHeader = {
    title: lang === 'ar' ? 'منتجات المتجر' : 'Store Products',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'منتجات المتجر' : 'Store Products',
      },
      {
        name: lang === 'ar' ? 'اضافة منتجات' : 'Products',
      },
    ],
  };
  return <>
  <div className='px-4'>
    {/* <div className='flex w-full justify-center items-center gap-2.5'>
      <Button
        variant={'outline'}
        className={cn('z-1 relative flex shrink-0 gap-1.5 p-0')}
      >
        <Link href={`/${lang}/storeProducts/categories`} className='py-2 px-4' >
          {lang === 'ar' ? 'الأقسام' : 'Categories'}
        </Link>
      </Button>
      <Button
        variant={'solid'}
        className={cn('z-1 relative flex shrink-0 gap-1.5 p-0')}
      >
        <Link href={`/${lang}/storeProducts/products`} className='py-2 px-4'>
          {lang === 'ar' ? 'المنتجات' : 'Product'}
        </Link>
      </Button>
      <Button
        variant={'outline'}
        className={cn('z-1 relative flex shrink-0 gap-1.5 p-0')}
      >
        <Link href={`/${lang}/storeSetting/basicData`} className='py-2 px-4'>
          Theme
        </Link>
      </Button>
    </div> */}
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <ProductTable  lang={lang} products={products}/>

  </div>
  </>;
}
