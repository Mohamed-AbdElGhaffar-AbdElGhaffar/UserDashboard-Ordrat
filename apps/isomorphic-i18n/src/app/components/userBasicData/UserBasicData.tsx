'use client'
import { useTranslation } from '@/app/i18n/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Input } from 'rizzui';
import photo from '@public/assets/blogcard1.png'
import { ChromePicker } from 'react-color';
import { ShopInfo } from '@/types';
import { getShop } from '@/app/lib/api/shop';
import { useUserContext } from '../context/UserContext';
import { GetCookiesClient } from '../ui/getCookiesClient/GetCookiesClient';

function UserBasicData({lang}:{lang?:string}) {
    const[title,setTitle]=useState('')
    const [colorOne, setColorOne] = useState("#E84654");
    const [colorTwo, setColorTwo] = useState("#325092");
    const [loading, setLoading] = useState(false);
    const[sabdomin,setSabdomin]=useState('')
    const shopId = GetCookiesClient('shopId');

    const {shop ,setShop} = useUserContext();
    const { t,i18n } = useTranslation(lang!,"basicData");
    useEffect(() => {
      i18n.changeLanguage(lang);
    }, [lang, i18n]); 
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
          try {
            const data: ShopInfo | null = await getShop({ lang,shopId:shopId as string });
            if (data) {
                setShop(data)
             console.log('SHOP loaded:', data);
            } else {
              console.error('No data returned from API');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
    }, [lang]);
    
  return <>
  <div className="w-full space-y-32">
    <div className="flex justify-between gap-10">
        <div className="w-2/6 space-y-2">
            <h2 className='font-bold text-lg'>{t('basic-Title1')}</h2>
            <h3 className='text-base font-normal'>{t('basic-Desc1')}</h3>
        </div>
        <div className="w-4/6 space-y-8">
            <div className=" flex justify-between mb-3 gap-16">
                <Input 
                    label={t('shop-name')}
                    placeholder={t('shop-name')}
                    value={shop?.name}
                    className='w-1/2 [&>label>span]:font-medium [&>label>span]:text-lg'
                />
                <Input 
                    label={t('shop-subdomainName')}
                    placeholder={t('shop-subdomainName')}
                    value={shop?.subdomainName}
                    className='w-1/2 [&>label>span]:font-medium [&>label>span]:text-lg'
                />
            </div>
            <div className="w-1/2">
                <p className='text-lg font-medium'>اللوجو</p>
                <Image src={shop?.logoUrl}  width={100} height={100} alt='' className='mt-2 w-40' />
            </div>
        </div>
    </div>
    <div className="flex justify-between gap-10">
        <div className="w-2/6 space-y-2">
            <h2 className='font-bold text-lg'>{t('color-title')}</h2>
            <h3 className='text-base font-normal'>{t('color-desc')}</h3>
        </div>
        <div className="w-4/6 space-y-8">
            <div className=" flex justify-between mb-3 gap-16">
                <div className="w-1/2">
                    <p>{t('selectColor-one')}</p>
                    <div
                        className="my-div mt-5"
                        style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: shop?.mainColor,
                        }}
                    ></div>      
                </div>
                <div className="w-1/2">
                    <p>{t('selectColor-two')}</p>
                    <div
                        className="my-div mt-5"
                        style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: shop?.secondaryColor,
                        }}
                    ></div>  
                </div>
            </div>
        </div>
    </div>
    <div className="flex justify-between gap-16">
       
        <div className="w-1/2">
            <p>اللوجو</p>
            <Image src={photo} alt='' className='mt-2 w-40' />
        </div>
    </div>
   
  </div>
  </>
}

export default UserBasicData
