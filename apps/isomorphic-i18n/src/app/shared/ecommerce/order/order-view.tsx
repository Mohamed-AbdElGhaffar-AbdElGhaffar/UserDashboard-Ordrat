'use client';

import Image from 'next/image';
import { useAtomValue } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import { PiArrowsClockwiseBold, PiCheckBold, PiPlusBold, PiPrinterBold } from 'react-icons/pi';
import { FaTimes } from 'react-icons/fa';
import { useParams } from 'next/navigation'; 
import { BriefcaseBusiness, Building, Home } from 'lucide-react';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

import {
  billingAddressAtom,
  orderNoteAtom,
  shippingAddressAtom,
} from '@/store/checkout';
import OrderViewProducts from '@/app/shared/ecommerce/order/order-products/order-view-products';
import { useCart } from '@/store/quick-cart/cart.context';
import { Title, Text, Button } from 'rizzui';
import cn from '@utils/class-names';
import { toCurrency } from '@utils/to-currency';
import { formatDate } from '@utils/format-date';
import usePrice from '@hooks/use-price';
import { useEffect, useMemo, useState } from 'react';
import { Order } from '@/types';
import { BadgeCent } from 'lucide-react';
import { useTranslation } from '@/app/i18n/client';
import { API_BASE_URL } from '@/config/base-url';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import TrashIcon from '@components/icons/trash';
import ModalCancelOrder from '@/app/components/ui/modals/ModalCancelOrder';
import { useModal } from '../../modal-views/use-modal';
import ModalChangeOrderStatus from '@/app/components/ui/modals/ModalChangeOrderStatus';
import { useUserContext } from '@/app/components/context/UserContext';
import ModalAssignDriver from '@/app/components/ui/modals/ModalAssignDriver';
import PrintInvoice from '../../print-invoice';
import { printOrderReceipt } from '@/app/components/pos/printOrderReceipt ';

interface DeliveryOption {
  id: string;
  name: string;
  value: string;
  icon?: any;
}

function WidgetCard({
  title,
  className,
  children,
  childrenWrapperClass,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
  childrenWrapperClass?: string;
}) {
  return (
    <div className={className}>
      <Title
        as="h3"
        className="mb-3.5 text-base font-semibold @5xl:mb-5 4xl:text-lg"
        >
        {title}
      </Title>
      <div
        className={cn(
          'rounded-lg border border-muted px-5 @sm:px-7 @5xl:rounded-xl',
          childrenWrapperClass
        )}
        >
        {children}
      </div>
    </div>
  );
}

