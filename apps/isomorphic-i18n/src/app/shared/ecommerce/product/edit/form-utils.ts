import { CreateProductInput } from '@/validators/create-product.schema';
// import isEmpty from 'lodash/isEmpty';

export const customFields = [
  {
    label: '',
    value: '',
  },
];
export const locationShipping = [
  {
    name: '',
    shippingCharge: '',
  },
];
export const productVariants = [
  {
    label: '',
    value: '',
  },
];

export function defaultValues(product?: CreateProductInput) {
  return {
    titleEn: product?.titleEn,
    titleAr: product?.titleAr,
    categories: product?.categories,
    descriptionEn: product?.descriptionEn ?? '',
    descriptionAr: product?.descriptionAr ?? '',
    price: product?.price ?? 0, // Ensure a default number
    // oldPrice: product?.oldPrice ?? 0,
    productImages: product?.productImages, // ✅ Ensure always an array
    pageTitleEn: product?.pageTitleEn ?? '',
    pageTitleAr: product?.pageTitleAr ?? '',
    metaDescriptionEn: product?.metaDescriptionEn ?? '',
    metaDescriptionAr: product?.metaDescriptionAr ?? '',
    productVariants: Array.isArray(product?.productVariants)
      ? product.productVariants.map((variant) => ({
          nameEn: variant?.nameEn ?? '',
          nameAr: variant?.nameAr ?? '',
          priority: variant?.priority ?? 0,
          buttonType: variant?.buttonType ?? undefined,
          isRequired: variant?.isRequired ?? false,
          choices: Array.isArray(variant?.choices)
            ? variant?.choices.map((choice) => ({
                nameAr: choice.nameAr ?? '',
                nameEn: choice.nameEn ?? '',
                price: choice.price ?? 0,
                isDefault: choice.isDefault ?? false,
                image: choice.image ?? '',
              }))
            : [],
        }))
      : [], // ✅ Ensure always an array
  };
}


export const productData = {
  title: 'Apple',
  description: 'Fresh Express Iceberg Garden Salad Blend',
  sku: 'SKU-28935',
  type: 'Digital Product',
  categories: 'Grocery',
  price: 10,
  costPrice: 20,
  retailPrice: 15,
  salePrice: 25,
  productImages: undefined,
  inventoryTracking: 'no',
  currentStock: '150',
  lowStock: '20',
  productAvailability: 'online',
  tradeNumber: '12345',
  manufacturerNumber: '154',
  brand: 'Foska',
  upcEan: 'Ean',
  customFields: [
    {
      label: 'Color',
      value: 'Red',
    },
  ],
  freeShipping: false,
  shippingPrice: 45,
  locationBasedShipping: true,
  locationShipping: [
    {
      name: 'USA',
      shippingCharge: '150',
    },
  ],
  pageTitle: 'apple',
  metaDescription: 'apple',
  metaKeywords: 'grocery, foods',
  productUrl: 'http://localhost:3000/',
  isPurchaseSpecifyDate: true,
  isLimitDate: true,
  dateFieldName: 'Date Field',
  productVariants: [
    {
      name: 'Jhon',
      value: '150',
    },
  ],
  tags: ['iPhone', 'mobile'],
};

export const menuItems = [
  {
    label: 'Summary',
    value: 'summary',
  },
  {
    label: 'Images & Gallery',
    value: 'images_gallery',
  },
  {
    label: 'Pricing & Inventory',
    value: 'pricing_inventory',
  },
  {
    label: 'Product Identifiers & Custom Fields',
    value: 'product_identifiers',
  },
  {
    label: 'Shipping & Availability',
    value: 'shipping_availability',
  },
  {
    label: 'SEO',
    value: 'seo',
  },
  {
    label: 'Variant Options',
    value: 'variant_options',
  },
];

// Category option
export const categoryOption = [
  {
    value: 'fruits',
    label: 'Fruits',
  },
  {
    value: 'grocery',
    label: 'Grocery',
  },
  {
    value: 'meat',
    label: 'Meat',
  },
  {
    value: 'cat food',
    label: 'Cat Food',
  },
];

// Type option
export const typeOption = [
  {
    value: 'digital product',
    label: 'Digital Product',
  },
  {
    value: 'physical product',
    label: 'Physical Product',
  },
];

// Variant option
export const variantOption = [
  {
    value: 'single',
    label: 'Single',
  },
  {
    value: 'multiple',
    label: 'Multiple',
  },
];
