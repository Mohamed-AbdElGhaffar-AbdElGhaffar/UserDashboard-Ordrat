import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import PageHeader from '@/app/shared/page-header';
import BranchesTable from '@/app/shared/tan-table/branchesTable';
import PrinterTable from '@/app/shared/tan-table/printerTable';
import { API_BASE_URL } from '@/config/base-url';
import { metaObject } from '@/config/site.config';
import axios from 'axios';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'الطابعة | إدارة إعدادات الطابعة'
        : 'Printer | Manage Printer Settings',
      lang,
      undefined,
      lang === 'ar'
        ? 'قم بإعداد وتخصيص إعدادات الطابعة الخاصة بك بكل سهولة.'
        : 'Configure and manage your printer settings with ease.'
    ),
  };
}

async function getCategories(lang: string, shopId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Category/GetAll/${shopId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Failed to fetch categories');

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getPrinters(lang: string, branchId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Printer/GetAllShopPrinters/${branchId}`, {
      headers: {
        'Accept-Language': lang || 'en',
      },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Failed to fetch printers');
    const data = await response.json();

    return data.map((printer: any) => ({
      id: printer.id,
      name: printer.name,
      ip: printer.ip,
      branch: printer.branchName,
      totalCategories: printer.categoryPrinterDtos?.length ?? 0,
      categoryPrinterDtos: printer.categoryPrinterDtos || [],
      userName: printer.name,
    }));
  } catch (error) {
    console.error('Error fetching printers:', error);
    return [];
  }
}

export default async function Printer({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const mainBranch = GetCookiesServer('mainBranch');
  const printers = await getPrinters(lang, mainBranch as string);
  const categories = await getCategories(lang, shopId as string);
  const pageHeader = {
    title: lang === 'ar' ? 'الطابعة' : 'Printer',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'الطابعة' : 'Printer',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <PrinterTable  lang={lang} printers={printers} categories={categories}/>
  </>;
}
