'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPhone } from 'react-icons/fa';
import { Button } from 'rizzui';
import usrbig1 from '@public/assets/usrbig1.jpg';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axiosClient from '../context/api';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Star, Phone, Send, Calendar } from 'lucide-react';
import { 
  PiBicycle, 
  PiMotorcycle, 
  PiCar, 
  PiVan, 
  PiTruck, 
  PiJeep,
  PiArrowSquareOut
} from 'react-icons/pi';
import RoleExist from '../ui/roleExist/RoleExist';
import { RoleClientExist } from '../ui/roleClientExist/RoleClientExist';
import { GetCookiesClient } from '../ui/getCookiesClient/GetCookiesClient';

function formatDateDMYYYY(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const drivers = [
  {
    name: 'Pooja Patel',
    orders: 435,
    image: usrbig1,
    phone: '01222222222',
    address: 'A-103, Shyam Gokul Flats, Mahatma Road, Mumbai',
    rating: 2.5,
    status: 'online', 
  },
  {
    name: 'Smita Patil',
    orders: 876,
    image: usrbig1,
    phone: '01222222222',
    address: '45, Krishna Tower, Near Bus Stop, Satellite, Ahmedabad',
    rating: 3.5,
    status: 'delivering', 
  },
  {
    name: 'John Smith',
    orders: 234,
    image: usrbig1,
    phone: '01222222222',
    address: '456, Estern Avenue, Courtage Area, New York',
    rating: 5,
    status: 'offline', 
  },
  {
    name: 'Mohamed Ali',
    orders: 234,
    image: usrbig1,
    phone: '01227375904',
    address: '456, Estern Avenue, Courtage Area, New York',
    rating: 5,
    status: 'waiting', 
  },
  {
    name: 'Ali Abrahime',
    orders: 234,
    image: usrbig1,
    phone: '01224587787',
    address: '456, Estern Avenue, Courtage Area, New York',
    rating: 5,
    status: 'suspended', 
  },
];

// function getStatusColor(status: string) {
//   switch (status) {
//     case 'online':
//       return 'bg-green-500';
//     case 'delivering':
//       return 'bg-b-yellow';
//     case 'offline':
//       return 'bg-dark-bgcolor';
//     case 'suspended':
//       return 'bg-b-pink';
//     default:
//       return 'bg-b-purple';
//   }
// }

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500';
    case 'delivering': return 'bg-b-yellow';
    case 'offline': return 'bg-dark-bgcolor';
    case 'suspended': return 'bg-b-pink';
    default: return 'bg-b-purple';
  }
};

