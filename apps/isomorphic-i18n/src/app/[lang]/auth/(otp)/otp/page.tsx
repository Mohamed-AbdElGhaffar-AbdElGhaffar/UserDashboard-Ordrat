import { Text } from 'rizzui';
import OtpForm from './otp-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import UnderlineShape from '@components/shape/underline';
import Image from 'next/image';
import signUpBG from '@public/sign-up.webp';
import signUpBGAr from '@public/sign-up-ar.webp';
import { metaObject } from '@/config/site.config';
export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? ' كود التحقق'
        : 'OTP',
      lang,
      undefined,
      
    ),
  };
}

export default function OtpPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return (
    <AuthWrapperOne
      title={
        <>
          {lang==='ar'?'ادخل':'Enter your'}{' '}

          <span className="relative inline-block">
            
          {lang==='ar'?'كود التحقق':'OTP.'}{' '}

            <UnderlineShape className="absolute -bottom-2 end-0 h-2.5 w-16 text-blue xl:-bottom-1 xl:w-24" />
          </span>
        </>
      }
        bannerTitle={lang==='ar'?'أسهل طريقة لإدارة متجرك.':'The easiest way to manage your Store.'}
           pageImage={
               <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[710px]">
               <Image
                             src={lang === "ar"? signUpBGAr : signUpBG}
                             alt="Sign Up Thumbnail"
                             fill
                             priority
                             sizes="(max-width: 768px) 100vw"
                             className="object-cover"
                           />
             </div>
           }
         >
     
      <OtpForm lang={lang} />
    </AuthWrapperOne>
  );
}
