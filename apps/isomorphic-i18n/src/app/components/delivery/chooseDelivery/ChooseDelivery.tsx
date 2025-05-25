'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axiosClient from '../../context/api';
import deliveryMotorcycle from '@public/assets/modals/delivery-motorcycle.svg';
import delivery from '@public/assets/sec6.png';
import logo from '@public/smallLogo.png';
import DeliverySlider from '../deliverySlider/DeliverySlider';
import ActionButton from '../../ui/buttons/ActionButton';
import RoleExist from '../../ui/roleExist/RoleExist';
import { useUserContext } from '../../context/UserContext';
import styles from './ChooseDelivery.module.css';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL, Image_BASE_URL } from '@/config/base-url';
import { useNegotiator } from '../../context/useNegotiator';
import { Button, Empty, SearchNotFoundIcon, Text } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

interface DeliveryOption {
  id: string;
  name: string;
  value: string;
  icon?: any;
}
interface DriverType {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleType: number;
  deliveryStatus: number;
  personalPhotoUrl: string;
  isAvailable: boolean;
  tripCount: number;
  distance: string;
}
interface PageHeaderType {
  title: string;
  breadcrumb: {href?: string; name: string;}[];
}

type ChooseDeliveryFormProps = {
  lang: string;
  branches: DeliveryOption[];
  orderId: string;
  currencyAbbreviation: string;
  pageHeader: PageHeaderType;
};

