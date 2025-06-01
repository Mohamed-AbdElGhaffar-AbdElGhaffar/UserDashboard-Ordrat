"use client";
import { useSearchParams } from 'next/navigation';
import { useNextStep, NextStepProvider, NextStep, type Tour } from 'nextstepjs';
import Contact from '../contact/Contact';
import MainSlider from '../mainSlider/MainSlider';
import Banners from '../banners/Banners';
import RoleExist from '../../ui/roleExist/RoleExist';
import { useEffect, useMemo } from 'react';
import { FiZap } from 'react-icons/fi';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import CustomCard from '../../ui/CustomCard/CustomCard';

export default function Welcome({lang, data}:{lang:string; data:any;}) {
  const shopId = GetCookiesClient('shopId') as string;
  const searchParams = useSearchParams();
  const { startNextStep } = useNextStep();

  const text = {
    welcomeMessage: lang === 'ar' ? 'صباح الخير،' : 'Good Morning,',
    user: lang === 'ar' ? 'محمد' : 'Mohamed',
    welcomeDescription:
      lang === 'ar'
        ? 'إليك ما يحدث في متجرك اليوم. شاهد الإحصائيات في الحال.'
        : 'Here’s what is happening in your store today. See the statistics at once.',
    addProduct: lang === 'ar' ? 'إضافة منتج' : 'Add Product',
  };
  const steps: Tour[] = useMemo(() => {
    const isArabic = lang === 'ar';
    return [
      {
        tour: 'welcomeTour',
        steps: [
          {
            title: isArabic ? 'إنشاء بانر' : 'Create a Banner',
            content: isArabic
              ? 'استخدم هذا القسم لإنشاء بانر جديد لمتجرك.'
              : 'Use this section to create a new banner for your store.',
            selector: '#contact-step',
            side: 'right',
            showControls: true,
            showSkip: true,
            icon: <FiZap />,
            pointerPadding: 10, 
            pointerRadius: 8, 
          },
          {
            title: isArabic ? 'عرض البانرات' : 'View Banners',
            content: isArabic
              ? 'هنا يمكنك مشاهدة كل البانرات الموجودة حالياً.'
              : 'Here you can view all your existing banners.',
            selector: '#main-slider-step',
            side: 'right',
            showControls: true,
            showSkip: true,
            icon: <FiZap />,
            pointerPadding: 10, 
            pointerRadius: 8, 
          },
          {
            title: isArabic ? 'إدارة البانرات' : 'Manage Banners',
            content: isArabic
              ? 'يمكنك هنا حذف البانرات بسهولة.'
              : 'Manage your banners here, including deleting.',
            selector: '#banners-step',
            side: 'right',
            showControls: true,
            showSkip: true,
            icon: <FiZap />,
            pointerPadding: 10, 
            pointerRadius: 8, 
          },
        ],
      },
    ];
  }, [lang]);

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setTimeout(() => {
        startNextStep('welcomeTour');
      }, 300); // delay 300ms
    }
  }, [searchParams, startNextStep]);
  
  useEffect(() => {
    const overlay = document.querySelector('[data-name="nextstep-overlay"]');
    if (overlay) {
      overlay.setAttribute('lang', 'en');
      overlay.setAttribute('dir', 'ltr');
    }
  
    const observer = new MutationObserver(() => {
      const updatedOverlay = document.querySelector('[data-name="nextstep-overlay"]');
      if (updatedOverlay) {
        updatedOverlay.setAttribute('lang', 'en');
        updatedOverlay.setAttribute('dir', 'ltr');
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  
    return () => observer.disconnect();
  }, []);
  
  return (
    <NextStep steps={steps} cardComponent={(props) => <CustomCard {...props} lang={lang} />}>
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
            <div id="banners-step" className='relative flex flex-col lg:flex-row items-center justify-center gap-4 @4xl:col-span-2 @7xl:col-span-8'>
              <Banners shopId={shopId} lang={lang} data={data}/>
            </div>
          </RoleExist>
        </div>
      </div>
    </NextStep>
  );
}
