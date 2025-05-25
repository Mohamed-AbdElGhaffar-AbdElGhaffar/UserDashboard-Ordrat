'use client'
import Image from 'next/image';
import WidgetCard from '@components/cards/widget-card';
import { Button, Progressbar, Text } from 'rizzui';
import { topProductList } from '@/data/top-products-data';
import Rating from '@components/rating';
import { useTranslation } from '@/app/i18n/client';
import cn from '@utils/class-names';
import { LowStockProduct, TopSellingProduct } from '../../statistics/page';
import { useEffect } from 'react';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

export default function LowStockProductList({ lang, className, LowStockProducts }: { lang?: string; className?: string; LowStockProducts: LowStockProduct[] }) {
  const { t } = useTranslation(lang!, 'common');
  useEffect(() => {
    console.log('topSellingProducts', LowStockProducts);

  }, [])
  const getProgressColor = (stock: number): string => {
    if (stock > 30) return 'success';
    if (stock > 10) return 'warning';
    return 'error';
  };
  const calculatePercentage = (value: number, max: number): number => {
    return Math.min((value / max) * 100, 100);  // لا يتجاوز 100%
  };
  return (
    <WidgetCard
      title={lang==='ar' ?'منتجات اوشكت علي النفاذ':'Low Stock Products'}
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
        {LowStockProducts?.map((product) => (
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
                <Text className="text-black bg-slate-50 w-fit rounded-xl text-xs font-medium p-2">
                  {lang === 'ar' ? product.branchNameAr : product.branchNameEn}

                </Text>
              </div>
              <div>
              <div className="flex flex-col items-end gap-1">
  <div className="w-20">
    <Progressbar
      className="w-full"
      value={calculatePercentage(product.currentStock, 50)}
      color={getProgressColor(calculatePercentage(product.currentStock, 50)) as any}
    />
  </div>
</div>
  <Text className="text-gray-500 text-center mt-1">
    {product.currentStock === 0 
      ? (lang === 'ar' ? 'إنتهى من المخزون' : 'Out of stock') 
      : `${product.currentStock} ${lang === 'ar' ? 'قطع' : 'Pieces'}`
    }
  </Text>

              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
