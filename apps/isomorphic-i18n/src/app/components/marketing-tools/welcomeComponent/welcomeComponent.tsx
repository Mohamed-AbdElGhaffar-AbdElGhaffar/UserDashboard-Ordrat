import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import WelcomeBanner from '@components/banners/welcome';
import StatCards from '@/app/shared/ecommerce/dashboard/stat-cards';
import { PiPlusBold } from 'react-icons/pi';
import welcomeImg from '@public/shop-illustration.png';
import HandWaveIcon from '@components/icons/hand-wave';
import Contact from '../contact/Contact';
import MainSlider from '../mainSlider/MainSlider';
import Banners from '../banners/Banners';
import RoleExist from '../../ui/roleExist/RoleExist';
import { GetCookiesServer } from '../../ui/getCookiesServer/GetCookiesServer';

export default function Welcome({lang, data}:{lang:string; data:any;}) {
  const shopId = GetCookiesServer('shopId') as string;
  const text = {
    welcomeMessage: lang === 'ar' ? 'صباح الخير،' : 'Good Morning,',
    user: lang === 'ar' ? 'محمد' : 'Mohamed',
    welcomeDescription:
      lang === 'ar'
        ? 'إليك ما يحدث في متجرك اليوم. شاهد الإحصائيات في الحال.'
        : 'Here’s what is happening in your store today. See the statistics at once.',
    addProduct: lang === 'ar' ? 'إضافة منتج' : 'Add Product',
  };
  return (
    <div className="@container">
      <div className="grid gap-6">
        {/* <WelcomeBanner
          title={
            <>
              {text.welcomeMessage} <br /> {text.user}{' '}
              <HandWaveIcon className="inline-flex h-8 w-8" />
            </>
          }
          description={text.welcomeDescription}
          media={
            <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
              <div className="relative">
                <Image
                  src={welcomeImg}
                  alt="Welcome shop image form freepik"
                  className="dark:brightness-95 dark:drop-shadow-md"
                />
              </div>
            </div>
          }
          contentClassName="@2xl:max-w-[calc(100%-340px)]"
          className="border border-muted bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 lg:pb-9 dark:bg-gray-100/30"
        >
          <Link href={routes.eCommerce.createProduct} className="inline-flex">
            <Button as="span" className="h-[38px] shadow md:h-10">
              <PiPlusBold className="me-1 h-4 w-4" /> {text.addProduct}
            </Button>
          </Link>
        </WelcomeBanner>

        <StatCards className="@2xl:grid-cols-3 @3xl:gap-6 @4xl:col-span-2 @7xl:col-span-8" lang={lang} /> */}
        <div className='relative flex flex-col lg:flex-row items-center justify-center gap-4 @4xl:col-span-2 @7xl:col-span-8'>
          <RoleExist PageRoles={['CreateBanner']}>
            <Contact lang={lang} />
          </RoleExist>
          <RoleExist PageRoles={['ViewBanner']}>
            <MainSlider lang={lang} data={data}/>
          </RoleExist>
        </div>
        <RoleExist PageRoles={['DeleteBanner','UpdateBanner']}>  
          <div className='relative flex flex-col lg:flex-row items-center justify-center gap-4 @4xl:col-span-2 @7xl:col-span-8'>
            <Banners shopId={shopId} lang={lang} data={data}/>
          </div>
        </RoleExist>
      </div>
    </div>
  );
}
