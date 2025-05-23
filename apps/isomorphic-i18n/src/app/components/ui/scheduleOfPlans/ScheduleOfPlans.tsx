import { Check, X } from 'lucide-react';
import React, { useRef } from 'react'
type ComparisonFeature = {
    name: string;
    values: { [planName: string]: boolean | string }; // ✅ or value
};
type ComparisonCategory = {
    category: string;
    features: ComparisonFeature[];
};

function ScheduleOfPlans({ lang, plan ,ActivePlan}: { lang: string; plan: string,ActivePlan:any }) {
    const comparisonRef = useRef<HTMLDivElement | null>(null);
    const planNames = lang === 'ar'
        ? ['الخطة التجريبية', 'خطة التوفير', 'خطة مميزة']
        : ['Trial Plan', 'Saving Plan', 'VIP Plan'];
     const comparisonData: ComparisonCategory[] = [
    {
      "category": lang === 'ar' ? 'المميزات الأساسية' : 'Basic Features',
      "features": [
        {
          "name": lang === 'ar' ? 'عدد الطلبات' : 'Order Count',
          "values": {
            "الخطة التجريبية": "محدود",
            "خطة التوفير": ActivePlan?.currency === 1 ? "٥٠  قرش / طلب" : ActivePlan?.currency === 2 ? "10 هللة / طلب" : "0.02 دولار / طلب",
            "خطة مميزة": "غير محدود",
            "Trial Plan": "Limited",
            "Saving Plan": ActivePlan?.currency === 1  ? " 50pt per order" : ActivePlan?.currency === 2  ? "10 halala per order" : "USD 0.02 per order",
            "VIP Plan": "Unlimited"
          }
        },
        {
          "name": lang === 'ar' ? 'عدد المنتجات' : 'Product Count',
          "values": {
            "الخطة التجريبية": "محدود",
            "خطة التوفير": "غير محدود",
            "خطة مميزة": "غير محدود",
            "Trial Plan": "Limited",
            "Saving Plan": "Unlimited",
            "VIP Plan": "Unlimited"
          }
        },
        {
          "name": lang === 'ar' ? 'نظام نقاط بيع سحابى' : 'Cloud POS',
          "values": {
            "الخطة التجريبية": "محدود",
             "خطة التوفير": ActivePlan?.currency === 1 ? "٥٠  قرش / طلب" : ActivePlan?.currency === 2 ? "10 هللة / طلب" : "0.02 دولار / طلب",
            "خطة مميزة": "غير محدود",
            "Trial Plan": "Limited",
            "Saving Plan": ActivePlan?.currency === 1  ? " 50pt per order" : ActivePlan?.currency === 2  ? "10 halala per order" : "USD 0.02 per order",
            "VIP Plan": "Unlimited"
          }
        },
        {
          "name": lang === 'ar' ? 'الزيارات' : 'Visits',
          "values": {
            "الخطة التجريبية": "محدود",
            "خطة التوفير": ActivePlan?.currency === 1  ? "5 قروش / زيارة" : ActivePlan?.currency === 2 ? "ربع هللة / زيارة" : "0.0004 دولار / زيارة",
            "خطة مميزة": "غير محدود",
            "Trial Plan": "Limited",
            "Saving Plan": ActivePlan?.currency === 1  ? " 5pt per visit" : ActivePlan?.currency === 2 ? "0.25 halala per visit" : "USD 0.0004 per visit",
            "VIP Plan": "Unlimited"
          }
        },
        {
          "name": lang === 'ar' ? 'إضافة الفروع' : 'Branch Addition',
          "values": {
            "الخطة التجريبية": "محدود",
            "خطة التوفير": "غير محدود",
            "خطة مميزة": "غير محدود",
            "Trial Plan": "Limited",
            "Saving Plan": "Unlimited",
            "VIP Plan": "Unlimited"
          }
        },
        {
          "name": lang === 'ar' ? 'تحقق من الطلبات من خلال OTP' : 'OTP Order Verification',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تطبيق هاتف لعرض المنتجات' : 'Product Mobile App',
          "values": {
            "الخطة التجريبية": "قريبا",
            "خطة التوفير": "قريبا",
            "خطة مميزة": "قريبا",
            "Trial Plan": "Soon",
            "Saving Plan": "Soon",
            "VIP Plan": "Soon"
          }
        }
      ]
    },
    {
      "category": lang === 'ar' ? 'التسويق' : 'Marketing',
      "features": [
        {
          "name": lang === 'ar' ? 'أدوات التسويق عبر واتساب' : 'WhatsApp Marketing Tools',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": ActivePlan?.currency === 1  ? "٥ قروش / رسالة" : ActivePlan?.currency === 2  ? "1 هللة / رسالة" : "0.002 دولار / رسالة",
            "خطة مميزة": "غير محدود",
            "Trial Plan": false,
            "Saving Plan":ActivePlan?.currency === 1  ? "5pt per message" : ActivePlan?.currency === 2 ? "1 halala per message" : "USD 0.002 per message",
            "VIP Plan": "Unlimited"
          }
        },
        {
          "name": lang === 'ar' ? 'نظام التسويق بالعمولة' : 'Affiliate Marketing',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'إنشاء العروض الترويجية وكوبونات الخصم' : 'Promo & Coupons',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تقارير الترويج والتخفيضات' : 'Promo Reports',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        }
      ]
    },
    {
      "category": lang === 'ar' ? 'الواجهة والتخصيص' : 'Design & Customization',
      "features": [
        {
          "name": lang === 'ar' ? 'اخفاء الاعلانات' : 'Hide Ads',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'دعم تعدد اللغات والعملات' : 'Multi-language and currency',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تصميم سريع وسهل الاستخدام' : 'Fast and easy design',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'إمكانية تخصيص التصميم' : 'Customizable Design',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'دومين اوردرات الافتراضى' : 'Default Ordrat Domain',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'ربط دومين خاص بك' : 'Custom Domain Linking',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        }
      ]
    },
    {
      "category": lang === 'ar' ? 'أخرى' : 'Others',
      "features": [
        {
          "name": lang === 'ar' ? 'متجر إلكتروني متكامل' : 'Online Store',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تحسين ظهور المتجر على محركات البحث (SEO)' : 'SEO Optimization',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'أنشاء qr code  لسهولة وصول المتجر' : 'QR Code Creation',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'امكانية عرض مبيعات و مشاهدات زائفة' : 'Fake Views and Sales',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'دعم فني عبر البريد والدردشة' : 'Support (Email & Chat)',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تكاملات Google Sheets و Meta' : 'Google & Meta Integration',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'إدارة القوائم المفضلة' : 'Wishlist Management',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'مراقبة الأداء الجغرافي' : 'Geo Performance',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'السلات المهملة' : 'Cart Cleanup Logs',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'نظام ادارة طاولات المطعم' : 'Restaurant Table Management',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": "اضافة يوزر 1 فقط",
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": "Add only 1 user",
            "VIP Plan": true
          }
        },

        {
          "name": lang === 'ar' ? 'خدمات إدارة المتجر' : 'Store Management Services',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": false,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": false,
            "VIP Plan": true
          }
        }
      ]
    },
    {
      "category": lang === 'ar' ? 'التحليلات والتقارير' : 'Analytics & Reports',
      "features": [
        {
          "name": lang === 'ar' ? 'تحليل زيارات المتجر' : 'Store Visit Analytics',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'إحصائيات التوفير حول المبيعات والعملاء' : 'Saving Plan Sales Stats',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تحليل أداء الشحن والتوصيل' : 'Delivery Performance',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تحليل الاتجاهات الزمنية' : 'Trend Analysis',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تحليل السلات المهجورة' : 'Abandoned Cart Analysis',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تحليل معدل التحويل' : 'Conversion Rate Analysis',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'تحليل العوائد والاسترجاع' : 'Returns Analysis',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        }
      ]
    },
    {
      "category": lang === 'ar' ? 'الشحن والدفع' : 'Shipping & Payment',
      "features": [
        {
          "name": lang === 'ar' ? 'إمكانية تعيين ديليفرى خاص بالمتجر' : 'Assign Custom Delivery',
          "values": {
            "الخطة التجريبية": true,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": true,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'إمكانية الشحن عبر منصة أوردرات' : 'Ordrat Shipping',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'دفع عند الاستلام' : 'Cash on Delivery',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        }
      ]
    },
    {
      "category": lang === 'ar' ? 'الدعم والإدارة' : 'Support & Management',
      "features": [
        {
          "name": lang === 'ar' ? 'إضافة مساعدين بمهام محددة' : 'Add Assistants',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": true,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": true,
            "VIP Plan": true
          }
        },
        {
          "name": lang === 'ar' ? 'دعم VIP مع مدير حساب' : 'VIP Support',
          "values": {
            "الخطة التجريبية": false,
            "خطة التوفير": false,
            "خطة مميزة": true,
            "Trial Plan": false,
            "Saving Plan": false,
            "VIP": true
          }
        }
      ]
    },
    {
      "category": lang === 'ar' ? 'تطبيقات الجوال' : 'Mobile Apps',
      "features": [
        {
          "name": lang === 'ar' ? 'تطبيق هاتف للتاجر' : 'Merchant Mobile App',
          "values": {
            "الخطة التجريبية": "قريبا",
            "خطة التوفير": "قريبا",
            "خطة مميزة": "قريبا",
            "Trial Plan": "Soon",
            "Saving Plan": "Soon",
            "VIP": "Soon"
          }
        }
      ]
    }
  ];
    return <>
        <div
            ref={comparisonRef}

            className="overflow-x-hidden bg-white rounded-xl  shadow-md p-4 sm:p-8 mt-14">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-black">
                {lang === 'ar' ? 'مقارنة شاملة بين جميع الخطط' : 'Full Comparison Between All Plans'}
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
                {lang === 'ar'
                    ? 'اكتشف جميع المميزات المتاحة واختر الخطة المناسبة لاحتياجات عملك'
                    : 'Discover all features and choose the plan that fits your business needs'}
            </p>

            <table className="w-full rounded-xl  table-auto  ">
                <thead className='rounded-xl'>
                    <tr className="bg-[#FAFAFD] ">
                        <th className=" text-start ps-3 py-5 ">{lang === 'ar' ? 'المميزات' : 'Features'}</th>
                        {planNames.map((name, idx) => (
                            <th
                                key={idx}
                                className={`px-3 py-5 text-center font-semibold ${name === plan ? 'bg-yellow-50 text-yellow-800' : ''}`}
                            >
                                {name === plan
                                    ? (lang === 'ar' ? 'الخطة الحالية' : 'Current Plan')
                                    : name}
                            </th>

                        ))}
                    </tr>
                </thead>
                <tbody>
                    {comparisonData.map((section, i) => (
                        <React.Fragment key={i}>
                            <tr>
                                <td colSpan={planNames.length + 1} className={`bg-[#F1F5F9] text-black font-semibold py-5 px-4`}>
                                    {section.category}
                                </td>
                            </tr>
                            {section.features.map((feature, fi) => (
                                <tr key={fi} className="bg-white border">
                                    <td className="px-3 py-4 font-medium text-gray-700">{feature.name}</td>
                                    {planNames.map((planName, j) => {
                                        const value = feature.values[planName];
                                        return (
                                            <td
                                                key={j}
                                                className={`p-3 text-center ${planName === plan ? 'bg-yellow-50 text-yellow-800 font-semibold' : ''
                                                    }`}
                                            >
                                                {value === true ? (
                                                    <Check className="text-green-500 w-5 h-5 mx-auto" />
                                                ) : value === false ? (
                                                    <X className="text-red-500 w-5 h-5 mx-auto" />
                                                ) : (
                                                    <span className="text-sm font-semibold">{value}</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </>
}

export default ScheduleOfPlans