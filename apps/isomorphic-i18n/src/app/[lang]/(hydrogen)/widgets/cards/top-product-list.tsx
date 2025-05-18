'use client'
import Image from 'next/image';
import WidgetCard from '@components/cards/widget-card';
import { Button, Text } from 'rizzui';
import { topProductList } from '@/data/top-products-data';
import Rating from '@components/rating';
import { useTranslation } from '@/app/i18n/client';
import cn from '@utils/class-names';
import { TopSellingProduct } from '../../statistics/page';
import { useEffect } from 'react';

export default function TopProductList({ lang, currency,className, topSellingProducts }: { lang?: string; currency?:string; className?: string; topSellingProducts?: TopSellingProduct[] }) {
  const { t } = useTranslation(lang!, 'common');
  useEffect(() => {
    console.log('topSellingProducts', topSellingProducts);

  }, [])

  return (
    <WidgetCard
      title={lang==='ar'?'أعلى المنتجات':'Top Products'}
      titleClassName="leading-none"
      headerClassName="mb-3 lg:mb-4"
      // action={
      // <Button variant="outline" size="sm" className="text-sm">
      //   {t('text-view-all')}
      // </Button>
      // }
      className={cn(className)}

    >
      <div className="grid grid-cols-1 gap-5">
        {topSellingProducts?.map((product) => (
          <div
            key={product.productId}
            className="flex items-start pe-2"
          >
            <div className="relative me-3 h-11 w-11 shrink-0 overflow-hidden rounded bg-gray-100">
              <Image
                src={product.productImage}
                alt={lang === 'ar' ? product.productNameAr : product.productNameEn}
                fill
                sizes="(max-width: 768px) 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex w-full items-start justify-between">
              <div>
                <Text className="font-lexend text-sm font-semibold text-gray-900 dark:text-gray-700">
                  {lang === 'ar' ? product.productNameAr : product.productNameEn}
                </Text>
                <Text className="text-gray-500">{product.totalRevenue.toLocaleString()}{" "}{currency}</Text>
              </div>
              <div>
              <div>
                <Text className="font-lexend text-sm font-semibold text-gray-900 dark:text-gray-700">
                <Rating rating={[4, 4.5, 5]} />
                </Text>
                <Text className="text-gray-500 text-center">

                  {product.totalQuantitySold} {lang==='ar'?'قطع':'Pieces'}
                </Text>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
