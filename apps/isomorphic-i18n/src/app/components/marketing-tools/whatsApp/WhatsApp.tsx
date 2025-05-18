'use client';
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { TextField, Autocomplete, Box } from "@mui/material";
import { PiWhatsappLogo, PiWhatsappLogoFill } from 'react-icons/pi';
import QRCode from 'qrcode.react';
import Flag from 'react-world-flags';
import { Button } from 'rizzui';
import * as signalR from '@microsoft/signalr';
import SendMessage from './SendMessage';
import { Loader2 } from 'lucide-react';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import axiosClient from '../../context/api';
import BranchesTable from '@/app/shared/tan-table/branchesTable';
import WhatsAppTable from '@/app/shared/tan-table/whatsAppTable';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import PageHeader from '@/app/shared/page-header';
import LogoutButtom from '@/app/shared/whatsAppLogoutButtom';
import Image from 'next/image';
import NotFoundImg from '@public/notFound.svg';
import SettingsButton from '@/layouts/settings-button';
import Link from 'next/link';
import toast from 'react-hot-toast';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const createAppTheme = (direction: 'ltr' | 'rtl') =>
  createTheme({
    direction,
  });

const DirectionWrapper = ({ isRtl, children }: { isRtl: boolean, children: React.ReactNode }) => {
  const theme = createAppTheme(isRtl ? 'rtl' : 'ltr');
  
  return isRtl ? (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );
};

const API_URL = 'https://salesmanapi.salesman.tools/api/WhatsappAutomation/Connect';
const SIGNALR_URL = 'https://salesmanapi.salesman.tools/whatsappHub';
const API_KEY = 'gkP12oE2iOhQGSgNd8e7IMsTupN5GEm9';

