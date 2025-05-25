import { metaObject } from '@/config/site.config';
import OrdersTable from '@/app/shared/ecommerce/order/order-list/table';
import PageHeader from '@/app/shared/page-header';
import { Image_BASE_URL } from '@/config/base-url';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import WidgetCard from '@components/cards/widget-card';
import { fetchShopData } from '@/app/api/shop';

export const metadata = {
  ...metaObject('Orders'),
};
const orderData = [
  {
    "id": "4b039bab-b4f7-431f-a7bc-6f5409e59c37",
    "paymentMethod": 0,
    "totalPrice": 349,
    "status": 1,
    "createdAt": "2025-02-05T09:00:40.3649753",
    "lastUpdatedAt": "0001-01-01T00:00:00",
    "orderType": 0,
    "shippingFees": 0,
    "tableNumber": 0,
    "isPaid": false,
    "address": {
      "id": "9f2bf4dd-7052-42f1-bb6b-8fe86fa4aee3",
      "apartmentNumber": 5,
      "floor": "4",
      "street": "hhgg",
      "latitude": 30.0571,
      "longtude": 31.2074,
      "buildingType": 0
    },
    "items": [
      {
        "quantity": 1,
        "totalChoicesPrice": 50,
        "itemPrice": 299,
        "productId": "a640e3df-16d1-4608-9544-05fb13251857",
        "product": {
          "name": "محشي",
          "images": [
            {
              "entityId": "a640e3df-16d1-4608-9544-05fb13251857",
              "entityType": "Product",
              "imageUrl": `${Image_BASE_URL}5aa59058-05e6-40dd-b840-dc98850e0e1d_1628722022596.jpg`,
              "isPrimary": false
            }
          ]
        }
      }
    ]
  },
  {
    "id": "5b6cc56a-5db1-4748-99ce-f7082c875214",
    "paymentMethod": 0,
    "totalPrice": 98,
    "status": 1,
    "createdAt": "2025-02-05T08:50:11.9386401",
    "lastUpdatedAt": "0001-01-01T00:00:00",
    "orderType": 0,
    "shippingFees": 0,
    "tableNumber": 0,
    "isPaid": false,
    "address": {
      "id": "9f2bf4dd-7052-42f1-bb6b-8fe86fa4aee3",
      "apartmentNumber": 5,
      "floor": "4",
      "street": "hhgg",
      "latitude": 30.0571,
      "longtude": 31.2074,
      "buildingType": 0
    },
    "items": [
      {
        "quantity": 1,
        "totalChoicesPrice": 50,
        "itemPrice": 50,
        "productId": "a546e5ef-b9a9-4fca-abfe-093011534ffc",
        "product": {
          "name": "بيتزا",
          "images": []
        }
      }
    ]
  }
];  
// const orderData = [
//   {
//     id: '3413',
//     name: 'Dr. Ernest Fritsch-Shanahan',
//     email: 'August17@hotmail.com',
//     avatar:
//       'https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-15.webp',
//     items: 83,
//     price: '457.00',
//     status: 'Cancelled',
//     createdAt: '2023-08-06T00:01:51.735Z',
//     updatedAt: '2023-08-10T22:39:21.113Z',
//     products: [
//       {
//         id: '0o02051402',
//         name: 'Tasty Metal Shirt',
//         category: 'Shoes',
//         image:
//           'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/7.webp',
//         price: '410.00',
//         quantity: 2,
//       },
//       {
//         id: '0o17477064',
//         name: 'Modern Cotton Gloves',
//         category: 'Watch',
//         image:
//           'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/5.webp',
//         price: '342.00',
//         quantity: 3,
//       },
//       {
//         id: '0o02374305',
//         name: 'Rustic Steel Computer',
//         category: 'Shoes',
//         image:
//           'https://isomorphic-furyroad.s3.amazonaws.com/public/products/modern/6.webp',
//         price: '948.00',
//         quantity: 1,
//       },
//     ],
//   },
// ]; 
 export default async function Orders({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const shopId = GetCookiesServer('shopId');
  const shopData = await fetchShopData(lang, shopId as string);
  const pageHeader = {
    title: lang === 'ar' ? 'الطلبات' : 'Orders',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'الطلبات' : 'Orders',
      },
    ],
  };
  return <>
    <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
    <WidgetCard title={lang == 'ar'? 'جدول الطلبات':'Orders Table'} className="flex flex-col gap-4">
      <OrdersTable shopId={shopId || ''} lang={lang} initData={orderData} currencyAbbreviation={shopData?.currencyAbbreviation} />
    </WidgetCard>
  </>;
}


