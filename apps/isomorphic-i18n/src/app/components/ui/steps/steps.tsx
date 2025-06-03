// steps.ts
import type { Tour } from 'nextstepjs';
import { FiZap } from 'react-icons/fi';

export function getCategorySteps(lang: string): Tour[] {
  const isArabic = lang === 'ar';
  const side = isArabic ? 'right' : 'left';
  return [
    {
      tour: 'categoryTour',
      steps: [
        {
          title: isArabic ? 'إنشاء قسم' : 'Create a Category',
          content: isArabic
            ? 'استخدم هذا الزر لإنشاء قسم جديد.'
            : 'Use this button to create a new category.',
          selector: '#create-category-step',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'إضافة صورة' : 'Upload Image',
          content: isArabic
            ? 'قم بتحميل صورة للقسم الجديد من هنا.'
            : 'Upload an image for the new category here.',
          selector: '#upload-category-step',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'الاسم بالعربية' : 'Name (Arabic)',
          content: isArabic
            ? 'اكتب اسم القسم باللغة العربية.'
            : 'Enter the category name in Arabic.',
          selector: '#name-ar-category-step',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'الاسم بالإنجليزية' : 'Name (English)',
          content: isArabic
            ? 'اكتب اسم القسم باللغة الإنجليزية.'
            : 'Enter the category name in English.',
          selector: '#name-en-category-step',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'الأولوية' : 'Priority',
          content: isArabic
            ? `حدد أولوية القسم. 
              حدد اي قسم يظهر اولا`
            : `Set the priority for the category.
              which category appears first.`,
          selector: '#priority-category-step',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'عرض جميع المنتجات' : 'Show All Products',
          content: isArabic
            ? 'اختر ما إذا كنت تريد عرض جميع المنتجات داخل هذا القسم.'
            : 'Choose whether to show all products in this category.',
          selector: '#show-all-products-category-step',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'تحسين محركات البحث' : 'SEO Metadata',
          content: isArabic
            ? 'يمكنك إدخال عنوان ووصف القسم لمحركات البحث.'
            : 'You can enter title and description for SEO.',
          selector: '#seo-category-step',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'طريقة العرض' : 'Layout Style',
          content: isArabic
            ? 'اختر طريقة عرض المنتجات داخل القسم.'
            : 'Choose how to display products in the category.',
          selector: '#design-category-step',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'إنشاء القسم' : 'Submit Category',
          content: isArabic
            ? 'اضغط على الزر لإرسال بيانات القسم.'
            : 'Click the button to submit the category.',
          selector: '#submit-category',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'تحديث البيانات' : "Update Data",
          content: isArabic
            ? 'تحديث بيانات جدول الاقسام.'
            : 'Update category table data.',
          selector: '#update-data-category',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'عرض البيانات' : "View Data",
          content: isArabic
            ? 'رؤية بيانات جدول الاقسام.'
            : 'View category table data.',
          selector: '#view-data-category',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        // {
        //   title: isArabic ? 'تغيير حالة القسم' : 'Change category status',
        //   content: isArabic
        //     ? 'هل تريد ان تظهر القسم او لا؟'
        //     : 'Do you want to show the section or not?',
        //   selector: '#change-status-category',
        //   side: side,
        //   showControls: true,
        //   showSkip: true,
        //   icon: <FiZap />,
        // },
        // {
        //   title: isArabic ? 'تعديل القسم' : 'Update category',
        //   content: isArabic
        //     ? 'استخدم هذا الزر لتعديل القسم.'
        //     : 'Use this button to update a category.',
        //   selector: '#update-category',
        //   side: side,
        //   showControls: true,
        //   showSkip: true,
        //   icon: <FiZap />,
        // },
        // {
        //   title: isArabic ? 'حذف القسم' : 'Delete category',
        //   content: isArabic
        //     ? 'استخدم هذا الزر لحذف القسم.'
        //     : 'Use this button to delete a category.',
        //   selector: '#delete-category',
        //   side: side,
        //   showControls: true,
        //   showSkip: true,
        //   icon: <FiZap />,
        // },
      ],
    },
  ];
}

export function getFakeSteps(lang: string): Tour[] {
  const isArabic = lang === 'ar';
  const side = isArabic ? 'right' : 'left';

  return [
    {
      tour: 'fakeTour',
      steps: [
        {
          title: isArabic ? 'تعديل البيانات مزيفة' : 'Update Fake Data',
          content: isArabic
            ? 'استخدم هذا الزر لتعديل البيانات مزيفة.'
            : 'Use this button to update fake data.',
          selector: '#update-fake-data',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'عدد المبيعات' : 'Fake Sold Number',
          content: isArabic
            ? `هل تريد تفعيل عدد المبيعات خلال الساعات الماضية:
              تستطيع ان تحدد أقصى و أقل عدد للمبيعات المزيفة.
            `
            : `Do you want to enable fake views?
              You can set a maximum or minimum number of fake sold.`,
          selector: '#enable-sold-number',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'تفعيل المشاهدات المزيفة' : 'Enable Fake Viewers',
          content: isArabic
            ? `هل تريد تفعيل المشاهدات المزيفة:
              تستطيع ان تحدد أقصى أو أقل عدد للمشاهدين المزيفين.
            `
            : `Do you want to enable fake views?
              You can set a maximum or minimum number of fake viewers.`,
          selector: '#enable-fake-viewers',
          side: side,
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'تعديل البيانات مزيفة' : 'Update Fake Data',
          content: isArabic
            ? 'اضغط على الزر لإرسال البيانات مزيفة.'
            : 'Click the button to update fake data.',
          selector: '#update-data',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'عرض البيانات' : "View Data",
          content: isArabic
            ? 'رؤية البيانات المزيفة بعد التعديل.'
            : 'View fake data after modification.',
          selector: '#view-fake-data',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
      ],
    },
  ];
}

export function getTablesSteps(lang: string, tables: any[], languages: any): Tour[] {
  const isArabic = lang === 'ar';

  const side = isArabic ? 'right' : 'left';

  const commonSteps = [
    {
      title: isArabic ? 'إضافة طاولة' : 'Add Table',
      content: isArabic
        ? 'استخدم هذا الزر لإضافة طاولة جديد.'
        : 'Use this button to add a new table.',
      selector: '#add-table-step',
      side: side as 'right' | 'left',
      showControls: true,
      showSkip: true,
      icon: <FiZap />,
    },
  ];

  let descriptionSteps = [];

  if (languages === 0) {
    descriptionSteps = [
      {
        title: isArabic ? 'إدخال الوصف بالعربية' : 'Enter Description (Arabic)',
        content: isArabic
          ? 'أدخل وصف الطاولة باللغة العربية.'
          : 'Enter the table description in Arabic.',
        selector: '#description-ar-table-step',
        side: side as 'right' | 'left',
        showControls: true,
        showSkip: true,
        icon: <FiZap />,
      },
    ];
  } else if (languages === 1) {
    descriptionSteps = [
      {
        title: isArabic ? 'إدخال الوصف بالإنجليزية' : 'Enter Description (English)',
        content: isArabic
          ? 'أدخل وصف الطاولة باللغة الإنجليزية.'
          : 'Enter the table description in English.',
        selector: '#description-en-table-step',
        side: side as 'right' | 'left',
        showControls: true,
        showSkip: true,
        icon: <FiZap />,
      },
    ];
  } else {
    descriptionSteps = [
      {
        title: isArabic ? 'إدخال الوصف بالعربية' : 'Enter Description (Arabic)',
        content: isArabic
          ? 'أدخل وصف الطاولة باللغة العربية.'
          : 'Enter the table description in Arabic.',
        selector: '#description-ar-table-step',
        side: side as 'right' | 'left',
        showControls: true,
        showSkip: true,
        icon: <FiZap />,
      },
      {
        title: isArabic ? 'إدخال الوصف بالإنجليزية' : 'Enter Description (English)',
        content: isArabic
          ? 'أدخل وصف الطاولة باللغة الإنجليزية.'
          : 'Enter the table description in English.',
        selector: '#description-en-table-step',
        side: side as 'right' | 'left',
        showControls: true,
        showSkip: true,
        icon: <FiZap />,
      },
    ];
  }

  // Only add the table-related steps if there are tables
  const tableSteps = tables.length > 0
    ? [
        ...descriptionSteps,
        {
          title: isArabic ? 'رقم الطاولة' : 'Table Number',
          content: isArabic
            ? 'أدخل رقم الطاولة.'
            : 'Enter the table number.',
          selector: '#table-number-step',
          side: side as 'right' | 'left',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'إنشاء الطاولة' : 'Submit Table',
          content: isArabic
            ? 'اضغط على الزر لإرسال بيانات الطاولة.'
            : 'Click the button to submit the table.',
          selector: '#submit-table',
          side: side as 'right' | 'left',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'عرض الطاولات' : "View Tables",
          content: isArabic
            ? 'رؤية جميع الطاولات الخاصة بالفرع.'
            : 'View all tables on the branch.',
          selector: '#view-data-tables',
          side: side as 'right' | 'left',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'تعديل الطاولة' : 'Update table',
          content: isArabic
            ? 'استخدم هذا الزر لتعديل الطاولة.'
            : 'Use this button to update a table.',
          selector: '#update-table',
          side: side as 'right' | 'left',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
        {
          title: isArabic ? 'حذف الطاولة' : 'Delete table',
          content: isArabic
            ? 'استخدم هذا الزر لحذف الطاولة.'
            : 'Use this button to delete a table.',
          selector: '#delete-table',
          side: side as 'right' | 'left',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
      ]
    : [
      
      ...descriptionSteps,
      {
        title: isArabic ? 'رقم الطاولة' : 'Table Number',
        content: isArabic
          ? 'أدخل رقم الطاولة.'
          : 'Enter the table number.',
        selector: '#table-number-step',
        side: side as 'right' | 'left',
        showControls: true,
        showSkip: true,
        icon: <FiZap />,
      },
      {
        title: isArabic ? 'إنشاء الطاولة' : 'Submit Table',
        content: isArabic
          ? 'اضغط على الزر لإرسال بيانات الطاولة.'
          : 'Click the button to submit the table.',
        selector: '#submit-table',
        side: side as 'right' | 'left',
        showControls: true,
        showSkip: true,
        icon: <FiZap />,
      },{
        title: isArabic ? 'عرض الطاولات' : "View Tables",
        content: isArabic
          ? 'رؤية جميع الطاولات الخاصة بالفرع.'
          : 'View all tables on the branch.',
        selector: '#view-data-tables',
        side: side as 'right' | 'left',
        showControls: true,
        showSkip: true,
        icon: <FiZap />,
      },
    ];

  return [
    {
      tour: 'TablesTour',
      steps: [...commonSteps, ...tableSteps],
    },
  ];
}

export function getProductSteps(lang: string): Tour[] {
  const isArabic = lang === 'ar';

  return [
    {
      tour: 'productTour',
      steps: [
        // Product Title (Arabic)
        {
          title: isArabic ? 'إدخال الاسم بالعربية' : 'Enter Name (Arabic)',
          content: isArabic
            ? 'أدخل اسم المنتج باللغة العربية.'
            : 'Enter the product name in Arabic.',
          selector: '#title-ar-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Product Title (English)
        {
          title: isArabic ? 'إدخال الاسم بالإنجليزية' : 'Enter Name (English)',
          content: isArabic
            ? 'أدخل اسم المنتج باللغة الإنجليزية.'
            : 'Enter the product name in English.',
          selector: '#title-en-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Product Description (Arabic)
        {
          title: isArabic ? 'إدخال الوصف بالعربية' : 'Enter Description (Arabic)',
          content: isArabic
            ? 'أدخل وصف المنتج باللغة العربية.'
            : 'Enter the product description in Arabic.',
          selector: '#description-ar-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Product Description (English)
        {
          title: isArabic ? 'إدخال الوصف بالإنجليزية' : 'Enter Description (English)',
          content: isArabic
            ? 'أدخل وصف المنتج باللغة الإنجليزية.'
            : 'Enter the product description in English.',
          selector: '#description-en-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Category Selection
        {
          title: isArabic ? 'اختيار القسم' : 'Select Category',
          content: isArabic
            ? 'اختر القسم التي ينتمي إليها المنتج.'
            : 'Select the category the product belongs to.',
          selector: '#category-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Barcode Switch
        {
          title: isArabic ? 'هل يوجد باركود؟' : 'Is there a Barcode?',
          content: isArabic
            ? 'حدد ما إذا كان المنتج يحتوي على باركود.'
            : 'Select whether the product has a barcode.',
          selector: '#barcode-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Stock Switch
        {
          title: isArabic ? 'هل المنتج متوفر في المخزون؟' : 'Is the product in stock?',
          content: isArabic
            ? 'حدد ما إذا كان المنتج متاحًا في المخزون.'
            : 'Select whether the product is available in stock.',
          selector: '#stock-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Stock Quantity
        {
          title: isArabic ? 'إدخال عدد المنتجات في المخزون' : 'Enter Stock Quantity',
          content: isArabic
            ? 'أدخل الكمية المتوفرة من المنتج في المخزون.'
            : 'Enter the available stock quantity for the product.',
          selector: '#stock-quantity-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Price Input
        {
          title: isArabic ? 'إدخال السعر' : 'Enter Price',
          content: isArabic
            ? 'أدخل السعر النهائي للمنتج.'
            : 'Enter the product price.',
          selector: '#price-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Buying Price Input
        {
          title: isArabic ? 'إدخال سعر الشراء' : 'Enter Buying Price',
          content: isArabic
            ? 'أدخل سعر الشراء للمنتج.'
            : 'Enter the product buying price.',
          selector: '#buying-price-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Discount Switch
        {
          title: isArabic ? 'هل يوجد خصم؟' : 'Is there a Discount?',
          content: isArabic
            ? 'حدد ما إذا كان هناك خصم للمنتج.'
            : 'Select whether the product has a discount.',
          selector: '#discount-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Discount Type
        {
          title: isArabic ? 'اختيار نوع الخصم' : 'Select Discount Type',
          content: isArabic
            ? 'حدد نوع الخصم (نسبة مئوية أو قيمة ثابتة).'
            : 'Select the discount type (Percentage or Fixed Value).',
          selector: '#discount-type-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Discount Value
        {
          title: isArabic ? 'إدخال قيمة الخصم' : 'Enter Discount Value',
          content: isArabic
            ? 'أدخل قيمة الخصم للمنتج.'
            : 'Enter the discount value for the product.',
          selector: '#discount-value-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Product Image Upload
        {
          title: isArabic ? 'رفع صورة المنتج' : 'Upload Product Image',
          content: isArabic
            ? 'قم برفع صورة للمنتج هنا.'
            : 'Upload the product image here.',
          selector: '#image-upload-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },

        // Submit Product
        {
          title: isArabic ? 'إرسال المنتج' : 'Submit Product',
          content: isArabic
            ? 'اضغط على الزر لإرسال بيانات المنتج.'
            : 'Click to submit the product data.',
          selector: '#submit-product-step',
          side: 'right',
          showControls: true,
          showSkip: true,
          icon: <FiZap />,
        },
      ],
    },
  ];
}
