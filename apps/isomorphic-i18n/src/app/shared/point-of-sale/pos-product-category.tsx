import { useEffect, useRef, useState } from 'react';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { useFilterControls } from '@hooks/use-filter-control';
import {
  // filterOptions,
  initialState,
} from '@/app/shared/point-of-sale/pos-category-utils';
import { useElementRePosition } from '@hooks/use-element-reposition';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

function getIndexByValue(arr: any[], value: string) {
  return arr.findIndex((item) => item.value === value);
}

import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';

const shopId = GetCookiesClient('shopId');
const API_URL = `/api/Category/GetAll/${shopId}`;


export default function POSProductCategory({ lang = 'en', filterOptions }:{ lang: string; filterOptions: { id: string; name: string; value: string; icon: any }[];}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loadingFilter, setLoadingFilter] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { state, applyFilter, reset } = useFilterControls<
    typeof initialState,
    any
  >(initialState);
  const { isScrollableToLeft, isScrollableToRight } = useElementRePosition({
    ref,
    activeTab: activeIndex,
  });

  function handleReset(i: number) {
    if (state['filter']) {
      setLoadingFilter('');
    }
    reset();
    setActiveIndex(i);
  }

  function handleFilter(value: string, i: number) {
    if (state['filter'] !== value) {
      setLoadingFilter(value);
    }
    applyFilter('filter', value);
    setActiveIndex(i);
  }
  // console.log("state: ",state);
  
  useEffect(() => {
    if (!state) {
      setActiveIndex(0);
    } else {
      setActiveIndex(getIndexByValue(filterOptions, state['filter']) + 1);
    }
  }, [state]);

  return (
    <>
      <div
        ref={ref}
        className="flex w-full items-center gap-2.5 overflow-x-auto pb-[2px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Button
          onClick={() => handleReset(0)}
          isLoading={loadingFilter === '' && state['filter'] !== ''}
          variant={state['filter'] ? 'outline' : 'solid'}
          className={cn('z-1 relative flex shrink-0 gap-1.5')}
        >
          {lang=='ar'?'كل المنتجات':'All Items'}
        </Button>
        {filterOptions.map((option, idx) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.id + option.value}
              isLoading={loadingFilter === option.value && state['filter'] !== option.value}
              variant={state['filter'] === option.value ? 'solid' : 'outline'}
              className={cn(
                'inline-flex shrink-0 gap-1.5 scroll-smooth focus-visible:border-0 focus-visible:ring-0 active:ring-0 focus-visible:enabled:border-0',
                state['filter'] === option.value && 'relative z-10'
              )}
              onClick={() => handleFilter(option.value, idx + 1)}
            >
              <span>
                {/* <Icon className="h-5 w-5" /> */}
                {option.icon && (
                  <img
                    src={option.icon}
                    alt={option.name}
                    className="h-8 w-8 rounded-full border border-gray-300"
                  />
                )}
              </span>
              {option.name}
            </Button>
          );
        })}
      </div>

      <span
        className={cn(
          'invisible absolute start-0 top-0 z-[2] h-full w-10 bg-gradient-to-r from-gray-0 via-gray-0/70 to-transparent opacity-0 duration-200 rtl:bg-gradient-to-l dark:from-gray-50 dark:via-gray-50/70',
          isScrollableToLeft && 'visible opacity-100'
        )}
      />
      <span
        className={cn(
          'invisible absolute end-0 top-0 z-[2] h-full w-10 bg-gradient-to-l from-gray-0 via-gray-0/70 to-transparent opacity-0 duration-200 rtl:bg-gradient-to-r dark:from-gray-50 dark:via-gray-50/70',
          isScrollableToRight && 'visible opacity-100'
        )}
      />
    </>
  );
}