async function fetchLocationDirection(id: string, lang: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Order/GetLocationDirectionForOrder/${id}`, {
      headers: {
        'Accept-Language': lang,
      },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

function formatDuration(seconds: number, lang: string = 'en'): string | null {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0 || days > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    parts.push(`${minutes}m`);
  }
  if (remainingSeconds > 0 || (days === 0 && hours === 0 && minutes === 0 && seconds > 0)) {
    parts.push(`${remainingSeconds}s`);
  }

  if (parts.length === 0) return null;

  return parts.join(':');
}

function calculateTotalDistance(distanceToBranch: string, distanceToUser: string): number {
  const num1 = parseFloat(distanceToBranch.replace(/[^\d.]/g, ''));
  const num2 = parseFloat(distanceToUser.replace(/[^\d.]/g, ''));
  return num1 + num2;
}
export default function OrderView({ lang, initialOrder, currencyAbbreviation, orderPrint, userData, phone, branches, delivery, initialLocationDirection }: { lang: string; initialOrder: Order | null; orderPrint: any; userData: any; phone:string; branches: DeliveryOption[]; delivery: any; currencyAbbreviation: string; initialLocationDirection: any; }) {
  console.log("deliveryInfo: ",delivery);
  
  const text = {
    apartment: lang === 'ar' ? "شقة" : 'apartment',
    home: lang === 'ar' ? "المنزل" : 'Home',
    office: lang === 'ar' ? "المكتب" : 'Office',
    km: lang === 'ar' ? 'كم' : 'KM',
    remainingTime: lang === 'ar' ? 'الوقت المتبقي' : 'Remaining Time',
    away: lang === 'ar' ? 'علي بعد' : 'Away',

    deliveryInfo: lang === 'ar' ? "معلومات سائق التوصيل" : 'Delivery Information',
  };
  const { items, total, totalItems } = useCart();
  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    }
  );
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  const orderNote = useAtomValue(orderNoteAtom);
  const billingAddress = useAtomValue(billingAddressAtom);
  const shippingAddress = useAtomValue(shippingAddressAtom);
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const { orderDetailsStatus, setOrderDetailsStatus } = useUserContext();  
	const { t } = useTranslation(lang! ,'order');
  const [LocationDirection, setLocationDirection] = useState(initialLocationDirection);
  const [currentOrderStatus, setCurrentOrderStatus] = useState<number | undefined>(initialOrder?.status);
  // const currentOrderStatus = order?.status;
  const { id } = useParams();
  // const transitions = [
  //   {
  //     id: 1,
  //     paymentMethod: {
  //       name: `${t('cash-on-delivery')}`,
  //       image:<BadgeCent className="text-mainColor" />
  //     },
  //     // price: '$1575.00',
  //   },
  //   // {
  //   //   id: 2,
  //   //   paymentMethod: {
  //   //     name: 'PayPal',
  //   //     image:
  //   //       'https://isomorphic-furyroad.s3.amazonaws.com/public/payment/paypal.png',
  //   //   },
  //   //   price: '$75.00',
  //   // },
  //   // {
  //   //   id: 2,
  //   //   paymentMethod: {
  //   //     name: 'Stripe',
  //   //     image:
  //   //       'https://isomorphic-furyroad.s3.amazonaws.com/public/payment/stripe.png',
  //   //   },
  //   //   price: '$375.00',
  //   // },
  // ];
  const transitions = useMemo(() => {
    const isDelivery = order?.type === 2;
    return [
      {
        id: 1,
        paymentMethod: {
          name: isDelivery ? t('cash-on-delivery') : t('cash-on-branch'),
          image: <BadgeCent className="text-mainColor" />,
        },
      },
    ];
  }, [order?.type, t]);
  const orderStatus = [
    { id: 0, label: `${t('cancel')}` },
    { id: 1, label: `${t('Pending')}` },
    { id: 2, label: `${t('being-prepared')}` },
    { id: 3, label: `${t('being-delivered')}` },
    { id: 4, label: `${t('delivered')}` },
  ];
  const [loading, setLoading] = useState(!initialOrder);
  const [deliveryInfo, setDeliveryInfoState] = useState<any>(delivery);
  
  async function fetchDeliveryById(driverId?: string) {
    if (!driverId) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/api/Delivery/GetDeliverById/${driverId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch delivery info');
      return await res.json();
    } catch (error) {
      console.error('Error fetching delivery info:', error);
      return null;
    }
  }
  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Order/GetById/GetById/${id}`,
        {
          method: 'GET',
          headers: {
            'Accept-Language': lang,
            'Accept': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data: Order = await response.json();
      setCurrentOrderStatus(data?.status); 

      setOrder(data);
      if (data?.type === 2 && (data.status === 3 || data.status === 4)) {
        const delivery = await fetchDeliveryById(data.deliveryId);
        setDeliveryInfoState(delivery);
      } else {
        setDeliveryInfoState(null);
      }
      if (data?.type === 2 && (data.status === 3)) {
        const fetchLocDir = await fetchLocationDirection(id as string, lang);
        setLocationDirection(fetchLocDir);
      } else {
        setLocationDirection(null);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (orderDetailsStatus) {
      fetchOrder();
      setOrderDetailsStatus(false);
    }
  }, [orderDetailsStatus]);
  useEffect(() => {
    const interval = setInterval(async () => {
      if (order?.type === 2 && order.status === 3) {
        const fetchLocDir = await fetchLocationDirection(id as string, lang);
        setLocationDirection(fetchLocDir);
      } else {
        setLocationDirection(null);
      }
    }, 15000);
  
    return () => clearInterval(interval);
  }, [order?.type, order?.status, id, lang]);
  
  const { openModal } = useModal();
  
  const handleDeleteOrders = async () => {
    openModal({
      view: <ModalCancelOrder
        lang={lang} 
        orderId={id as string}
      />,
      customSize: '480px',
    });
  };
  
  const handleChangeOrderStatus = async () => {
    openModal({
      view: <ModalChangeOrderStatus
        lang={lang} 
        orderId={id as string}
        status={order?.status as number}
      />,
      customSize: '480px',
    });
  };
  
  const handleAssignDriver = async () => {
    openModal({
      view: <ModalAssignDriver
        lang={lang} 
        orderId={id as string}
        status={order?.status as number}
        branches={branches}
      />,
      customSize: '480px',
    });
  };
  const isDeleteDisabled = [0,4].includes(order?.status as number);
  const setDriver = [0,3,4].includes(order?.status as number);
  const printOrder = [0].includes(order?.status as number);
  console.log("order?.type: ",order?.type);

  const addressTypes = [
    {
      name: text.apartment,
      icon: Building,
      value: 0
    },
    {
      name: text.home,
      icon: Home,
      value: 1
    },
    {
      name: text.office,
      icon: BriefcaseBusiness,
      value: 2
    }
  ];

  return (
    <div className="@container mb-5">
      <div className="flex flex-wrap justify-center border-b border-t border-gray-300 py-4 font-medium text-gray-700 @5xl:justify-start">
        <span className="w-full flex flex-col md:flex-row justify-between items-center gap-4 my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          {/* October 22, 2022 at 10:30 pm */}
          <div className='flex flex-col items-center md:items-start gap-2'>
            <Title
              as="h3"
              className="mb-0 text-base font-semibold @7xl:text-lg"
            >
              {order?.branchName}
            </Title>
            {t('ordered-At')}: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) : 'N/A'}
          </div>
          <div className="flex justify-end items-center gap-3 sm:gap-4">
            {!isDeleteDisabled &&(
              <RoleExist PageRoles={['CancleOrder']}>
                <Button onClick={()=>{handleDeleteOrders(); }} className="w-auto flex justify-end items-center gap-0 sm:gap-1.5 ">
                  <TrashIcon className="h-[17px] w-[17px]" />
                  <span className='hidden sm:block'>{lang == "en"?"Delete Data":'الغاء الطلب'}</span>
                </Button>
              </RoleExist>
            )}
            {order?.status != 4 && !isDeleteDisabled && (
              <RoleExist PageRoles={['ChangeOrderStatus']}>
                <Button onClick={()=>{handleChangeOrderStatus(); }} className="w-auto flex justify-end items-center gap-0 sm:gap-1.5 ">
                  <PiArrowsClockwiseBold className="h-[17px] w-[17px]" />
                  <span className='hidden sm:block'>{lang == "en"?"Change Status":'تعديل الحالة'}</span>
                </Button>
              </RoleExist>
            )}
            {!setDriver && order?.type == 2 && (
              <RoleExist PageRoles={['GetAllDelivery', 'AssignOrderToDelivery']}>
                <Button onClick={()=>{handleAssignDriver(); }} className="w-auto flex justify-end items-center gap-0 sm:gap-1.5 ">
                  <PiPlusBold className="h-[17px] w-[17px]" />
                  <span className='hidden sm:block'>{lang == "en"?'Assign Driver':'تعيين سائق'}</span>
                </Button>
              </RoleExist>
            )}
            {!printOrder && (
              <RoleExist PageRoles={['PrintOrderInvoice']}>
                {/* <PrintInvoice order={order} lang={lang} /> */}
                <Button className='w-auto' 
                  onClick={()=>{
                    if(orderPrint.type == 2){
                      const customerInfo: any | undefined = {
                        id: userData.id,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: '',
                        phoneNumber: userData.phoneNumber
                      };
                      printOrderReceipt(orderPrint, lang, customerInfo);
                    }else{
                      printOrderReceipt(orderPrint, lang);
                    }
                  }}
                >
                  <PiPrinterBold className={cn("h-[17px] w-[17px]", lang=='ar' ? "ms-1.5" : "me-1.5")} />
                  <span className='hidden sm:block'>{lang=='ar' ? 'فاتورة' : 'Invoice'}</span>
                </Button>
              </RoleExist>
            )}
          </div>
        </span>
        {/* <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          {totalItems} Items
        </span>
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          Total {totalPrice}
        </span>
        <span className="my-2 ms-5 rounded-3xl border-r border-muted bg-green-lighter px-2.5 py-1 text-xs text-green-dark first:ps-0 last:border-r-0">
          Paid
        </span> */}
      </div>
      <div className="items-start pt-10 @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="space-y-7 @5xl:col-span-8 @5xl:space-y-10 @6xl:col-span-7">
          {orderNote && (
            <div className="">
              <span className="mb-1.5 block text-sm font-medium text-gray-700">
                Notes About Order
              </span>
              <div className="rounded-xl border border-muted px-5 py-3 text-sm leading-[1.85]">
                {orderNote}
              </div>
            </div>
          )}

          <div className="pb-5">
            <OrderViewProducts lang={lang}  currencyAbbreviation={currencyAbbreviation}/>
            <div className="border-t border-muted pt-7 @5xl:mt-3">
            <div className="ms-auto max-w-lg space-y-6">
                <div className="flex justify-between font-medium">
                  {t('Subtotal')} <span className='flex items-center gap-1'>{order?.price} {currencyAbbreviation === "ر.س" ? (
            <Image src={sarIcon} alt="SAR" width={12} height={12} />
          ) : (
            <span>{currencyAbbreviation}</span>
          )}</span>
                </div>
                {order?.type === 2 && (
                  <div className="flex justify-between font-medium">
                    {t('Shipping-Fees')} <span className='flex items-center gap-1'>{order?.shippingFees} {currencyAbbreviation === "ر.س" ? (
              <Image src={sarIcon} alt="SAR" width={12} height={12} />
            ) : (
              <span>{currencyAbbreviation}</span>
            )}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  {t('Vat')} <span className='flex items-center gap-1'>{order?.totalVat} {currencyAbbreviation === "ر.س" ? (
            <Image src={sarIcon} alt="SAR" width={12} height={12} />
          ) : (
            <span>{currencyAbbreviation}</span>
          )}</span>
                </div>
                <div className="flex justify-between border-t border-muted pt-5 text-base font-semibold">
                  {t('Total')} <span className='flex items-center gap-1'> {(order?.price || 0) + (order?.shippingFees || 0) + (order?.totalVat || 0)}{currencyAbbreviation === "ر.س" ? (
            <Image src={sarIcon} alt="SAR" width={12} height={12} />
          ) : (
            <span> {currencyAbbreviation}</span>
          )}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <Title
              as="h3"
              className="mb-3.5  text-base font-semibold @5xl:mb-5 @7xl:text-lg"
            >
              {t('Transactions')}
            </Title>

            <div className="space-y-4">
              {transitions.map((item) => (
                <div
                  key={item.paymentMethod.name}
                  className="flex items-center border-dashed border-mainColor justify-between rounded-lg border px-5 py-5 font-medium shadow-sm transition-shadow @5xl:px-7"
                >
                  <div className="flex w-full items-center">
                    <div className="shrink-0">
                      {/* <Image
                        src={item.paymentMethod.image}
                        alt={item.paymentMethod.name}
                        height={60}
                        width={60}
                        className="object-contain"
                      /> */}{item.paymentMethod.image}
                    </div>
                    <div className="flex flex-col ps-4">
                      <Text as="span" className="font-lexend text-gray-700">
                        {t('Payment')}
                      </Text>
                      <span className="pt-1 text-[13px] font-normal text-gray-500">
                        {item.paymentMethod.name}
                      </span>
                    </div>
                  </div>

                  {/* <div className="w-1/3 text-end">{item.price}</div> */}
                </div>
              ))}
            </div>
          </div>
          {deliveryInfo && (currentOrderStatus == 3 || currentOrderStatus == 4) && (
            <div className="">
              <Title
                as="h3"
                className="mb-3.5 text-base font-semibold @5xl:mb-5 4xl:text-lg"
              >
                {text.deliveryInfo}
              </Title>

              {deliveryInfo[0] ? (
                <div className="flex gap-5 items-center border border-dashed border-mainColor rounded-lg p-5 shadow-sm">
                  <div className="shrink-0">
                    <img
                      src={deliveryInfo[0].personalPhotoUrl}
                      alt="delivery"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold text-gray-900">
                      {deliveryInfo[0].firstName} {deliveryInfo[0].lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t('Phone')} {deliveryInfo[0].phoneNumber}
                    </div>
                    {deliveryInfo[0].zone?.name && (
                      <div className="text-sm text-gray-600">
                        {t('Zone')}: {deliveryInfo[0].zone.name}
                      </div>
                    )}
                    {LocationDirection && (<>
                      {calculateTotalDistance(LocationDirection.routeDistanceToBranch, LocationDirection.routeDistanceToUser) && (
                        <div className="text-sm text-gray-600">
                          {text.away} : <span>{calculateTotalDistance(LocationDirection.routeDistanceToBranch, LocationDirection.routeDistanceToUser)} {text.km}</span>
                        </div>
                      )}
                      {formatDuration(LocationDirection.routeDurationToBranch + LocationDirection.routeDurationToUser, lang) && (
                        <div className="text-sm text-gray-600">
                          {text.remainingTime} : <span>{formatDuration(LocationDirection.routeDurationToBranch + LocationDirection.routeDurationToUser, lang)}</span>
                        </div>
                      )}
                    </>)}
                  </div>
                </div>
              ) : (
                <Text className="text-gray-500 text-sm">
                  {lang === 'ar' ? 'لا توجد معلومات متاحة' : 'No delivery information available'}
                </Text>
              )}
            </div>
          )}

          <div className="">
            {/* <div className="mb-3.5 @5xl:mb-5">
              <Title as="h3" className="text-base font-semibold @7xl:text-lg">
                Balance
              </Title>
            </div> */}
            {/* <div className="space-y-6 rounded-xl border border-muted px-5 py-6 @5xl:space-y-7 @5xl:p-7">
              <div className="flex justify-between font-medium">
                Total Order <span>$5275.00</span>
              </div>
              <div className="flex justify-between font-medium">
                Total Return <span>$350.00</span>
              </div>
              <div className="flex justify-between font-medium">
                Paid By Customer <span>$3000.00</span>
              </div>
              <div className="flex justify-between font-medium">
                Refunded <span>$350.00</span>
              </div>
              <div className="flex justify-between font-medium">
                Balance <span>$4975.00</span>
              </div>
            </div> */}
          </div>
        </div>
        <div className="space-y-7 pt-8 @container @5xl:col-span-4 @5xl:space-y-10 @5xl:pt-0 @6xl:col-span-3">
          <WidgetCard
            title={t('Order-Status')}
            childrenWrapperClass="py-5 @5xl:py-8 flex"
          >
            <div className="ms-2 w-full space-y-7 border-s-2 border-gray-100">
              {currentOrderStatus === 0 &&
                orderStatus
                  .filter((item) => item.id === 0)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "relative ps-6 text-sm font-medium before:absolute before:-start-[11px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:bg-gray-100 before:content-[''] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:bg-gray-100 last:after:hidden",
                        'text-red-500 before:bg-red-500' 
                      )}
                    >
                        
                        <span className={`absolute ${lang ==='en' ? `-start-2`:`-start-1.5`} top-1 text-white`}>
                          <FaTimes  className="h-auto w-3" />
                        </span>
                    
                      {item.label}
                    </div>
                  ))}

              {currentOrderStatus !== 0 &&
                orderStatus
                  .filter((item) => item.id !== 0)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "relative ps-6 text-sm font-medium before:absolute before:-start-[11px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:bg-gray-100 before:content-[''] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:bg-gray-100 last:after:hidden",
                        (currentOrderStatus ?? 1) >= item.id
                          ? 'before:bg-teal-500 after:bg-teal-500' 
                          : 'after:hidden', 
                        currentOrderStatus === item.id && 'before:bg-teal-500 after:hidden' 
                      )}
                    >
                      {(currentOrderStatus ?? 0) >= item.id && item.id !== 0 ? (
                        <span className={`absolute ${lang ==='en' ? `-start-2`:`-start-[0.40rem]`} top-1 text-white`}>
                          <PiCheckBold className="h-auto w-3" />
                        </span>
                      ) : null}

                      {item.label}
                    </div>
                  ))}
            </div>
          </WidgetCard>

          <WidgetCard
            title={t('Customer-Details')}
            childrenWrapperClass="py-5 @5xl:py-8 flex items-center"
          >
            <div className="relative aspect-square h-16 w-16 shrink-0 @5xl:h-20 @5xl:w-20">
              <img
                src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-11.webp"
                alt="avatar"
                className="absolute inset-0 w-full h-full object-cover rounded-full"
                sizes="(max-width: 768px) 100vw"
              />
            </div>
            <div className="ps-4 @5xl:ps-6">
              {/* <Title
                as="h3"
                className="mb-2.5 text-base font-semibold @7xl:text-lg"
              >
                Leslie Alexander
              </Title> */}
              {/* <Text as="p" className="mb-2 break-all last:mb-0">
                nevaeh.simmons@example.com
              </Text> */}
              <Text as="p" className="mb-2 last:mb-0 font-semibold">
                {t('Phone')}
              </Text>
              <Text as="p" className="mb-2 last:mb-0 font-semibold">
                {phone}
              </Text>
            </div>
          </WidgetCard>
          {order?.address && order?.type == 2 && (
            <WidgetCard
              title={t('Shipping-Address')}
              childrenWrapperClass="@5xl:py-6 py-5"
            >
            {order?.address && (
                <div key={order.address.id}>
                  <Title as="h3" className="mb-2 text-base font-semibold @7xl:text-lg">
                    {t('Apartment')} {order.address.apartmentNumber}
                    <br/>
                    {t('Floor')} {order.address.floor}
                    <br/>
                    {t('Street')} {order.address.street}
                  </Title>
                  <Text as="p" className="mb-0 leading-loose">
                    {order.address.additionalDirections}
                  </Text>
                  {(() => {
                    const type = addressTypes.find((a) => a.value === order.address.buildingType);
                    return type ? (
                      <p className='w-full'>
                        <span className="flex items-center gap-1 sm:gap-2 w-full capitalize rounded-sm transition duration-150 bg-transparent text-primary-dark">
                          <type.icon className="w-4 xs:w-auto" />
                          {type.name}
                        </span>
                      </p>
                    ) : null;
                  })()}
                </div>
              )}
            </WidgetCard>
          )}
          {!isEmpty(shippingAddress) && (
            <WidgetCard
              title="Billing Address"
              childrenWrapperClass="@5xl:py-6 py-5"
            >
              <Title
                as="h3"
                className="mb-2.5 text-base font-semibold @7xl:text-lg"
              >
                {shippingAddress?.customerName}
              </Title>
              <Text as="p" className="mb-2 leading-loose last:mb-0">
                {shippingAddress?.street}, {shippingAddress?.city},{' '}
                {shippingAddress?.state}, {shippingAddress?.zip},{' '}
                {shippingAddress?.country}
              </Text>
            </WidgetCard>
          )}
        </div>
      </div>
    </div>
  );
}
