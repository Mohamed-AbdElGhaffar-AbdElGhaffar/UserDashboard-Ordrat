'use client';

import { useState } from 'react';
import { Button, Input } from 'rizzui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ForgetPasswordForm({ lang }: { lang?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(lang === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email address')
      .required(lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/ForgetPassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang || 'en',
          },
          body: JSON.stringify({ email: values.email }),
        });

        if (response.ok) {
          toast.success(lang === 'ar' ? 'تم إرسال رابط الاستعادة إلى بريدك الإلكتروني' : 'Reset link sent to your email');
          formik.resetForm();
          router.push(`/auth/otp`)
          localStorage.setItem('ValidationEmail',values.email )
        } else {
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Failed to send reset link');
        }
      } catch (error) {
        toast.error(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'Something went wrong');
        console.error(error);
      } finally {
        setLoading(false);  
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-6">
        <Input
          type="email"
          size="lg"
          label={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
          placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
          className="[&>label>span]:font-medium"
          inputClassName="text-sm"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && formik.errors.email ?formik.errors.email:''}
        />
        <Button
          type="submit"
          className="mt-2 w-full bg-redColor"
          size="lg"
          isLoading={loading}
          disabled={loading}
        >
          {lang === 'ar' ? 'استرداد' : 'Recover'}
        </Button>
      </div>
    </form>
  );
}
