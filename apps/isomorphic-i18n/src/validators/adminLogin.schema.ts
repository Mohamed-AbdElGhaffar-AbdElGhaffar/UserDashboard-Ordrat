import { z } from 'zod';

// Dynamic schema function
export const getAdminLoginSchema = (lang: string | undefined) => {
  const isArabic = lang === 'ar';

  return z.object({
    email: z
      .string()
      .email(isArabic ? 'البريد الإلكتروني غير صحيح' : 'Invalid email address'),
    password: z
      .string()
      .min(8, isArabic ? 'كلمة السر يجب أن تكون بطول 8 أحرف على الأقل' : 'Password must be at least 8 characters long')
      // .regex(/[a-z]/, isArabic ? 'كلمة السر يجب أن تحتوي على حرف صغير واحد على الأقل' : 'Password must include at least one lowercase letter')
      // .regex(/[A-Z]/, isArabic ? 'كلمة السر يجب أن تحتوي على حرف كبير واحد على الأقل' : 'Password must include at least one uppercase letter')
      // .regex(/[0-9]/, isArabic ? 'كلمة السر يجب أن تحتوي على رقم واحد على الأقل' : 'Password must include at least one number')
      // .regex(/[\W_]/, isArabic ? 'كلمة السر يجب أن تحتوي على رمز خاص واحد على الأقل' : 'Password must include at least one special character')
      ,
    rememberMe: z.boolean().optional(),
  });
};

// Form types generated from the Zod schema
export type AdminLoginSchema = z.infer<ReturnType<typeof getAdminLoginSchema>>;
