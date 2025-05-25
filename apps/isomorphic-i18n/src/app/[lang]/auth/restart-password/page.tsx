import ForgetPasswordForm from './restart-password-form';
import UnderlineShape from '@components/shape/underline';
import Image from 'next/image';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import signUpBG from '@public/sign-up.webp';
import signUpBGAr from '@public/sign-up-ar.webp';
import { metaObject } from '@/config/site.config';
export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'تعيين كلمة مرور جديدة'
        : 'Reset Password',
      lang,
      undefined,
      
    ),
  };
}

export default function SignIn({
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
          {lang==='ar'?'اعادة تعيين':'Reset  '}{' '}
          <span className="relative inline-block">
            {lang==='ar'?'كلمة المرور':'password!'}{' '}          
            <UnderlineShape className="absolute -bottom-2 end-0 h-2.5 w-28 text-blue xl:-bottom-1.5 xl:w-36" />
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
      <ForgetPasswordForm lang={lang} />
    </AuthWrapperOne >
  );
}