export default function ChooseDelivery({ lang = 'en', currencyAbbreviation,branches, orderId, pageHeader }: ChooseDeliveryFormProps) {
  const { closeModal } = useModal();
  const accessToken = GetCookiesClient('accessToken');
  // const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const {
    offers,
    broadcastStatus,
    deliveryUnresponsive,
    isOrderBroadcasted,
    isCheckingBroadcast,
    broadcastOrder,
    checkIfBroadcasted,
    cancelBroadcastOrder,
    acceptDeliveryOffer,
    rejectDeliveryOffer,
  } = useNegotiator(orderId);
  console.log("broadcastStatus: ",broadcastStatus);
  console.log("isOrderBroadcasted: ",isOrderBroadcasted);
  console.log("offers: ",offers);
  
  const text = {
    hiring: lang === 'ar' ? 'تعيين' : 'Hiring',
    details: lang === 'ar' ? 'تفاصيل' : 'Details',
    title: lang === 'ar' ? 'اختيار سائق توصيل' : 'Choose Delivery Driver',
    trip: lang === 'ar' ? 'رحلة' : 'Trip',
    away: lang === 'ar' ? 'علي بعد' : 'Away',
    proposedPrice: lang === 'ar' ? 'السعر المقترح' : 'Proposed Price',
  };

  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || '');
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submittingDriverId, setSubmittingDriverId] = useState<string | null>(null);
  const { setOrderDetailsStatus, setOrderDetailsTable } = useUserContext();  

  const fetchDrivers = async (branchId: string, pageNumber = 1) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const shopId = document.cookie.split('; ').find(row => row.startsWith('shopId='))?.split('=')[1];
      const response = await axiosClient.get(`/api/Delivery/GetAll/${shopId}`, {
        params: { branchId, PageNumber: pageNumber, PageSize: 10 },
      });
      
      const deliveries = response.data.deliveries ?? [];
      const allEntities = deliveries.flatMap((d: any) => d.entities ?? []);
      const next = Math.max(...deliveries.map((d: any) => d.nextPage ?? 0));
      console.log("allEntities: ",allEntities);
      
      setDrivers(prev => pageNumber === 1 ? allEntities : [...prev, ...allEntities]);
      setMaxPage(next);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
    } finally {
      setIsLoading(false);
    }
  };

  const assignDriver = async (deliveryId: string) => {
    try {
      setSubmittingDriverId(deliveryId);
      await axiosClient.put(`/api/Order/AssignOrderToDelivery/${orderId}/${deliveryId}`, null, {
        headers: { Accept: '*/*' },
      });
      console.log('Driver assigned successfully');
      setOrderDetailsStatus(true);
      setOrderDetailsTable(true);
      toast.success(lang === 'ar' ? 'تم تعيين سائق بنجاح' : 'Driver has been assigned successfully');
      closeModal();
    } catch (error) {
      console.error('Failed to assign driver:', error);
    } finally {
      setSubmittingDriverId(null);
    }
  };
  
  // useEffect(() => {
  //   const newConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(`${API_BASE_URL}/negotiationHub`, {
  //       accessTokenFactory: () => accessToken || '',
  //     })
  //     .withAutomaticReconnect()
  //     .build();
  
  //   setConnection(newConnection);
  
  //   newConnection
  //     .start()
  //     .then(async () => {
  //       console.log('SignalR connected');
  
  //       try {
  //         await newConnection.invoke("BroadcastOrder", orderId, 0);
  //         console.log("BroadcastOrder invoked with orderId:", orderId);
  //       } catch (err) {
  //         console.error("BroadcastOrder invocation failed:", err);
  //       }
  //     })
  //     .catch((err) => console.error('SignalR connection error:', err));
  // }, [orderId]);
  
  useEffect(() => {
    fetchDrivers(selectedBranch, 1);
    setPage(1);
  }, [selectedBranch]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight;
      if (bottom && page < maxPage) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchDrivers(selectedBranch, nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, maxPage, selectedBranch]);

  return (
    <>
      <PageHeader className='py-2' title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} >
        {!isOrderBroadcasted && (
          <Button as="span" onClick={broadcastOrder} isLoading={isCheckingBroadcast} className="cursor-pointer mt-4 w-full @lg:mt-0 @lg:w-auto">
            {/* <PiPlusBold className="me-1.5 h-[17px] w-[17px]" /> */}
            {lang === 'ar' ? 'إرسال الطلب' : 'Send Broadcast'}
          </Button>
        )}
        {isOrderBroadcasted && (
          <Button as="span" onClick={cancelBroadcastOrder} isLoading={isCheckingBroadcast} className="cursor-pointer mt-4 w-full @lg:mt-0 @lg:w-auto">
            {/* <PiPlusBold className="me-1.5 h-[17px] w-[17px]" /> */}
            {lang === 'ar' ? 'إلغاء الطلب' : 'Cancel Broadcast'}
          </Button>
        )}
      </PageHeader>
      <div className="flex flex-col gap-6 mx-auto w-full sm:min-w-[300px]">
        {/* <Button onClick={broadcastOrder}>Send Broadcast</Button> */}
        <div className='comment-on-this-min-h-[250px] h-auto flex flex-col gap-3'>
          {/* <p className="text-lg mb-2 font-bold">{text.title}</p> */}
          {/* <DeliverySlider
            lang={lang}
            options={branches}
            defaultValue={branches[0]?.id}
            onChange={(val) => setSelectedBranch(val)}
          /> */}
          {offers.length == 0?
            (
              <Empty
                image={<SearchNotFoundIcon />}
                text={lang === 'ar' ? 'جاري البحث عن سائقين' : 'Looking for drivers'}
                className="h-full justify-center"
              />
            )
            :
            // <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 ps-0 pe-1.5 me-1.5 ${styles.customScroll}`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 p-0`}>
              {offers.map(offer => (
                <div key={offer.deliveryId} className='w-full bg-white rounded-[5px] p-2 flex flex-col justify-between gap-4'>
                  <div className='w-full flex justify-between items-center gap-2'>
                    <div className='w-[calc(100%-48px)] flex gap-2'>
                      <Image
                        src={`${Image_BASE_URL}${offer.photoUrl}` || delivery.src}
                        alt={`${offer.name}`}
                        className="w-[40px] h-[40px] object-contain rounded-full"
                        width={600}
                        height={360}
                      />
                      <div className='w-[calc(100%-38px)]'>
                        <div className='w-full flex gap-1'>
                          <p className="font-bold text-[14px] capitalize text-[#E92E3E] truncate overflow-hidden whitespace-nowrap max-w-[calc(100%-84px)]">
                            {offer.name}
                          </p>
                          <p className="font-semibold text-[14px] text-[#AEAEAE] truncate overflow-hidden whitespace-nowrap max-w-[80px]">
                            ({offer.numberOfOrders} {text.trip})
                          </p>
                        </div>
                        <p className="font-semibold text-[14px] capitalize text-[#979797]">
                          {text.away} : <span>{offer.RouteDistanceToBranch || 50} KM</span>
                        </p>
                      </div>
                    </div>
                    <Image
                      src={deliveryMotorcycle}
                      alt="Delivery Motorcycle"
                      className="w-[30px] h-[30px]"
                      width={600}
                      height={360}
                    />
                  </div>
                  <div className='w-full mt-3'>
                    {offer.proposedPrice && (
                      <div className="w-full bg-gray-50 rounded-lg p-3 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium text-gray-700">{text.proposedPrice}:</span>
                          </div>
                          <span className="font-bold text-green-600 text-md">
                            {offer.proposedPrice || 0} {currencyAbbreviation === "ر.س" ? (<Image src={sarIcon} alt="SAR" width={16} height={16} />) : (<span>{currencyAbbreviation}</span>)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="w-full flex flex-row gap-4 mt-3">
                      <ActionButton
                        text={text.hiring}
                        type="submit"
                        disabled={submittingDriverId === offer.deliveryId}
                        buttonClassName={`p-1 w-full ${submittingDriverId === offer.deliveryId ? 'bg-[#cacaca] cursor-default' : 'bg-green hover:bg-green-dark'}`}
                        textClassName="text-white"
                        // onClick={()=>assignDriver(driver.deliveryId)}
                        onClick={() => acceptDeliveryOffer(offer.deliveryId)}
                      />
                      <RoleExist PageRoles={['GetDeliverById']}>
                        <Link
                          href={`/${lang}/delivery/details/${offer.deliveryId}`}
                          className="p-1 w-full border border-transparent dark:backdrop-blur bg-primary hover:bg-primary-dark dark:hover:bg-primary/90 focus-visible:ring-muted text-primary-foreground rounded-md flex items-center justify-center transition-colors text-sm font-medium"
                        >
                          <span>{text.details}</span>
                        </Link>
                      </RoleExist>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </>
  );
}
