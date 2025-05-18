'use client'
import React, { useEffect, useRef, useState } from 'react';
import FrenchFriesIcon from '@components/icons/french-fries';
import LunchIcon from '@components/icons/lunch';
import cn from '@utils/class-names';
import { Button } from 'rizzui';
import { useFilterControls } from '@hooks/use-filter-control';
import { useElementRePosition } from '@hooks/use-element-reposition';

export type InitialStateType = {
  filter: string;
};

export const initialState: InitialStateType = {
  filter: '',
};

// ✅ Static Filter Options
// const filterOptions = [
//   { id: 1, name: 'Pizza', value: 'pizza', icon: () => <span>🍕</span> },
//   { id: 2, name: 'Cold Drink', value: 'cold-drink', icon: () => <span>🥤</span> },
//   { id: 3, name: 'Burger', value: 'burger', icon: () => <span>🍔</span> },
//   { id: 4, name: 'Coffee', value: 'coffee', icon: () => <span>☕</span> },
//   { id: 5, name: 'French Fry', value: 'french-fry', icon: () => <span>🍟</span> },
//   { id: 6, name: 'Lunch', value: 'lunch', icon: () => <span>🍱</span> },
//   { id: 7, name: 'Dinner', value: 'dinner', icon: () => <span>🍽️</span> },
//   { id: 8, name: 'Sweet', value: 'sweet', icon: () => <span>🍩</span> },
//   { id: 9, name: 'Pasta', value: 'pasta', icon: () => <span>🍝</span> },
//   { id: 10, name: 'Cookies', value: 'cookies', icon: () => <span>🍪</span> },
//   { id: 11, name: 'Chicken', value: 'chicken', icon: () => <span>🍗</span> },
//   { id: 12, name: 'Beef', value: 'beef', icon: () => <span>🥩</span> },
//   { id: 13, name: 'Fruits', value: 'fruits', icon: () => <span>🍍</span> },
//   { id: 14, name: 'Juice', value: 'juice', icon: () => <span>🧃</span> },
// ];
// const filterOptions = [
//   { id: 1, name: 'Pizza', value: 'pizza', icon: LunchIcon },
//   { id: 2, name: 'Cold Drink', value: 'cold-drink', icon: LunchIcon },
//   { id: 3, name: 'Burger', value: 'burger', icon: LunchIcon },
//   { id: 4, name: 'Coffee', value: 'coffee', icon: LunchIcon },
//   { id: 5, name: 'French Fry', value: 'french-fry', icon: LunchIcon },
//   { id: 6, name: 'Lunch', value: 'lunch', icon: LunchIcon },
//   { id: 7, name: 'Dinner', value: 'dinner', icon: LunchIcon },
//   { id: 8, name: 'Sweet', value: 'sweet', icon: LunchIcon },
//   { id: 9, name: 'Pasta', value: 'pasta', icon: LunchIcon },
//   { id: 10, name: 'Cookies', value: 'cookies', icon: LunchIcon },
//   { id: 11, name: 'Chicken', value: 'chicken', icon: LunchIcon },
//   { id: 12, name: 'Beef', value: 'beef', icon: LunchIcon },
//   { id: 13, name: 'Fruits', value: 'fruits', icon: LunchIcon },
//   { id: 14, name: 'Juice', value: 'juice', icon: LunchIcon },
// ];

function getIndexByValue(arr: any[], value: string) {
  return arr.findIndex((item) => item.value === value);
}

export default function POSSlider({lang, allItems, filterOptions}:{lang?:string; allItems:string; filterOptions:{ id: string; name: string; value: string; icon: any }[];}) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingFilter, setLoadingFilter] = useState<string | null>(null);
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

  useEffect(() => {
    if (!state) {
      setActiveIndex(0);
    } else {
      setActiveIndex(getIndexByValue(filterOptions, state['filter']) + 1);
    }
  }, [state]);
  
  return <>
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
          {allItems}
        </Button>
        {filterOptions.map((option, idx) => {
          // const Icon = option.icon;
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
}