function Delivery({ lang='en', filterOptions }: { lang?: string; filterOptions: { id: string; name: string; value: string; icon: any }[];}) {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const selectedCategory = filterOptions.find((cat) => cat.value === filter);
  // console.log("filter: ",filter);
  console.log("selectedCategory: ",selectedCategory);

  const text = {
    title: lang === 'ar' ? 'سائقو التوصيل' : 'Delivery Drivers',
    details: lang === 'ar' ? 'تفاصيل' : 'Details',
    hiring: lang === 'ar' ? 'تعيين' : 'Hiring',
    orders: lang === 'ar' ? 'طلب' : 'order',
  };

  const fetchDrivers = async (pageNumber = 1) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const shopId = GetCookiesClient('shopId');
      const branchId = selectedCategory?.id;
      const response = await axiosClient.get(`/api/Delivery/GetAll/${shopId}`, {
        params: {
          branchId,
          PageNumber: pageNumber,
          PageSize: 40
        }
      });

      const deliveries = response.data.deliveries ?? [];
      console.log("deliveries: ",deliveries);
      
      const allEntities = deliveries.flatMap((delivery: any) => delivery.entities ?? []);

      const maxNextPage = Math.max(...deliveries.map((d: any) => d.nextPage ?? 0));
      const maxTotalPages = Math.max(...deliveries.map((d: any) => d.totalPages ?? 0));
      
      console.log('Loaded page:', pageNumber);
      console.log('Max nextPage:', maxNextPage);
      console.log('Max totalPages:', maxTotalPages);

      // setDrivers(allEntities);
      // Append or replace
      setDrivers(prev => pageNumber === 1 ? allEntities : [...prev, ...allEntities]);
      setMaxPage(maxNextPage);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setPage(1);
    fetchDrivers(1);
  }, [lang, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  
      if (bottomReached && page <= maxPage && !isLoading) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchDrivers(nextPage);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, maxPage, isLoading]);
  
  function DriverProfileCard({ driver, lang = 'en' }: { driver: any; lang: string }) {
    const isRTL = lang === 'ar';
    const [orderStats, setOrderStats] = useState<{ deliveredOrders: number; deliveringOrders: number; canceledOrders: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Fetch order statistics when component mounts
    useEffect(() => {
      const fetchOrderStats = async () => {
        if (!driver.id) return;
        
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://testapi.ordrat.com/api/Delivery/GetNumbersOfOrdersByDeliveryId/${driver.id}`
          );
          
          setOrderStats(response.data);
        } catch (error) {
          console.error('Error fetching order stats:', error);
          // Set default values if API fails
          setOrderStats({ deliveredOrders: 0, deliveringOrders: 0, canceledOrders: 0 });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrderStats();
    }, [driver.id]);
    
    // Get vehicle type text
    const vehicleTypes: Record<number, { en: string; ar: string }> = {
      0: { en: 'Bicycle', ar: 'دراجة هوائية' },
      1: { en: 'Motorcycle', ar: 'دراجة نارية' },
      2: { en: 'Car', ar: 'سيارة' },
      3: { en: 'Van', ar: 'شاحنة صغيرة' },
      4: { en: 'Truck', ar: 'شاحنة' },
    };
    
    // Type-safe way to get vehicle type
    const vehicleTypeIndex = typeof driver.vehicleType === 'number' && driver.vehicleType >= 0 && driver.vehicleType <= 4 
      ? driver.vehicleType 
      : 1;
    
    const vehicleType = vehicleTypes[vehicleTypeIndex][lang as 'en' | 'ar'];
    
    // Get status color and text
    const getStatusInfo = () => {
      const status =
        driver.deliveryStatus === 1 ? 'online' :
        driver.deliveryStatus === 2 ? 'suspended' :
        driver.deliveryStatus === 3 ? 'delivering' :
        'offline';
      
      const statusConfig: Record<string, { color: string; bgColor: string; text: { en: string; ar: string } }> = {
        online: { 
          color: 'bg-green-500', 
          bgColor: 'bg-green-50',
          text: { en: 'Available', ar: 'متاح' }
        },
        suspended: { 
          color: 'bg-rose-500', 
          bgColor: 'bg-rose-50',
          text: { en: 'Suspended', ar: 'معلق' }
        },
        delivering: { 
          color: 'bg-amber-500', 
          bgColor: 'bg-amber-50',
          text: { en: 'On Delivery', ar: 'جاري التوصيل' }
        },
        offline: { 
          color: 'bg-gray-500', 
          bgColor: 'bg-gray-50',
          text: { en: 'Offline', ar: 'غير متصل' }
        }
      };
      
      return {
        status,
        color: statusConfig[status]?.color || 'bg-blue-500',
        bgColor: statusConfig[status]?.bgColor || 'bg-blue-50',
        text: statusConfig[status]?.text[lang as 'en' | 'ar'] || status
      };
    };
    
    // Get vehicle icon
    const getVehicleIcon = () => {
      const iconColors: Record<number, string> = {
        0: 'text-blue-500',
        1: 'text-red-500',
        2: 'text-green-500',
        3: 'text-purple-500',
        4: 'text-indigo-500'
      };
      
      const color = iconColors[vehicleTypeIndex] || 'text-gray-500';
      const iconSize = 16;
      
      switch(vehicleTypeIndex) {
        case 0: // Bicycle
          return <PiBicycle className={`${color}`} size={iconSize} />;
        case 1: // Motorcycle
          return <PiMotorcycle className={`${color}`} size={iconSize} />;
        case 2: // Car
          return <PiCar className={`${color}`} size={iconSize} />;
        case 3: // Van
          return <PiVan className={`${color}`} size={iconSize} />;
        case 4: // Truck
          return <PiTruck className={`${color}`} size={iconSize} />;
        default:
          return <PiJeep className={`${color}`} size={iconSize} />;
      }
    };
    
    // Text based on language
    const text = {
      details: isRTL ? 'التفاصيل' : 'Details',
      message: isRTL ? 'رسالة' : 'Message',
      phone: isRTL ? 'الهاتف' : 'Phone',
      joined: isRTL ? 'تاريخ الانضمام' : 'Joined',
      orders: isRTL ? 'الطلبات' : 'Orders',
      delivered: isRTL ? 'تم التوصيل' : 'Delivered',
      canceled: isRTL ? 'تم الإلغاء' : 'Canceled',
    };
    
    // Star rating
    const renderStars = (rating = 4.8) => {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating - fullStars >= 0.5;
      
      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${
                i < fullStars 
                  ? "text-yellow-400 fill-yellow-400" 
                  : i === fullStars && hasHalfStar
                    ? "text-yellow-400" 
                    : "text-gray-200"
              } ${isRTL && i === fullStars && hasHalfStar ? 'transform scale-x-[-1]' : ''}`}
            />
          ))}
          <span className="ms-1 text-sm font-medium text-gray-700">{rating}</span>
        </div>
      );
    };
    
    // Generate driver ID
    const driverId = driver.id ? driver.id.substring(0, 6).toUpperCase() : '';
    
    // Calculate total orders
    const totalOrders = orderStats ? orderStats.deliveredOrders + orderStats.canceledOrders : 0;
    
    // Status info
    const statusInfo = getStatusInfo();
    
    const detailsButton = RoleClientExist([
      'GetDeliverById',
    ]);
    const chatButton = RoleClientExist([
      'delivery-chat',
    ]);
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Header with status */}
        <div className={`${statusInfo.bgColor} px-5 py-3 flex justify-between items-center border-b border-gray-100`}>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} animate-pulse`}></div>
            <span className="text-sm font-medium text-gray-700">{statusInfo.text}</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">ID: {driverId}</div>
        </div>
        
        {/* Main Content */}
        <div className="p-5">
          {/* Profile section */}
          <div className="flex items-center mb-4">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img 
                  src={driver.personalPhotoUrl} 
                  alt={`${driver.firstName} ${driver.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white p-1 shadow-sm flex items-center justify-center`}>
                {getVehicleIcon()}
              </div>
            </div>
            
            {/* Name and info */}
            <div className="ms-4 flex-1">
              <h3 className="font-semibold text-gray-900 mb-0.5 line-clamp-1">{`${driver.firstName} ${driver.lastName}`}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <span>{vehicleType}</span>
              </div>
              {renderStars(4.8)}
            </div>
          </div>
          
          {/* Order stats section */}
          <div className="mb-4 bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">{text.orders}</h4>
              <div className="text-lg font-semibold text-gray-900">
                {isLoading ? (
                  <div className="w-8 h-5 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  totalOrders
                )}
              </div>
            </div>
            
            {/* Order details */}
            {orderStats && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 me-2"></div>
                  <span className="text-gray-600">{text.delivered}:</span>
                  <span className="ms-auto font-medium">{orderStats.deliveredOrders}</span>
                </div>
                <div className="flex items-center bg-white p-2 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-amber-500 me-2"></div>
                  <span className="text-gray-600">{text.canceled}:</span>
                  <span className="ms-auto font-medium">{orderStats.canceledOrders}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Contact info */}
          <div className="mb-4">
            <div className="flex items-center py-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center me-3">
                <Phone size={14} className="text-blue-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-500 mb-0.5">{text.phone}</p>
                <p className="text-sm font-medium text-gray-800 truncate">{driver.phoneNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center py-2">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center me-3">
                <Calendar size={14} className="text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">{text.joined}</p>
                <p className="text-sm font-medium text-gray-800">{formatDateDMYYYY(driver.createdAt)}</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          {(detailsButton || chatButton) && (
            <div className="flex gap-2">
              <RoleExist PageRoles={['GetDeliverById']}>
                <Link 
                  href={`/${lang}/delivery/details/${driver.id}`}
                  className="flex-1 border border-transparent dark:backdrop-blur bg-primary hover:bg-primary-dark dark:hover:bg-primary/90 focus-visible:ring-muted text-primary-foreground rounded-xl py-2.5 flex items-center justify-center gap-1.5 transition-colors text-sm font-medium"
                >
                  {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg> */}
                  <PiArrowSquareOut size={16} />
                  <span>{text.details}</span>
                </Link>
              </RoleExist>
              <RoleExist PageRoles={['delivery-chat']}>
                <a
                  href={`https://wa.me/${driver.phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${detailsButton ? 'w-12' : 'w-full'} h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors`}
                >
                  <Send size={18} className="text-gray-500" />
                </a>
              </RoleExist>
            </div>
          )}
        </div>
      </div>
    );
  }  

  return (
    <div className="container mx-auto py-6 pt-5">
      {/* <h2 className="text-2xl font-bold text-center mb-6">{text.title}</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 gap-6">
        {drivers.map((driver, index) => {
          const status =
            driver.deliveryStatus === 1 ? 'online' :
            driver.deliveryStatus === 2 ? 'suspended' :
            driver.deliveryStatus === 3 ? 'delivering' :
            'offline';
          console.log("driver: ",driver);
          
          return (
          <div key={index} className='driver'>
            <DriverProfileCard driver={driver} lang={lang} />
          </div>
        )})}
      </div>
    </div>
  );
}

export default Delivery;