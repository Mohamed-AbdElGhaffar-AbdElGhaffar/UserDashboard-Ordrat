import type { CouponType } from "@/config/enums";
import { StaticImageData } from "next/image";

export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  slug: string;
  amount?: string;
  code?: string;
}

export interface Address {
  customerName?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  street?: string;
}

export interface GoogleMapLocation {
  lat?: number;
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export interface ProductColor {
  name?: string;
  code?: string;
}

export interface CartItem {
  // not need
  slug?: string;
  color?: ProductColor | null;
  salePrice?: number;
  size?: number;
  stock?: number;

  // the product information Not Important
  sizeFood?: string;

  // the product information
  id: number | string;
  name: string;
  description?: string;
  image: string | StaticImageData;
  price: number;
  oldPrice?: number;
  quantity: number;
  discount?: number;

  // Variations
  // Order-related information
  specialInstructions?: string;
  notes?: string;

  orderItemVariations?: {
    variationId: string;
    variationLable: string;
    choices: {
      image?: string;
      inputValue?: string;
      specialInstructions?: string;
      choiceId?: string;
      choiceValue?: string;
    }[];
  }[];
}

interface Variation {
  id: string;
  name: string;
  buttonType: number;
  isActive:boolean;
  isRequired:boolean;
  choices: Choice[];
}

interface Choice {
  id: string;
  name?: string;
  imageUrl?: string;
  price?: number;
  isActive:boolean;
  isDefault:boolean;
}

export type FoodId= {
  id: string;
  name: string;
  description: string;
  vat: number;
  vatType: number;
  discount: number;
  discountType: number;
  isActive: boolean;
  createdAt: string;
  lastUpdatedAt: string;
  isTopSelling: boolean;
  isTopRated: boolean;
  seoDescription: string | null;
  imageUrl: string;
  categoryId: string;
  numberOfSales: number;
  category: string | null;
  variations: Variation[];
  frequentlyOrderedWith: any[]; // يمكنك تخصيص نوع البيانات بناءً على شكل الـ frequentlyOrderedWith إذا كانت معلومة.
  reviews: any[]; // يمكنك تخصيص نوع البيانات بناءً على شكل الـ reviews إذا كانت معلومة.
  price: number;
  oldPrice?: number; // الحقل اختياري لأنه يمكن أن يكون غير موجود في بعض الحالات.
}

export type FullProduct = {
  id: string
  vat: number
  vatType: number
  discount: number
  discountType: number
  isTopSelling: boolean
  isTopRated: boolean
  seoDescription: string
  categoryId: string
  numberOfSales: number
  variations: Array<{
    id: string
    name: string
    buttonType: number
    isActive: boolean
    productId: string
    choices: Array<{
      id: string
      name: string
      price: number
      isDefault: boolean
      isActive: boolean
      variationId: string
    }>
  }>
  frequentlyOrderedWith: Array<{
    productId: string
    relatedProductId: string
    relatedProduct: {
      id: string
      price: number
      oldPrice: number
      imageUrl: string
    }
  }>
  reviews: Array<{
    reviewText: string
    rate: number
    createdAt: string
    lastUpdatedAt: string
    endUserId: string
  }>
  name: string
  price: number
  oldPrice: number
  description: string
  imageUrl: string
  isActive: boolean
  createdAt: string
  lastUpdatedAt: string
  isOffer: boolean
}

export interface Product {
  variations?: never[];
  id: number;
  slug?: string;
  title: string;
  description?: string;
  price: number;
  sale_price?: number;
  thumbnail: string;
  colors?: ProductColor[];
  sizes?: number[];
}

export interface PosProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  quantity: number;
  size: number;
  discount?: number;
}
export interface CalendarEvent {
  id?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
  description?: string;
  location?: string;
}

export interface FlightingCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  meta?: {
    model: string;
    hours: string;
    stop: string;
  };
  class: string;
  bucket: {
    luggage?: string;
    bag?: string;
  };
  airlines?: string;
  routes?: {
    arrivalDate: Date | string;
    arrivalTime: Date | string;
    departureDate: Date | string;
    departureTime: Date | string;
    departureCityCode: string;
    departureCity: string;
    departureTerminal: string;
    arrivalCityCode: string;
    arrivalCity: string;
    arrivalTerminal: string;
    layover: {
      layoverCityCode: string;
      layoverCity: string;
      layoverTerminal: string;
      layoverTime: string;
    }[];
  };
  cheapest?: boolean;
  best?: boolean;
  quickest?: boolean;
}

export type ShopInfo = {
  createdAt: string;
  lastUpdatedAt: string;
  qr: string; 
  languages: number; 
  // title:string;
  // metaDescription:string;
  descriptionAr:string;
  descriptionEn:string;
  showAllCouponsInSideBar:boolean;
  applyFreeShppingOnTarget:boolean;
  applyServiceOnDineInOnly:boolean;
  applyVatOnDineInOnly:boolean;
  freeShppingTarget:string;
  titleAr:string;
  titleEn:string;
  metaDescriptionAr:string;
  metaDescriptionEn:string;
  backgroundUrl: string|any; 
  shopType: number; 
  vat: number; 
  vatType: number; 
  service: number; 
  logoUrl: string|any; 
  name:string;
  nameAr: string; 
  nameEn: string; 
  currencyId: string; 
  currencyName: string; 
  subdomainName: string;
  mainColor: string;
  secondaryColor: string;
  topRatedIsEnabled: boolean; 
  topSellingIsEnabled: boolean; 
};


export type ContactInfo = {
  id: string;
  whatsAppNumber: string;
  facebookLink: string;
  xLink: string;
  instagramLink: string;
};
export type termInfo = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  termType: string;
};


export type OrderItemImages = {
  id: string;
  imageUrl: string;
  isPrimary: true;
}
export type OrderItem = {
  id: string;
  quantity: number;
  totalChoicesPrice: number;
  itemPrice: number;
  productId: string;
  cancelled: boolean;
  orderItemVariations: any[];
  product: {
    name: string;
    images: OrderItemImages[];
  };
};

export type orderAdress = {
  id: string;
  additionalDirections?: string;
  apartmentNumber?: number;
  floor?: string;
  street?: string;
  latitude?: number;
  longtude?: number;
  buildingType?: number;
};

export type Order = {
  id: string;
  price: number;
  totalPrice: number;
  totalVat: number;
  shippingFees: number;
  createdAt: string;
  status: number;
  type: number;
  totalChoicePrices: number;
  address:orderAdress;
  items: OrderItem[];
};

export interface MaxMindCountry {
  iso_code: string;
  names: {
    [key: string]: string;
  };
}

export interface GeoLocationResult {
  country?: MaxMindCountry;  // Use our compatible type definition
  ip: string;
  error?: string;
  note?: string;
}