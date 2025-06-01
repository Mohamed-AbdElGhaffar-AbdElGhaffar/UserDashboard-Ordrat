export function generatePagesFromRoles(roles: string[], lang: string = 'en') {
  const groupedLabels: { permissions: string[]; label: { en: string; ar: string } }[] = [
    {
      permissions: ['UpdateBranch', 'GetBranchById'],
      label: { en: 'Update Branch', ar: 'تعديل فرع' },
    },
    {
      permissions: ['ActivateBranch', 'DeActivateBranch'],
      label: { en: 'Change Status', ar: 'تغيير الحالة' },
    },
    {
      permissions: ['sellerDashboard-delivery-create'],
      label: { en: 'Add Driver', ar: 'اضافة سائق' },
    },
    {
      permissions: ['sellerDashboard-storeProducts-products-create'],
      label: { en: 'Add Product', ar: 'اضافة منتج' },
    },
    {
      permissions: ['sellerDashboard-storeProducts-products-update'],
      label: { en: 'Update Product', ar: 'تعديل منتج' },
    },
    {
      permissions: ['ShopGetById', 'sellerDashboard-storeSetting-additional-settings'],
      label: { en: 'View Coupons and Free Shipping', ar: 'عرض القسائم والشحن المجاني' },
    },
    {
      permissions: ['UpdateShop', 'sellerDashboard-storeSetting-additional-settings'],
      label: { en: 'Update Coupons and Free Shipping', ar: 'تعديل القسائم والشحن المجاني' },
    },
    {
      permissions: ['ShopGetById', 'sellerDashboard-storeSetting-basicData'],
      label: { en: 'View Shop Basic Data', ar: 'عرض بيانات المتجر الاساسية' },
    },
    {
      permissions: ['UpdateShop', 'sellerDashboard-storeSetting-basicData'],
      label: { en: 'Update Shop Basic Data', ar: 'تعديل بيانات المتجر الاساسية' },
    },
    {
      permissions: ['CreateShopContactInfo', 'UpdateShopContactInfo'],
      label: { en: 'Update Contact Information', ar: 'تعديل بيانات التواصل' },
    },
    {
      permissions: ['GetPixelsByShopId', 'PixelUpdate', 'AssignPixelToShop', 'DeassignPixelFromShop'],
      label: { en: 'Change Platforms', ar: 'تغيير المنصة' },
    },
    {
      permissions: ['delivery-chat'],
      label: { en: 'Chat with Driver', ar: 'التواصل مع السائق' },
    },
    {
      permissions: ['sellerDashboard-orders'],
      label: { en: 'View All Orders', ar: 'عرض كل الطلبات' },
    },
    {
      permissions: ['sellerDashboard-storeProducts-categories'],
      label: { en: 'View All Categories', ar: 'عرض كل الأقسام' },
    },
    {
      permissions: ['sellerDashboard-storeProducts-products'],
      label: { en: 'View All Products', ar: 'عرض كل المنتجات' },
    },
    {
      permissions: ['sellerDashboard-coupon'],
      label: { en: 'View all Coupons', ar: 'عرض كل الكوبونات' },
    },
    {
      permissions: ['sellerDashboard-faq'],
      label: { en: 'View All FAQ', ar: 'عرض كل الأسئلة الشائعة' },
    },
    {
      permissions: ['sellerDashboard-delivery'],
      label: { en: 'View All Delivery Drivers', ar: 'عرض كل سائقي التوصيل' },
    },
    {
      permissions: ['ShopGetById', 'UpdateShop', 'sellerDashboard-storeSetting-seo'],
      label: { en: 'Control Search Engine Optimization', ar: 'التحكم في محركات البحث' },
    },
    {
      permissions: ['sellerDashboard-marketingtools-whatsapp'],
      label: { en: 'Control WhatsApp', ar: 'التحكم في الواتساب' },
    },
    {
      permissions: ['sellerDashboard-point-of-sale'],
      label: { en: 'Control POS', ar: 'التحكم في الكاشير' },
    },
    {
      permissions: ['sellerDashboard-statistics'],
      label: { en: 'Control Statistics', ar: 'التحكم في الاحصائيات' },
    },
    {
      permissions: ['sellerDashboard-storeSetting-qr-code'],
      label: { en: 'Control Barcode', ar: 'التحكم في الباركود' },
    },
    {
      permissions: ['sellerDashboard-term-privacy'],
      label: { en: 'Control Privacy Policy', ar: 'التحكم في سياسة الخصوصية' },
    },
    {
      permissions: ['sellerDashboard-term-refund'],
      label: { en: 'Control Refund Policy', ar: 'التحكم في سياسة الاسترداد' },
    },
    {
      permissions: ['sellerDashboard-tables-create'],
      label: { en: 'Add Table', ar: 'اضافة طاولة' },
    },
    {
      permissions: ['AssignCategoryPrinter', 'DeleteCategoryPrinter'],
      label: { en: 'Assign Category Printer', ar: 'تعيين اقسام الطابعة' },
    },
    {
      permissions: ['sellerDashboard-affiliate'],
      label: { en: 'Control Affiliate Program', ar: 'التحكم في برنامج الشركاء' },
    },
  ];

  const translatePermission = (perm: string): { en: string; ar: string } => {
    const translations: Record<string, { en: string; ar: string }> = {
      CreateBranch: { en: 'Create Branch', ar: 'اضافة فرع' },
      DeleteBranch: { en: 'Delete Branch', ar: 'حذف فرع' },
      UpdateBranch: { en: 'Update Branch', ar: 'تعديل فرع' },
      GetBranchById: { en: 'View Branches', ar: 'رؤية الفروع' },
      GetBranchByShopId: { en: 'View Branches', ar: 'عرض الفروع' },
      ActivateBranch: { en: 'Activate Branch', ar: 'تفعيل الفرع' },
      DeActivateBranch: { en: 'Deactivate Branch', ar: 'إلغاء تفعيل الفرع' },
      
      GetDeliverById: { en: 'Driver Details', ar: 'تفاصيل السائق' },

      CreateFAQCategory: { en: 'Create FAQ', ar: 'إضافة سؤال' },
      UpdateFAQCategory: { en: 'Update FAQ', ar: 'تعديل سؤال' },
      DeleteFAQCategory: { en: 'Delete FAQ', ar: 'حذف سؤال' },

      ViewRoles: { en: 'View Roles', ar: 'رؤية الصلاحيات' },
      AddEmployee: { en: 'Add Employee', ar: 'إضافة موظف' },
      DeleteEmployee: { en: 'Delete Employee', ar: 'حذف موظف' },
      GetAllEmployee: { en: 'Get All Employees', ar: 'عرض كل الموظفين' },
      GetAllShopGroups: { en: 'Get Shop Groups', ar: 'عرض مجموعات المتجر' },
      
      ViewBanner: { en: 'View Banners', ar: 'عرض البانرات' },
      CreateBanner: { en: 'Create Banner', ar: 'إضافة بانر' },
      UpdateBanner: { en: 'Update Banner', ar: 'تعديل بانر' },
      DeleteBanner: { en: 'Delete Banner', ar: 'حذف بانر' },

      OrderDetails: { en: 'Order Details', ar: 'تفاصيل الطلب' },

      CreateCategory: { en: 'Create Category', ar: 'اضافة قسم' },
      DeleteCategory: { en: 'Delete Category', ar: 'حذف قسم' },
      UpdateCategory: { en: 'Update Category', ar: 'تعديل قسم' },
      ChangeCategoryActivationStatus: { en: 'Change Status', ar: 'تغيير الحالة' },
      
      DeleteProducts: { en: 'Delete Product', ar: 'حذف منتج' },
      ChangeProductsActivationStatus: { en: 'Change Status', ar: 'تغيير الحالة' },
      
      CreateCoupon: { en: 'Create Coupon', ar: 'اضافة كوبون' },
      UpdateCoupon: { en: 'Update Coupon', ar: 'تعديل كوبون' },
      DeleteCoupon: { en: 'Delete Coupon', ar: 'حذف كوبون' },
      
      CreateFakeData: { en: 'Create Fake Data', ar: 'اضافة بيانات مزيفة' },
      UpdateFakeData: { en: 'Update Fake Data', ar: 'تعديل بيانات مزيفة' },
      GetFakeDataByShopId: { en: 'View Fake Data', ar: 'عرض بيانات مزيفة' },
      
      ShopContactInfoGetByShopId: { en: 'View Contact Information', ar: 'عرض بيانات التواصل' },

      PixelGetAll: { en: 'View Platforms', ar: 'عرض المنصات' },

      UpdateTable: { en: 'Update Table', ar: 'تعديل الطاولة' },
      DeleteTable: { en: 'Delete Table', ar: 'حذف الطاولة' },

      CreatePrinter: { en: 'Create Printer', ar: 'إضافة طابعة' },
      UpdatePrinter: { en: 'Update Printer', ar: 'تعديل الطابعة' },
      DeletePrinter: { en: 'Delete Printer', ar: 'حذف الطابعة' },
    };
    return translations[perm] ?? { en: perm, ar: perm };
  };

  const dataMap = [
    { 
      key: 'sellerDashboard-branches', 
      nameEn: 'Branches', 
      nameAr: 'الفروع', 
      permissions: ['CreateBranch', 'DeleteBranch', 'UpdateBranch', 'GetBranchById', 'GetBranchByShopId', 'ActivateBranch', 'DeActivateBranch'] 
    },
    { 
      key: 'sellerDashboard-delivery', 
      nameEn: 'Delivery Drivers', 
      nameAr: 'سائقي التوصيل', 
      permissions: ['GetDeliverById', 'sellerDashboard-delivery-create', 'delivery-chat','sellerDashboard-delivery'] 
    },
    { 
      key: 'sellerDashboard-faq', 
      nameEn: 'FAQ', 
      nameAr: 'الأسئلة الشائعة', 
      permissions: ['CreateFAQCategory', 'UpdateFAQCategory', 'DeleteFAQCategory', 'sellerDashboard-faq'] 
    },
    { 
      key: 'sellerDashboard-groups-permissions', 
      nameEn: 'Groups & Permissions', 
      nameAr: 'الجروبات والصلاحيات', 
      permissions: ['GetAllEmployee', 'GetAllShopGroups', 'AddEmployee', 'DeleteEmployee', 'ViewRoles'] 
    },
    { 
      key: 'sellerDashboard-marketingtools-banner', 
      nameEn: 'Banner', 
      nameAr: 'البانر', 
      permissions: ['CreateBanner', 'ViewBanner', 'DeleteBanner', 'UpdateBanner'] 
    },
    { 
      key: 'sellerDashboard-orders', 
      nameEn: 'Orders', 
      nameAr: 'الطلبات', 
      permissions: ['OrderDetails', 'sellerDashboard-orders'] 
    },
    { 
      key: 'sellerDashboard-storeProducts-categories', 
      nameEn: 'Categories', 
      nameAr: 'الأقسام', 
      permissions: ['CreateCategory', 'UpdateCategory', 'DeleteCategory', 'ChangeCategoryActivationStatus', 'sellerDashboard-storeProducts-categories'] 
    },
    { 
      key: 'sellerDashboard-storeProducts-products', 
      nameEn: 'Products', 
      nameAr: 'المنتجات', 
      permissions: ['sellerDashboard-storeProducts-products-create', 'sellerDashboard-storeProducts-products-update', 'DeleteProducts', 'ChangeProductsActivationStatus', 'sellerDashboard-storeProducts-products'] 
    },
    { 
      key: 'sellerDashboard-coupon', 
      nameEn: 'Coupon', 
      nameAr: 'كوبون', 
      permissions: ['CreateCoupon', 'UpdateCoupon', 'DeleteCoupon', 'sellerDashboard-coupon'] 
    },
    { 
      key: 'sellerDashboard-storeSetting-additional-settings', 
      nameEn: 'Additional Settings', 
      nameAr: 'اعدادات اضافيه', 
      permissions: ['GetFakeDataByShopId', 'UpdateFakeData', 'CreateFakeData', 'ShopGetById', 'UpdateShop', 'sellerDashboard-storeSetting-additional-settings'] 
    },
    { 
      key: 'sellerDashboard-storeSetting-basicData', 
      nameEn: 'Basic Data', 
      nameAr: 'البيانات الأساسية', 
      permissions: ['ShopGetById', 'UpdateShop', 'sellerDashboard-storeSetting-basicData'] 
    },
    { 
      key: 'sellerDashboard-storeSetting-contact-info', 
      nameEn: 'Contact Information', 
      nameAr: 'بيانات التواصل', 
      permissions: ['ShopContactInfoGetByShopId', 'CreateShopContactInfo', 'UpdateShopContactInfo'] 
    },
    { 
      key: 'sellerDashboard-storeSetting-platforms', 
      nameEn: 'Connecting to platforms', 
      nameAr: 'الربط مع المنصات', 
      permissions: ['PixelGetAll', 'GetPixelsByShopId', 'PixelUpdate', 'AssignPixelToShop', 'DeassignPixelFromShop'] 
    },
    { 
      key: 'sellerDashboard-tables', 
      nameEn: 'Tables', 
      nameAr: 'الطاولات', 
      permissions: ['sellerDashboard-tables-create', 'UpdateTable', 'DeleteTable'] 
    },
    { 
      key: 'sellerDashboard-printer', 
      nameEn: 'Printer', 
      nameAr: 'الطابعة', 
      permissions: ['CreatePrinter', 'UpdatePrinter', 'DeletePrinter', 'AssignCategoryPrinter', 'DeleteCategoryPrinter'] 
    },
    { 
      key: 'sellerDashboard-storeSetting-seo', 
      nameEn: 'Seo', 
      nameAr: 'تحسين محركات البحث', 
      permissions: ['ShopGetById', 'UpdateShop', 'sellerDashboard-storeSetting-seo'] 
    },
    { 
      key: 'sellerDashboard-marketingtools-whatsapp', 
      nameEn: 'Whats App', 
      nameAr: 'الواتساب', 
      permissions: ['sellerDashboard-marketingtools-whatsapp'] 
    },
    { 
      key: 'sellerDashboard-point-of-sale', 
      nameEn: 'Point of Sale', 
      nameAr: 'الكاشير', 
      permissions: ['sellerDashboard-point-of-sale'] 
    },
    { 
      key: 'sellerDashboard-statistics', 
      nameEn: 'Statistics', 
      nameAr: 'الاحصائيات', 
      permissions: ['sellerDashboard-statistics'] 
    },
    { 
      key: 'sellerDashboard-affiliate', 
      nameEn: 'Affiliate Program', 
      nameAr: 'برنامج الشركاء', 
      permissions: ['sellerDashboard-affiliate'] 
    },
    { 
      key: 'sellerDashboard-storeSetting-qr-code', 
      nameEn: 'QR Code', 
      nameAr: 'باركود', 
      permissions: ['sellerDashboard-storeSetting-qr-code'] 
    },
    { 
      key: 'sellerDashboard-term-privacy', 
      nameEn: 'Privacy Ploicy', 
      nameAr: 'سياسة الخصوصية', 
      permissions: ['sellerDashboard-term-privacy'] 
    },
    { 
      key: 'sellerDashboard-term-refund', 
      nameEn: 'Refund Ploicy', 
      nameAr: 'سياسة الاسترداد', 
      permissions: ['sellerDashboard-term-refund'] 
    },
  ];

  const pages = dataMap.reduce<any[]>((acc, page) => {
    const hasMainRole = roles.includes(page.key);
    if (!hasMainRole) return acc;

    const matchedRoles: { en: string; ar: string }[] = [];

    for (const group of groupedLabels) {
      const allPermsIncluded = group.permissions.every((perm) => roles.includes(perm));
      const validGroup = group.permissions.every((perm) => page.permissions.includes(perm));
      if (allPermsIncluded && validGroup) {
        matchedRoles.push(group.label);
      }
    }

    const groupedPermissions = groupedLabels.flatMap((g) => g.permissions);
    const remaining = page.permissions.filter((perm) => roles.includes(perm) && !groupedPermissions.includes(perm));

    for (const perm of remaining) {
      matchedRoles.push(translatePermission(perm));
    }

    if (matchedRoles.length > 0) {
      acc.push({
        name: lang === 'ar' ? page.nameAr : page.nameEn,
        roles: matchedRoles.map((r) => ({ name: r[lang as 'en' | 'ar'] })),
      });
    } else if (page.permissions.length === 0) {
      acc.push({ name: lang === 'ar' ? page.nameAr : page.nameEn });
    }

    return acc;
  }, []);

  return pages;
}
