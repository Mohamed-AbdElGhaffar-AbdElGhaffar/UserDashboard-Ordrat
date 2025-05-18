'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Empty, SearchNotFoundIcon, Button, Loader } from 'rizzui';
import { posFilterValue } from '@/app/shared/point-of-sale/pos-search';
import { useAtomValue } from 'jotai';
import { posData } from '@/data/pos-data';
import hasSearchedParams from '@utils/has-searched-params';
import shuffle from 'lodash/shuffle';
import { useSearchParams } from 'next/navigation';
import axiosClient from '@/app/components/context/api';
import ProductClassicCard from './product-classic-card';
import { t } from 'i18next';
import { useTranslation } from '@/app/i18n/client';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';

const shopId = GetCookiesClient('shopId');

const PER_PAGE = 12;

export type PosProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  quantity: number;
  size: number;
  discount?: number;
};

export default function POSProductsFeed({ lang = 'en', filterOptions, currencyAbbreviation }:{ lang: string; filterOptions: { id: string; name: string; value: string; icon: any }[]; currencyAbbreviation: string;}) {
  const { t, i18n } = useTranslation(lang!, "home");
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchText = useAtomValue(posFilterValue);
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  // console.log("filter: ",filter);
  
  async function fetchProducts(page: number, reset = false) {
    setLoading(true);
    try {
      let response;

      if (searchText.length > 0) {
        response = await axiosClient.get(`/api/Products/SearchByName/${shopId}`, {
          params: { SearchParamter: searchText, PageNumber: page, PageSize: PER_PAGE },
          headers: { 'Accept-Language': lang },
        });
      } else if (filter) {
        const selectedCategory = filterOptions.find((cat) => cat.value === filter);
        if (selectedCategory) {
          response = await axiosClient.get(`/api/Products/GetByCategoryId/${shopId}/${selectedCategory.id}`, {
            params: { PageNumber: page, PageSize: PER_PAGE },
            headers: { 'Accept-Language': lang },
          });
        }
      } else {
        response = await axiosClient.get(`/api/Products/GetAll/${shopId}`, {
          params: { PageNumber: page, PageSize: PER_PAGE },
          headers: { 'Accept-Language': lang },
        });
      }

      if (response?.data?.entities) {
        console.log("response.data.entities: ",response.data.entities);
        
        const formattedProducts: PosProduct[] = response.data.entities.map((item: any) => {
          const discount = item.discount ?? 0;
          const discountType = item.discountType ?? 0; // 0 = %, 1 = real amount
          const finalPrice = item.finalPrice ?? 0;
          const isDiscountActive = item.isDiscountActive ?? false;

          let price = finalPrice;
          let discountValue = 0;

          if (isDiscountActive) {
            if (discountType === 0) {
              price = finalPrice / (1 - discount / 100);
            } else if (discountType === 1) {
              price = finalPrice + discount;
            }

            price = Math.round(price * 100) / 100;

            discountValue = discountType === 0
              ? discount
              : Math.round((discount / price) * 100);
          } else {
            price = 0;
            discountValue = 0;
          }
                
          return {
            id: item.id,
            name: item.name,
            description: item.description || '',
            image: item.images?.length > 0 ? item.images[0].imageUrl : 'https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/public/food/1.webp',
            price: price,
            salePrice: finalPrice,
            quantity: 1,
            size: 0,
            discount: discountValue,
          }
        });

        if (reset) {
          setProducts(response.data.entities); // ✅ Reset & load new data
        } else {
          setProducts((prev) => [...prev, ...response.data.entities]); // ✅ Append new data
        }

        setTotalPages(response?.data?.totalPages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    setProducts([]);
    setNextPage(1);
    fetchProducts(1, true);
  }, [lang, filter, searchText]);

  useEffect(() => {
    if (nextPage > 1) {
      fetchProducts(nextPage);
    }
  }, [nextPage]);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && nextPage < totalPages) {
        setNextPage((prev) => prev + 1);
      }
    },
    [isLoading, nextPage, totalPages]
  );

  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  let productItemsFiltered = [...posData].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  if (searchText.length > 0) {
    productItemsFiltered = posData.filter((item: any) => {
      const label = item.name;
      return (
        label.match(searchText.toLowerCase()) ||
        (label.toLowerCase().match(searchText.toLowerCase()) && label)
      );
    });
  }

  productItemsFiltered = hasSearchedParams()
    ? shuffle(productItemsFiltered)
    : productItemsFiltered;

  function handleLoadMore() {
    setLoading(true);
    setTimeout(() => {
      // setLoading(false);
      setNextPage(nextPage + 1);
    }, 600);
  }
  // function handleLoadMore() {
  //   setNextPage(nextPage + 1);
  // }

  if (isLoading == true && products.length == 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-[#e11d48]" width={40} height={40} />
      </div>
    );
  }

  return (
    <>
      {products.length > 0 ? (
        <div className="grid  grid-cols-2 gap-x-4 gap-y-6 @md:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] @xl:gap-x-6 @xl:gap-y-12 @4xl:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] ">
          {products.map((product) => (
            <ProductClassicCard key={product.id} product={product} lang={lang} currencyAbbreviation={currencyAbbreviation}/>
          ))}
        </div>
      ) : (
        <Empty
          image={<SearchNotFoundIcon />}
          text={t('no-result-found')}
          className="h-full justify-center"
        />
      )}

      {totalPages !== nextPage && <div ref={loaderRef} className="h-1 w-full" />}
    </>
  );
}
