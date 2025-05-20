import Welcome from '@/app/components/marketing-tools/welcomeComponent/welcomeComponent';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import BranchesTable from '@/app/shared/tan-table/branchesTable';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'البانر الإعلاني | اجذب انتباه عملائك بصريًا'
        : 'Banner | Capture Customer Attention Visually',
      lang,
      undefined,
      lang === 'ar'
        ? 'أضف بانرات دعائية جذابة لترويج العروض والمنتجات في الصفحة الرئيسية.'
        : 'Add promotional banners to highlight offers and products on the homepage.'
    ),
  };
}
async function getBanners(lang: string, shopId:string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Banner/GetAll/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch Banners');
    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching Banners:', error);
    return [];
  }
}

export default async function Banner({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const banners = await getBanners(lang, shopId as string);

  const pageHeader = {
    title: lang === 'ar' ? 'البانر' : 'Banner',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        href: `/${lang}/marketingtools`,
        name: lang === 'ar' ? 'ادوات التسويق' : 'Marketing Tools',
      },
      {
        name: lang === 'ar' ? 'البانر' : 'Banner',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <Welcome lang={lang} data={banners}/>
  </>;
}