const countries: { code: CountryCode; nameEn: string; nameAr: string; dialCode: string; flag: string }[] = [
  // Arab Countries
  { code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', dialCode: '+20', flag: '🇪🇬' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameAr: 'الإمارات', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'السعودية', dialCode: '+966', flag: '🇸🇦' },
  { code: 'QA', nameEn: 'Qatar', nameAr: 'قطر', dialCode: '+974', flag: '🇶🇦' },
  { code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', dialCode: '+965', flag: '🇰🇼' },
  { code: 'OM', nameEn: 'Oman', nameAr: 'عمان', dialCode: '+968', flag: '🇴🇲' },
  { code: 'BH', nameEn: 'Bahrain', nameAr: 'البحرين', dialCode: '+973', flag: '🇧🇭' },
  { code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', dialCode: '+962', flag: '🇯🇴' },
  { code: 'LB', nameEn: 'Lebanon', nameAr: 'لبنان', dialCode: '+961', flag: '🇱🇧' },
  { code: 'SY', nameEn: 'Syria', nameAr: 'سوريا', dialCode: '+963', flag: '🇸🇾' },
  { code: 'IQ', nameEn: 'Iraq', nameAr: 'العراق', dialCode: '+964', flag: '🇮🇶' },
  { code: 'MA', nameEn: 'Morocco', nameAr: 'المغرب', dialCode: '+212', flag: '🇲🇦' },
  { code: 'TN', nameEn: 'Tunisia', nameAr: 'تونس', dialCode: '+216', flag: '🇹🇳' },
  { code: 'DZ', nameEn: 'Algeria', nameAr: 'الجزائر', dialCode: '+213', flag: '🇩🇿' },
  { code: 'LY', nameEn: 'Libya', nameAr: 'ليبيا', dialCode: '+218', flag: '🇱🇾' },
  { code: 'YE', nameEn: 'Yemen', nameAr: 'اليمن', dialCode: '+967', flag: '🇾🇪' },
  { code: 'SD', nameEn: 'Sudan', nameAr: 'السودان', dialCode: '+249', flag: '🇸🇩' },
  { code: 'PS', nameEn: 'Palestine', nameAr: 'فلسطين', dialCode: '+970', flag: '🇵🇸' },
  { code: 'SO', nameEn: 'Somalia', nameAr: 'الصومال', dialCode: '+252', flag: '🇸🇴' },
  { code: 'MR', nameEn: 'Mauritania', nameAr: 'موريتانيا', dialCode: '+222', flag: '🇲🇷' },
  { code: 'DJ', nameEn: 'Djibouti', nameAr: 'جيبوتي', dialCode: '+253', flag: '🇩🇯' },
  { code: 'KM', nameEn: 'Comoros', nameAr: 'جزر القمر', dialCode: '+269', flag: '🇰🇲' },
  // Famous Countries
  { code: 'US', nameEn: 'United States', nameAr: 'الولايات المتحدة', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', nameEn: 'United Kingdom', nameAr: 'المملكة المتحدة', dialCode: '+44', flag: '🇬🇧' },
  { code: 'FR', nameEn: 'France', nameAr: 'فرنسا', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', nameEn: 'Germany', nameAr: 'ألمانيا', dialCode: '+49', flag: '🇩🇪' },
  { code: 'CN', nameEn: 'China', nameAr: 'الصين', dialCode: '+86', flag: '🇨🇳' },
  { code: 'RU', nameEn: 'Russia', nameAr: 'روسيا', dialCode: '+7', flag: '🇷🇺' },
  { code: 'IN', nameEn: 'India', nameAr: 'الهند', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BR', nameEn: 'Brazil', nameAr: 'البرازيل', dialCode: '+55', flag: '🇧🇷' },
  { code: 'JP', nameEn: 'Japan', nameAr: 'اليابان', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', nameEn: 'South Korea', nameAr: 'كوريا الجنوبية', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CA', nameEn: 'Canada', nameAr: 'كندا', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', nameEn: 'Australia', nameAr: 'أستراليا', dialCode: '+61', flag: '🇦🇺' },
  { code: 'IT', nameEn: 'Italy', nameAr: 'إيطاليا', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', nameEn: 'Spain', nameAr: 'إسبانيا', dialCode: '+34', flag: '🇪🇸' },
  { code: 'TR', nameEn: 'Turkey', nameAr: 'تركيا', dialCode: '+90', flag: '🇹🇷' },
  { code: 'ZA', nameEn: 'South Africa', nameAr: 'جنوب أفريقيا', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', nameEn: 'Nigeria', nameAr: 'نيجيريا', dialCode: '+234', flag: '🇳🇬' },
  { code: 'MX', nameEn: 'Mexico', nameAr: 'المكسيك', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', nameEn: 'Argentina', nameAr: 'الأرجنتين', dialCode: '+54', flag: '🇦🇷' },
  { code: 'ID', nameEn: 'Indonesia', nameAr: 'إندونيسيا', dialCode: '+62', flag: '🇮🇩' },
  { code: 'PK', nameEn: 'Pakistan', nameAr: 'باكستان', dialCode: '+92', flag: '🇵🇰' },
];

interface PageHeaderType {
  title: string;
  breadcrumb: {href?: string; name: string;}[];
}
function WhatsApp({ lang, checksession, pageHeader }: { lang?: string; checksession:{status:boolean, success:boolean, message:string, qrCode?:string, deviceStatus?:{connected:boolean, loggedIn:boolean, sessionExists:boolean,} }; pageHeader: PageHeaderType; }) {
  const [session, setSession] = useState(checksession);

  const text = {
    title: lang === 'ar' ? 'أدوات التسويق (واتساب)' : 'Marketing tools (WhatsApp)',
    login: lang === 'ar' ? 'تسجيل الدخول إلى واتساب' : 'Login to WhatsApp',
    scanQR: lang === 'ar' ? 'قم بمسح الرمز باستخدام كاميرا الهاتف للدخول' : 'Scan the code using your phone camera to login',
    secureLogin: lang === 'ar' ? 'تسجيل دخول آمن' : 'Secure login',
    dataProtection: lang === 'ar' ? 'حماية البيانات' : 'Data protection',
    fastAccess: lang === 'ar' ? 'دخول سريع' : 'Fast access',
  };
  const shopId = GetCookiesClient('shopId') as string;
  
  const isRtl = lang === 'ar';
  const initIsAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(localStorage.getItem("phoneNumber"));
  const [isAuthenticated, setIsAuthenticated] = useState(initIsAuthenticated);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   if(localStorage.getItem("isAuthenticated") === "true"){

  //   };
  // }, [lang]);

  // async function connectToWhatsApp(phoneNumber: string) {
  //   setLoading(true);
  //   const encodedPhoneNumber = encodeURIComponent(phoneNumber);
  //   console.log("phone number connect:", encodedPhoneNumber);
  //   try {
  //     const response = await fetch(`${API_URL}?fromPhoneNumber=${encodedPhoneNumber}`, {
  //       method: 'POST',
  //       headers: {
  //         'X-API-KEY': API_KEY,
  //         'SessionId': shopId,
  //         'Accept': '*/*',
  //       },
  //     });

  //     const rawConnectionId = await response.text();
  //     console.log('rawConnectionId Connection ID:', rawConnectionId);
      
  //     const connectionId = rawConnectionId.replace(/^"|"$/g, "");
  //     console.log('Received Connection ID:', connectionId);

  //     setConnectionId(connectionId);
  //     setupSignalRConnection(connectionId, phoneNumber);
  //   } catch (error) {
  //     console.error('Error connecting to WhatsApp:', error);
  //     setLoading(false);
  //   }
  // }

  // function setupSignalRConnection(connectionId: string, phoneNumber: string) {
  //   const encodedPhoneNumber = encodeURIComponent(phoneNumber);

  //   const connection = new signalR.HubConnectionBuilder()
  //     .withUrl(`${SIGNALR_URL}?userId=${shopId}&phoneNumber=${encodedPhoneNumber}`)
  //     .configureLogging(signalR.LogLevel.Information)
  //     .build();

  //   console.log("user id:", connectionId);
  //   console.log("phone number:", phoneNumber);
  //   setLoading(true);
  //   connection.on("ReceiveNotification", (message) => {
  //     console.log("Received SignalR Message:", message);

  //     if (message.isAuthenticated) {
  //       console.log("✅ User authenticated successfully!");
  //       setPhoneNumber(phoneNumber);
  //       setIsAuthenticated(true);
  //       localStorage.setItem("isAuthenticated", "true");
  //       localStorage.setItem("phoneNumber", phoneNumber);
  //       setQrCode(null);
  //       setLoading(false);
  //     } else {
  //       setQrCode(message.qr);
  //       localStorage.setItem("isAuthenticated", "false");
  //       localStorage.setItem("phoneNumber", phoneNumber);
  //       setLoading(false);
  //     }
  //   });

  //   connection.start()
  //     .then(() => console.log("✅ Connected to SignalR"))
  //     .catch(err => console.error("❌ SignalR Connection Error:", err));
  // }
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!session?.status) {
        const lastTime = localStorage.getItem('lastCheckSessionTime');
        const now = new Date().getTime();
        console.log("lastTime: ",lastTime);

        try {
          const res = await axiosClient.get(`/api/Whatsapp/checksession/${shopId}`);
          setSession(res.data);
          console.log("done");
          localStorage.setItem('lastCheckSessionTime', now.toString());
        } catch (error) {
          console.error('❌ Error re-fetching checksession:', error);
        }
        if (!lastTime || now - parseInt(lastTime) >= 2 * 60 * 1000) {
        }
      }
    }, 10000); // check every 10 seconds
  
    return () => clearInterval(interval); // cleanup
  }, [session?.status]);  
  
  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  const CameraIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      fill="none" 
      stroke="#666" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      viewBox="0 0 24 24"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );

  const BenefitItem = ({ icon: Icon, label }: { icon: React.ComponentType; label: string }) => (
    <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-800 font-medium">
      <div className="w-6 h-6 bg-red-100 text-[#e11d48] rounded-full flex items-center justify-center mr-2">
        <Icon />
      </div>
      {label}
    </div>
  );
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        {session?.status && (
          <LogoutButtom lang={lang} title={lang == "en"?"Logout":'تسجيل الخروج'} loading={loading}
            onSuccess={async ()=>{
              setLoading(true);
              try {
                const res = await axiosClient.get(`/api/Whatsapp/checksession/${shopId}`);
                setSession(res.data);
                toast.success(lang === 'ar' ? 'تم فصل الجهاز بنجاح' : 'Device disconnected successfully');
              } catch (error) {
                console.error('❌ Error re-fetching checksession:', error);
                toast.error(lang === 'ar' ? 'حدث خطأ أثناء الفصل' : 'An error occurred while disconnecting');
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </PageHeader>
      {session?
        <DirectionWrapper isRtl={isRtl}>
          {/* bg-[#F5F7FA] */}
          <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-5 flex flex-col items-center">
            <h2 className="relative mb-4 pb-4 text-xl md:text-2xl font-bold text-[#2C3E50] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-[#E84654] after:rounded">
              {text.title}
            </h2>
            {session.status ? (
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div className="w-full lg:w-[500px] shrink-0">
                  <SendMessage
                    lang={lang}
                    savedPhoneNumber={''}
                    isAuthenticated={session.status}
                    closeConnection={() => setIsAuthenticated(false)}
                  />
                </div>
                <div className="w-full lg:w-[calc(100%-515px)]">
                  <WhatsAppTable lang={lang} />
                </div>
              </div>
            ) : (
              <div className="
                bg-white relative 
                p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 
                rounded-xl sm:rounded-2xl 
                shadow-md sm:shadow-lg 
                w-full max-w-[90vw] sm:max-w-[480px] md:max-w-[580px] lg:max-w-[680px] 3xl:max-w-[800px] 4xl:max-w-[1000px]
                mx-auto overflow-hidden 
                hover:transform hover:-translate-y-1 hover:shadow-xl 
                transition-all duration-300
              ">
                {/* Background decoration */}
                <div className="
                  absolute top-0 right-0 
                  w-[80px] sm:w-[120px] md:w-[150px] lg:w-[180px] xl:w-[200px] 
                  h-[80px] sm:h-[120px] md:h-[150px] lg:h-[180px] xl:h-[200px] 
                  bg-[#E84654]/5 rounded-full 
                  transform translate-x-8 sm:translate-x-12 md:translate-x-16 xl:translate-x-20 
                  -translate-y-8 sm:-translate-y-12 md:-translate-y-16 xl:-translate-y-20
                " />
                
                <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8 relative z-10">
                  <div className="
                    w-7 sm:w-8 md:w-9 lg:w-10 2xl:w-12 4xl:w-14 
                    h-7 sm:h-8 md:h-9 lg:h-10 2xl:h-12 4xl:h-14 
                    bg-[#25D366] text-[#fff] rounded-full 
                    flex items-center justify-center shadow-md 
                    me-2 sm:me-3
                  ">
                    <PiWhatsappLogo className="w-4 sm:w-5 md:w-6 lg:w-7 2xl:w-8 4xl:w-9 h-4 sm:h-5 md:h-6 lg:h-7 2xl:h-8 4xl:h-9" />
                  </div>
                  <h3 className="
                    text-[#E84654] 
                    text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl 4xl:text-4xl 
                    font-bold text-center
                  ">
                    {text.login}
                  </h3>
                </div>

                <div className="
                  w-fit mx-auto 
                  bg-white 
                  p-3 sm:p-4 md:p-5 
                  rounded-lg sm:rounded-xl 
                  shadow-sm sm:shadow-md 
                  flex justify-center items-center 
                  transition-transform duration-300 hover:scale-105
                ">
                  {/* <QRCode 
                    value={session.qrCode || ''} 
                    size={120}
                    className="sm:hidden"
                  />
                  <QRCode 
                    value={session.qrCode || ''} 
                    size={180}
                    className="hidden sm:block md:hidden"
                  />
                  <QRCode 
                    value={session.qrCode || ''} 
                    size={220}
                    className="hidden md:block lg:hidden"
                  />
                  <QRCode 
                    value={session.qrCode || ''} 
                    size={260}
                    className="hidden lg:block 4xl:hidden"
                  />
                  <QRCode 
                    value={session.qrCode || ''} 
                    size={350}
                    className="hidden 4xl:block"
                    /> */}
                    {/* <QRCode 
                      value={session.qrCode || ''} 
                      size={300}
                      className="hidden xl:block"
                    /> */}
                    <img
                      src={session.qrCode || ''}
                      alt="QR Code"
                      className="
                        block w-[120px] h-[120px]
                        sm:w-[180px] sm:h-[180px] 
                        md:w-[220px] md:h-[220px] 
                        lg:w-[260px] lg:h-[260px] 
                        4xl:w-[350px] 4xl:h-[350px]
                        mx-auto rounded-md shadow"
                    />
                </div>

                <p className="
                  mt-3 sm:mt-4 md:mt-5 lg:mt-6 
                  text-xs sm:text-sm md:text-base lg:text-lg 
                  text-gray-600 flex justify-center items-center gap-1 sm:gap-2
                ">
                  <CameraIcon />
                  {text.scanQR}
                </p>

                <div className="
                  mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14 
                  flex flex-wrap justify-center 
                  gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6
                ">
                  <BenefitItem icon={CheckIcon} label={text.secureLogin} />
                  <BenefitItem icon={ShieldIcon} label={text.dataProtection} />
                  <BenefitItem icon={ClockIcon} label={text.fastAccess} />
                </div>
              </div>
            )
            }
          </div>
        </DirectionWrapper>
        :
        <div className="text-center">
          <div className="hidden">
            <SettingsButton />
          </div>
          <img src={NotFoundImg.src} alt="Not Found" className="mx-auto" width="500" height="250"/>
          <p className="font-medium text-xl">
            {lang === "ar"
              ? "حدث خطأ اثناء الاتصال"
              : "An error occurred while connecting"}
          </p>
          <Link
            href={`/${lang}/marketingtools/whatsapp`}
            className="flex justify-center items-center bg-primary w-fit py-2 px-8 hover:bg-transparent hover:text-primary duration-200 hover:border-2 hover:border-primary gap-3 rounded-full cursor-pointer mx-auto text-white mt-3"
          >
            {lang === "ar" ? "إعادة الاتصال" : "Reconnect"}
          </Link>
        </div>
      }
    </>
  );
}

export default WhatsApp;
