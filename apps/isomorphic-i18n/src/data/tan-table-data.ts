export type Branches = {
  id: string;
  name: string;
  totalSales: string;
  status: string;
  isActive: string;
  openAt: string,
  closedAt: string,
  deliveryTime: string,
  userName: string;
};
export type categoryPrinterDtos = {
  id: string;
  nameEn: string;
  nameAr: string;
};
export type Printer = {
  id: any;
  name: any;
  totalCategories: number;
  ip: any;
  branch: any;
  categoryPrinterDtos: categoryPrinterDtos[];
  userName: any;
};
export type whatsApp = {
  id: string;
  name: string;
  phoneNumber: string;
  massage: string;
  sendingTime: string;
};
export type Categories = {
  id: string;
  name: string;
  bannerUrl: string;
  status: string;
  isActive: string;
  priority: string,
  numberOfColumns: string,
  numberOfProducts: string,
  userName: string;
};
export type Product = {
  id: string;
  name: string;
  description: string;
  categoryName: string;
  imageUrl: string;
  oldPrice: string;
  price: string;
  status: string;
  isActive: string;
  isTopSelling: string;
  isTopRated: string;
  numberOfSales: string;
  createdAt: string;
  lastUpdatedAt: string;
  stocks: any[];
  userName: string;
};
export type Faq = {
  id: string;
  name: string;
  title: string;
  metaDescription: string;
  image: string;
  faqNumber: string;
  faQs: any;
  userName: string;
};
export type Products = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  quantity: number;
}
export type CouponEntity = {
  id: string;
  usageNumbers: any;
  code: any;
  discountType: any;
  discountValue: any;
  expireDate: any;
  createdAt: any;
  isActive: any;
  isBanner: any;
  usageLimit: any;
  userName: any;
};

export type CouponResponse = {
  entities: CouponEntity[];
  nextPage: number;
  totalPages: number;
};
export type AbandonedOrdersResponse = {
  entities: CouponEntity[];
  nextPage: number;
  totalPages: number;
};


export type PhoneNumberOrder = {
  phoneNumber: string;
  currencyAbbreviation: string;
  orderCost: number;
  visitTime: any;
};

// Define the type for the main object containing shopId and phoneNumbers
export type ShopOrder = {
  shopId: string;
  phoneNumbers: PhoneNumberOrder[];
};
