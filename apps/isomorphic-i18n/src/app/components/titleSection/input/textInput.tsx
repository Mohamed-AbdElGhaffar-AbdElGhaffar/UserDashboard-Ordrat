'use client'
import { useContext, useEffect, useState } from 'react';
import { QrStyleContext } from '../../contsxt1';
import { Input } from 'rizzui';
import { getShop } from '@/app/lib/api/shop';
import { ShopInfo } from '@/types';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';

const TextInput = ({lang}:{lang:string}) => {
  const { state, dispatch } = useContext(QrStyleContext);
  const [debouncedValue, setDebouncedValue] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
      const { couponData, setCouponData, shop, setShop } = useUserContext();
    const shopId = GetCookiesClient('shopId');
    useEffect(() => {
      if (shop?.subdomainName && !isInitialized) {
        setDebouncedValue(shop.subdomainName);
        setIsInitialized(true);
      }
    }, [shop?.subdomainName, isInitialized]);
    
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (debouncedValue === '') {
        dispatch({ type: 'SET_QR_VALUE', payload: { value: "" } });
        return;
      }
      dispatch({ type: 'SET_QR_VALUE', payload: { value: debouncedValue } });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [debouncedValue, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
  };
   useEffect(() => {
        const fetchData = async () => {
            try {
                const data: ShopInfo | null = await getShop({ lang,shopId:shopId as any });
                if (data) {
                    setShop(data)

                    console.log('SHOP loaded:', data);
                } else {
                    console.error('No data returned from API');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [lang]);
  return (
    <div className={'mt-5'}>
     <Input
  label={lang==='ar'?' اللينك':'Link'}
  placeholder={lang==='ar'?' اللينك':' Link'}
  onChange={handleChange}
  disabled
  // defaultValue={debouncedValue === "I'm EMPTY" ? '' : shop}
  value={debouncedValue}

  type="text"
/>


      <p className={'mt-3 text-sm text-light'}>{lang==='ar'?'سيتم إنشاء رمز الاستجابة السريعة الخاص بك تلقائيًا.' :'Your QR code will be generated automatically'}</p>
    </div>
  );
};

export default TextInput;
