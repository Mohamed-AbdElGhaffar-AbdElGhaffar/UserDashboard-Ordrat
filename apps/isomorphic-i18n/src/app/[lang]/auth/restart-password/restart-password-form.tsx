'use client';

import { useState } from 'react';
import { Button, Input, Password } from 'rizzui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ForgetPasswordForm({ lang }: { lang?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isArabic = lang === 'ar';

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .required(isArabic ? 'كلمة المرور مطلوبة' : 'Password is required')
    .min(8, isArabic ? 'كلمة المرور يجب أن تكون بطول 8 أحرف على الأقل' : 'Password must be at least 8 characters long'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], isArabic ? 'كلمة المرور غير متطابقة' : 'Passwords must match')
    .required(isArabic ? 'يرجى تأكيد كلمة المرور' : 'Please confirm your password'),
});


  const formik = useFormik({
    initialValues: {

  newPassword: '',
  confirmPassword: '',
},

    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const ValidationEmail = localStorage.getItem('ValidationEmail');
        const ResetToken = localStorage.getItem('ResetToken');

        const response = await fetch(`${API_BASE_URL}/api/Auth/ResetPassword`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang || 'en',
          },
          body: JSON.stringify({
            email: ValidationEmail,
            newPassword: values.newPassword,
            resetToken: ResetToken,

          }),
        });

        if (response.ok) {
          toast.success(lang === 'ar' ? 'تم إرسال رابط الاستعادة إلى بريدك الإلكتروني' : 'Reset link sent to your email');
          formik.resetForm();
          router.push(`/signIn`)
          localStorage.removeItem('ValidationEmail')
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
       
        <Password
          name="newPassword"
          label={lang === 'ar' ? 'تعيين كلمة المرور الجديدة' : 'Set new password'}
          placeholder={lang === 'ar' ? 'تعيين كلمة المرور الجديدة' : 'Set new password'}
          size="lg"
          className="[&>label>span]:font-medium"
          inputClassName="text-sm"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : ''}
        />
        <Password
  name="confirmPassword"
  label={lang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'}
  placeholder={lang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm new password'}
  size="lg"
  className="[&>label>span]:font-medium"
  inputClassName="text-sm"
  value={formik.values.confirmPassword}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ''}
/>
        <Button
          type="submit"
          className="mt-2 w-full bg-redColor" 
          size="lg"
          isLoading={loading}
          disabled={loading}
        >
          {lang === 'ar' ? 'تعيين' : 'Reset'}
        </Button>
      </div>
    </form>
  );
}
