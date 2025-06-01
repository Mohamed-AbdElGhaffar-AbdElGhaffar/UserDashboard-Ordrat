import SignInForm from '@/app/[lang]/signin/sign-in-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import Image from 'next/image';
import UnderlineShape from '@components/shape/underline';
import { metaObject } from '@/config/site.config';
import signUpBG from '@public/sign-up.webp';
import signUpBGAr from '@public/sign-up-ar.webp';
import { POS_CART_KEY } from '@/config/constants';
import { CartProvider } from '@/store/quick-cart/cart.context';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'تسجيل الدخول'
        : 'SignIn',
      lang,
      undefined,
      
    ),
  };
}

const translations = {
  en: {
    welcome: "Welcome back! Please ",
    signinTitle: "Sign in to",
    continue: "continue.",
    description:
      "By signing up, you will gain access to exclusive content, special offers, and be the first to hear about exciting news and updates.",
    bannerTitle: "The simplest way to manage your Store.",
    bannerDescription:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint velit officia consequat duis.",
  },
  ar: {
    welcome: "أهلاً بك من جديد! من فضلك ",
    signinTitle: "قم بتسجيل الدخول",
    continue: "للمتابعة.",
    description:
      "من خلال التسجيل، ستحصل على محتوى حصري وعروض خاصة وستكون أول من يعرف الأخبار والتحديثات المثيرة.",
    bannerTitle: "أسهل طريقة لإدارة متجرك.",
    bannerDescription:
      "أميت مينيوم موليت نون ديزورنت ألامكو إيست سيت ألايكا دولور دو أميت سينت فيليت أوفيسيا كونسكات دويس.",
  },
};

export default function SignIn({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const t = translations[lang as 'en' | 'ar'] || translations.en;
  return (
    <CartProvider cartKey={POS_CART_KEY}>  
      <AuthWrapperOne
        title={
          <>
            {t.welcome}
            <span className="relative inline-block">
              {t.signinTitle}
              <UnderlineShape className="absolute -bottom-2 text-redColor start-0 h-2.5 w-24  md:w-28 xl:-bottom-1.5 xl:w-36" />
            </span>{' '}
            {t.continue}
          </>
        }
        // description={t.description}
        bannerTitle={t.bannerTitle}
        // bannerDescription={t.bannerDescription}
        isSocialLoginActive={false}
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
        <SignInForm lang={lang} />
      </AuthWrapperOne>
    </CartProvider>
  );
}
