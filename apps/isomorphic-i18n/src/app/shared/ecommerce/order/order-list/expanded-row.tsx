import Image from 'next/image';
import { PiXBold } from 'react-icons/pi';
import { Title, Text } from 'rizzui';
import image from '@public/assets/usrbig1.jpg';
import { toCurrency } from '@utils/to-currency';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

const translations = {
  en: {
    noProduct: 'No product available',
    itemPrice: 'Item Price',
    choicesPrice: 'Choices Price',
    quantity: 'Quantity',
    totalPrice: 'Total Price',
  },
  ar: {
    noProduct: 'لا يوجد منتج متاح',
    itemPrice: 'سعر المنتج',
    choicesPrice: 'سعر الإضافات',
    quantity: 'الكمية',
    totalPrice: 'السعر الإجمالي',
  },
};
export default function ExpandedOrderRow({ record, lang, currencyAbbreviation }: { record: any; lang: string; currencyAbbreviation: string }) {
  console.log("record: ", record);
  const t = translations[lang as 'en' | 'ar'] || translations.en;
  if (record?.items?.length === 0) {
    return <Text>{t.noProduct}</Text>;
  }
  return (
    <div className="grid grid-cols-1 divide-y bg-white px-3.5 dark:bg-gray-50">
      {record?.items.map((product: any) => (
        <article
          key={record.id + product.product.name}
          className="flex items-center justify-between py-6 first-of-type:pt-2.5 last-of-type:pb-2.5"
        >
          <div className="flex items-start">
            <div className="relative me-4 aspect-[80/60] w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <img
                src={product.product.images[0]?.imageUrl ? product.product.images[0].imageUrl : image}
                alt={product.product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <header>
              <Title as="h4" className="mb-0.5 text-sm font-medium">
                {product.product.name}
              </Title>
              {/* <Text className="mb-1 text-gray-500">{product.product.images[0].entityType}</Text> */}
              <Text className="text-xs text-gray-500 flex items-center gap-1">
                {t.itemPrice}: {`${product.itemPrice}`}{currencyAbbreviation === "ر.س" ? (
                  <Image src={sarIcon} alt="SAR" width={10} height={10} />
                ) : (
                  <span>{currencyAbbreviation}</span>
                )}
              </Text>
              <Text className="text-xs text-gray-500 flex items-center gap-1">
                {t.choicesPrice}: {`${product.totalChoicesPrice}`}{currencyAbbreviation === "ر.س" ? (
                  <Image src={sarIcon} alt="SAR" width={10} height={10} />
                ) : (
                  <span>{currencyAbbreviation}</span>
                )}
              </Text>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.orderItemVariations?.map((variation: any) =>
                  variation.choices?.map((choice: any) => (
                    <span
                      key={choice.choiceId}
                      className="bg-gray-100 text-gray-700 px-2 py-[2px] rounded-md text-xs max-w-[100px] truncate"
                      title={lang === 'ar' ? choice.choiceNameAr : choice.choiceNameEn}
                    >
                      {lang === 'ar' ? choice.choiceNameAr : choice.choiceNameEn}
                    </span>
                  ))
                )}
              </div>
            </header>
          </div>
          <div className="flex w-full max-w-xs items-center justify-between gap-4">
            <div className="flex items-center">
              <PiXBold size={13} className="me-1 text-gray-500" />{' '}
              <Text
                as="span"
                className="font-medium text-gray-900 dark:text-gray-700"
              >
                {product.quantity}
              </Text>
            </div>
            <Text className="font-medium text-gray-900 dark:text-gray-700 flex items-center gap-1">
              {`${((parseFloat(product.quantity ?? "0") * parseFloat(product.itemPrice ?? "0")) + parseFloat(product.totalChoicesPrice ?? "0")).toFixed(2)}`} {currencyAbbreviation === "ر.س" ? (
                <Image src={sarIcon} alt="SAR" width={10} height={10} />
              ) : (
                <span>{currencyAbbreviation}</span>
              )}
            </Text>
          </div>
        </article>
      ))}
    </div>
  );
}
