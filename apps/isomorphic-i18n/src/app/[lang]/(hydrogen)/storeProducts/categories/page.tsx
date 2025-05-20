import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import CategoriesTable from '@/app/shared/tan-table/categoriesTable';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import axios from 'axios';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'تصنيفات المنتجات | تنظيم فعال لمحتوى متجرك'
        : 'Product Categories | Efficient Store Organization',
      lang,
      undefined,
      lang === 'ar'
        ? 'أنشئ ونسّق التصنيفات لتسهل على العملاء تصفح المنتجات والعثور عليها.'
        : 'Create and manage categories to help customers browse and find products easily.'
    ),
  };
}

async function fetchShopData(lang: string, shopId:string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Shop/GetById/${shopId}`,
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
      userName: category.name,
      bannerUrl: category.bannerUrl,
      status:
        category.isActive? lang === 'ar'
          ? `نشط`
          : `Active`:lang === 'ar'
          ? `غير نشط`
          : `Not Active`,
      isActive: category.isActive? `Active`:`Inactive`,
      priority: category.priority,
      numberOfColumns: lang === 'ar'? `الشكل ${ category.numberOfColumns}`
      : `Design ${ category.numberOfColumns}`,
      numberOfProducts: category.numberOfProducts,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Categories({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const shopData = await fetchShopData(lang, shopId as string);
  const categories = await getCategories(lang, shopId as string);

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
        name: lang === 'ar' ? 'الأقسام' : 'Categories',
      },
    ],
  };
  return <>
  <div className='px-4'>
    {/* <div className='flex w-full justify-center items-center gap-2.5'>
      <Button
        variant={'solid'}
        className={cn('z-1 relative flex shrink-0 gap-1.5 p-0')}
      >
        <Link href={`/${lang}/storeProducts/categories`} className='py-2 px-4' >
          {lang === 'ar' ? 'الأقسام' : 'Categories'}
        </Link>
      </Button>
      <Button
        variant={'outline'}
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
    <CategoriesTable  lang={lang} languages={shopData.languages} categories={categories}/>
  </div>
  </>;
}
