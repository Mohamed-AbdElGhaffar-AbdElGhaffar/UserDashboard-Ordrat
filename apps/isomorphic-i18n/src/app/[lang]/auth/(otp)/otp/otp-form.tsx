'use client';

import { Button, PinCode } from 'rizzui';
import { Form } from '@ui/form';
import { SubmitHandler } from 'react-hook-form';
import { useFormik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/base-url';
import { useRouter } from 'next/navigation';

type FormValues = {
  otp: string;
};

export default function OtpForm({ lang }: { lang: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const email = localStorage.getItem('ValidationEmail')
  const handleResend = async () => {
    if (!email) {
      toast.error(lang === 'ar' ? 'البريد الإلكتروني غير موجود' : 'Email not found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/ResendVerificationCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': lang || 'en',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success(lang === 'ar' ? 'تم إرسال رمز تحقق جديد إلى بريدك' : 'Verification code resent to your email');
      } else {
        toast.error(lang === 'ar' ? 'فشل في إعادة إرسال الرمز' : 'Failed to resend code');
      }
    } catch (error) {
      toast.error(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'Something went wrong');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      verificationCode: '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/Auth/VerifyForgetCode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang || 'en',
          },
          body: JSON.stringify({
            email: email,
            verificationCode: values.verificationCode,

          }),
        });
        const result = await response.json();

        if (response.ok) {
          toast.success(lang === 'ar' ? 'تم إرسال رابط الاستعادة إلى بريدك الإلكتروني' : 'Reset link sent to your email');
          formik.resetForm();
          router.push(`/auth/restart-password`)
          localStorage.setItem('ResetToken', result.resetToken);

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


      <div className="space-y-10">
        <div dir="ltr">
          <PinCode
            length={6}
            lang="en"
            variant="outline"
            defaultValue={formik.values.verificationCode}
            size="lg"
            className="lg:justify-start"
            setValue={(value) => formik.setFieldValue('verificationCode', value)}
          />
        </div>


        <Button
          className="w-full text-base font-medium bg-redColor"
          type="submit"
          size="lg"
          isLoading={loading}
          disabled={loading}
        >
          {lang === 'ar' ? 'تحقق من الكود' : 'Verify OTP'}

        </Button>
        <div className="">
          <Button
            className="-mt-4 w-full p-0 text-base font-medium text-primary underline lg:inline-flex lg:w-auto"
            type="button"
            variant="text"
            onClick={handleResend}
          >
            {lang === 'ar' ? 'إعادة إرسال رمز التحقق' : 'Resend OTP'}
          </Button>

        </div>
      </div>
    </form>
  );
}
