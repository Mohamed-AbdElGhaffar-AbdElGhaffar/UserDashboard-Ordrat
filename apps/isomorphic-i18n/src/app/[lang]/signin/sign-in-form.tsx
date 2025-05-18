'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Password, Button, Input } from 'rizzui';
import { Form } from '@ui/form';
import { routes } from '@/config/routes';
// import { loginSchema, LoginSchema } from '@/validators/login.schema';
import { useTranslation } from '@/app/i18n/client';
import { AdminLoginSchema, getAdminLoginSchema } from '@/validators/adminLogin.schema';
import SettingsButton from "@/layouts/settings-button";
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '@/config/base-url';
import Cookies from 'js-cookie'; 

const initialValues: AdminLoginSchema = {
  email: '',
  password: '',
};

export default function SignInForm({lang}:{lang?: string;}) {
  const text = {
    successLogin: lang == 'ar' ? "مرحبا،" : "Welcome,",
    failedLogin: lang == 'ar' ? "فشل تسجيل الدخول" : "Login failed",
  };

  //TODO: why we need to reset it here
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(lang!, 'auth');
  const { guard, setGuard } = useGuardContext();
  const router = useRouter();

  const onSubmit: SubmitHandler<AdminLoginSchema> = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Auth/Login`, {
        email: data.email,
        password: data.password,
      });
      console.log("login data: ",response);

      if (response.data.shopId) {
        localStorage.setItem('accessToken', response.data.accessToken);  
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('userData',  response.data);
        localStorage.setItem('role', response.data.roles);
        localStorage.setItem('mainBranch', response.data.branches[0].id);
        // Save token to cookies so middleware can access it
        Cookies.set('mainBranch', response.data.branches[0].id, {
          expires: 1, // 1 day
          secure: true,
          sameSite: 'Lax',
          path: '/',
        });
  
        const { accessToken, refreshToken, roles, branches, shopId } = response.data;
        
        // Save token to cookies so middleware can access it
        Cookies.set('accessToken', accessToken, {
          expires: 1, // 1 day
          secure: true,
          sameSite: 'Lax',
          path: '/',
        });

        // ShopId.
        Cookies.set('shopId', shopId, {
          expires: 1,
          secure: true,
          sameSite: 'Lax',
          path: '/',
        });
    
        // (optional) Save refresh token
        Cookies.set('refreshToken', refreshToken, {
          expires: 1,
          secure: true,
          sameSite: 'Lax',
          path: '/',
        });
    
        // (optional) Save roles
        Cookies.set('roles', JSON.stringify(roles), {
          expires: 1,
          secure: true,
          sameSite: 'Lax',
          path: '/',
        });
    
        // (optional) Save roles
        Cookies.set('name', `${response.data.firstName} ${response.data.lastName}`, {
          expires: 1,
          secure: true,
          sameSite: 'Lax',
          path: '/',
        });
    
        // (optional) Save roles
        Cookies.set('email', response.data.email, {
          expires: 1,
          secure: true,
          sameSite: 'Lax',
          path: '/',
        });
  
        // (optional) Save branches
        Cookies.set('branches', JSON.stringify(branches), {
          expires: 1,
          secure: true,
          sameSite: 'Lax',
          path: '/',
        });

        setGuard(true);
        toast.success(`${text.successLogin} ${response.data.firstName} ${response.data.lastName}!`);
        router.push(`/${lang}`);
        setLoading(false);
      }else{
        setGuard(false);
        toast.error(`${text.failedLogin}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setGuard(false);
      toast.error(`${text.failedLogin}`);
      setLoading(false);
    }
  };
  

  const validationSchema = getAdminLoginSchema(lang);
  return (
    <> 
      <div className="hidden">
        <SettingsButton t={t} />
      </div>
      <Form<AdminLoginSchema>
        validationSchema={validationSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label={t('auth-email')}
              placeholder={t('auth-email-placeholder')}
              className="[&>label>span]:font-medium"
              inputClassName="text-[16px] input-placeholder"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label={t('auth-password-input')}
              placeholder={t('auth-password-placeholder')}
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-[16px] input-placeholder"
              {...register('password')}
              error={errors.password?.message}
            />
            {/* <div className="flex items-center justify-between pb-2">
              <Link
                href={routes.auth.forgotPassword1}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                {t('auth-forget-password')}
              </Link>
            </div> */}
            <Button isLoading={loading} disabled={loading} className={`w-full ${loading? 'border dark:backdrop-blur focus-visible:ring-muted dark:hover:bg-muted/70 cursor-not-allowed border-muted bg-muted/70 text-muted-foreground backdrop-blur-xl hover:border-muted hover:bg-muted/70' : 'bg-[#e11d48] hover:bg-[#be123c]'}`} type="submit" size="lg">
              <span>{t('auth-login')}</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5 rtl:rotate-180" />
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}
