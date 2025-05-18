'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_BASE_URL } from '@/config/base-url';
import { useUserContext } from '../../context/UserContext';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import { Empty, Text } from 'rizzui';
type images={
    img:any
}
type Banner = {
    id?: string;
    bannerUrl: string;
    actionType?: number;
    actionString?: string;
  };
function MainSlider({lang, data}:{lang?:string; data:any;}) {
  const shopId = GetCookiesClient('shopId') as string;
  const text = {
    title: lang === 'ar' ? 'شكل البانر' : 'Banner Design',
  };
  const [banner, setbanner] = useState<Banner[]>(data);
  const { bannersData, setBannersData } = useUserContext();

  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Banner/GetAll/${shopId}`,
        {
          method: 'GET',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data:Banner[] = await response.json();

      setbanner(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchOrder();
  // }, []);
  useEffect(() => {
    if (bannersData == true) {
      fetchOrder();
      setBannersData(false);
    }
  }, [bannersData]); 
  
  const settings = {
    className: "",
    dots: true,
    arrows:false,
    speed: 500,
    autoplay: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return <>
    <div className='w-full lg:w-6/12 h-full lg:bg-white lg:border lg:border-gray-200 lg:rounded-xl flex flex-col items-center'>
      <div className="w-full p-5 hidden lg:flex justify-between items-center">
        <h2 className='mb-3'>{text.title}</h2>
      </div>
      {banner.length == 0?
        <div className="py-5 text-center lg:py-8">
            <Empty /> <Text className="mt-3">{lang === 'ar' ? 'لا توجد بانرات' : 'No Banners'}</Text>
        </div>
        :
        <div className="slider-container w-[300px] xs:w-[400px] sm:w-[620px] md:w-[750px] lg:w-[450px] 3xl:w-[750px] cursor-grab border-none mt-10 mx-auto relative">
            <Slider {...settings}>
                {banner.map((photo, index) => (
                    <div key={index}>
                      <img
                        width="800"
                        height="500"
                        src={photo.bannerUrl}
                        alt="slider"
                        className="h-[150px] w-full sm:h-[300px] overflow-hidden image rounded-xl px-1 pointer-events-none"
                      />
                    </div>
                ))}
            </Slider>
        </div>
      }
    </div>
  </>
}

export default MainSlider