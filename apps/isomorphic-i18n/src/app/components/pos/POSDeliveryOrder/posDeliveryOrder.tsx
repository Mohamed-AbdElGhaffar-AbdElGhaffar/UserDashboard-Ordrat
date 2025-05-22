'use client';

import { PiXBold, PiPlusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Switch, Textarea, Text } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './POSDeliveryOrder.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { AxiosError } from 'axios';
import axiosClient from '@/app/components/context/api';
import { useGuardContext } from '@/app/components/context/GuardContext';
import { useUserContext } from '@/app/components/context/UserContext';
import { DateTimePicker } from '@/app/components/ui/DatePickerTime/dateJustTimePicker';
import { format } from "date-fns";
import { DateDurationPicker } from '@/app/components/ui/DatePickerTime/dateDurationPicker';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import { PhoneNumber } from '@ui/phone-input';
import { BriefcaseBusiness, Building, Home } from 'lucide-react';
import LocationPicker from '../LocationPicker';
import { RadioGroup } from '@headlessui/react';
import { CartItem as Item } from '@/types';
import { printOrderReceipt } from '../printOrderReceipt ';

import 'react-datepicker/dist/react-datepicker.css';
import { RadioGroup as Radio, AdvancedRadio } from 'rizzui';
import { PiCheckCircleFill } from 'react-icons/pi';

function parseProductData(productString: string) {
  const dataPairs = productString.split('&&');

  // Define an explicit type
  const productData: Record<string, string> = {};

  dataPairs.forEach(pair => {
    const [key, value] = pair.split(':');
    productData[key] = value;
  });

  return {
    id: productData['id'],
    nameAr: productData['nameAr'],
    nameEn: productData['nameEn'],
    descriptionEn: productData['descriptionEn'],
    descriptionAr: productData['descriptionAr'],
    metaDescriptionEn: productData['metaDescriptionEn'],
    metaDescriptionAr: productData['metaDescriptionAr'],
    variations: Object.keys(productData)
      .filter(key => key.startsWith('variations['))
      .reduce<Record<string, any>>((acc, key) => {
        const match = key.match(/variations\[(.+?)\]\.(.+)/);
        if (match) {
          const [, variationId, field] = match;
          acc[variationId] = acc[variationId] || { id: variationId };
          acc[variationId][field] = productData[key];
        }
        return acc;
      }, {})
  };
}


const fetchOrderDetails = async (orderId: string, lang: string): Promise<any | null> => {
  try {
    const response = await axiosClient.get(`/api/Order/GetById/GetById/${orderId}`, {
      headers: { 'Accept-Language': lang },
    });
    return response.data as any;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    return null;
  }
};

function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error("Invalid JWT token", e);
    return null;
  }
}

type Customer = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber: string;
};

type POSDeliveryOrderProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  languages: number;
  branchZones: { id:string; lat: number; lng: number; zoonRadius: number }[]; 
  items: Item[];
  freeShppingTarget: number;
  shopData: any;
};

export default function POSDeliveryOrder({
  title,
  onSuccess,
  lang = 'en',
  languages,
  branchZones,
  items,
  freeShppingTarget,
  shopData
}: POSDeliveryOrderProps) {
  const shopId = GetCookiesClient('shopId');
  const userType = GetCookiesClient('userType');
  const { closeModal } = useModal();
  const text = {
    firstName: lang === 'ar' ? 'الأسم الاول' : 'First Name',
    lastName: lang === 'ar' ? 'الأسم الاخير' : 'Last Name',
    phoneNumber: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    location: lang === 'ar' ? 'العنوان' : 'Location',
    type: lang === 'ar' ? "نوع العقار" : "Type",
    aptNo: lang === 'ar' ? "رقم الشقة" : "Apt Number.",
    floor: lang === 'ar' ? "رقم الطابق" : "Floor",
    street: lang === 'ar' ? "اسم الشارع" : "Street",
    additionalDirections: lang === 'ar' ? "معلومات اضافية" : "more information",
    
    apartment: lang === 'ar' ? "شقة" : 'apartment',
    home: lang === 'ar' ? "المنزل" : 'Home',
    office: lang === 'ar' ? "المكتب" : 'Office',
    
    wrongPhone: lang === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number',

    submit: lang === 'ar' ? 'انشاء' : 'Create',
    return: lang === 'ar' ? 'رجوع' : 'Return',
  };
  
  const secondText = {
    addNewCustomer: lang === 'ar' ? 'اضافة عميل جديد' : 'Add New Customer',
    addCustomer: lang === 'ar' ? 'اضافة عميل' : 'Add Customer',
    noCustomers: lang === 'ar' ? 'لم يتم العثور على عملاء.' : 'No customers found.',
    submit: lang === 'ar' ? 'اطلب' : 'Order',
    searchByName: lang === 'ar' ? 'بحث بالاسم' : 'Search by Name',
    searchByPhone: lang === 'ar' ? 'بحث برقم الهاتف' : 'Search by Phone',
    
    firstName: lang === 'ar' ? 'الاسم الاول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الاخير' : 'Last Name',
    email: lang === 'ar' ? 'البريد الألكتروني' : 'Email',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    branchId: lang === 'ar' ? 'الفرع' : 'Branch',
    branchLable: lang === 'ar' ? "الفروع:" : "Branches:",
    placeholderBranch: lang === 'ar' ? "اختر فرع" : "Select Branch",
    
    tablePlaceLable: lang === 'ar' ? 'رقم التربيزة:' : 'Table Number:',
    selectIsRequired: lang === 'ar' ? 'الرجاء اختيار العميل' : 'Please select a customer',
    addressIsRequired: lang === 'ar' ? 'الرجاء اختيار عنوان' : 'Please select an address',
    tablePlaceIsRequired: lang === 'ar' ? 'الرجاء تحديد رقم التربيزة' : 'Please select a table number',

    shippingFees: lang === 'ar' ? "رسوم التوصيل" : "Shipping Fees",
    vat: lang === 'ar' ? "الضريبة" : "Vat",
    service: lang === 'ar' ? "رسوم الخدمة" : "Service",
    currency: lang === 'ar' ? "ج.م" : "EGP",
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [isSubmit, setIsSubmit] = useState(false);
  const [radius, setRadius] = useState<number | ''>('');
  const { setGuard } = useGuardContext();
  const { mainBranch } = useUserContext();
  const [pages, setPages] = useState('');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  } | null>(null);  
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [userAddressData, setUserAddressData] = useState<any>(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [shippingFees, setShippingFees] = useState<number | null>(null);

  const filteredBranchZones = branchZones
  .filter(zone => zone.id === mainBranch)
  .map(zone => ({
    lat: zone.lat,
    lng: zone.lng,
    zoonRadius: zone.zoonRadius
  }));

  const initLat = filteredBranchZones.length > 0 ? filteredBranchZones[0].lat : 30.023173855111207;
  const initLng = filteredBranchZones.length > 0 ? filteredBranchZones[0].lng : 31.185028997638923;

  
  const thirdFormik = useFormik({
    initialValues: {
      selectedAddress: '',
    },
    validationSchema: () => {
      let schema = Yup.object({
        selectedAddress: Yup.string().required(secondText.addressIsRequired),
      });
  
      return schema;
    },
    onSubmit: async (values) => {
      console.log("values:", values);
      setLoading(true);
      const accessToken = GetCookiesClient('accessToken') as string;
      const decodedToken = decodeJWT(accessToken);
      console.log("decodedToken: ",decodedToken);
      if (selectedCustomer) {
        try {
          const userId = selectedCustomer.id;
          const addressId = values.selectedAddress;
          const service =
            shopData?.applyServiceOnDineInOnly ? 0 : shopData?.service;
          try {
            const formData = new FormData();
            formData.append('paymentmethod', '0');
            formData.append('TotalPrice', "0");
            formData.append('ShippingFees', shippingFees? shippingFees.toString() : '0');
            formData.append('TotalVat', shopData.vat? shopData.vat.toString() : "0");
            formData.append('Service', service || '0');
            formData.append('ShopId', shopId as string);
            formData.append('BranchId', mainBranch);
            formData.append('EndUserId', userId);
            formData.append('AddressId', addressId);
            if (decodedToken.uid) {
              if(userType == '4'){
                formData.append('EmployeeId', decodedToken.uid);
              }else{
                formData.append('SellerId', decodedToken.uid);
              }
            }
            formData.append('Discount', '0');
            formData.append('GrossProfit', '0');
            formData.append('IsPaid', 'false');
            formData.append('OrderType', '2');
            formData.append('OrderNumber', '0');
            formData.append('GrossProfit', '0');
            formData.append('Price', '0');
            formData.append('TotalChoicePrices', '0');
            formData.append('sourceChannel', '1');
            formData.append('Status', '2');
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace('T', ' '); 
            
            formData.append('CreatedAt', formattedDate);
            
            items.forEach((item, index) => {
              const realProductData = parseProductData(item.id as string)
              formData.append(`Items[${index}].quantity`, item.quantity.toString());
              formData.append(`Items[${index}].productId`, realProductData.id.toString());
              item.orderItemVariations?.forEach((order, orderIndex) => {
                const hasValidChoice = order.choices?.some(
                  (choice) => choice.choiceId || choice.inputValue || choice.image
                );
                if (order.variationId && hasValidChoice) {
                  formData.append(`Items[${index}].orderItemVariations[${orderIndex}].variationId`, order.variationId);
                }
                order.choices?.forEach((choice, choiceIndex) => {
                  if (choice.inputValue) {
                    formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].inputValue`, choice.inputValue);
                  }
                  if (choice.choiceId) {
                    formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].choiceId`, choice.choiceId);
                  }
                  if (choice.image) {
                    formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].image`, choice.image);
                  }
                })
              });
            });
      
            formData.forEach((value, key) => {
              console.log(`${key}: ${value}`);
            });
      
            const response = await axiosClient.post(`/api/Order/Create/${shopId}`, formData);
      
            if (response.status === 200) {
              const orderId = response.data.id;
              const orderNumber = response.data.orderNumber;
      
              if (orderNumber) {
                localStorage.setItem('orderNumber', orderNumber.toString());
              }
              const orderDetails: any | null = await fetchOrderDetails(orderId, lang);
              const customerInfo: any | undefined = {
                id: userId,
                firstName: selectedCustomer.firstName,
                lastName: selectedCustomer.lastName,
                email: '',
                phoneNumber: selectedCustomer.phoneNumber
              };
              
              if (orderDetails) {
                printOrderReceipt(orderDetails, lang, customerInfo);
              }
              toast.success(lang === 'ar' ? 'تم إنشاء الطلب بنجاح' : 'Order created successfully');
              onSuccess?.();
              closeModal();
            } else {
              console.error('Error creating order:', response.data);
              toast.error(<Text as="b">{lang === 'ar' ? 'حدث خطأ أثناء الإنشاء' : 'Failed to create order'}</Text>);
            }
          } catch (error: any) {
            console.error('Error during order submission:', error);
            toast.error(<Text as="b" className="text-center">{error.response.data.message ? error.response.data.message : 'An error occurred. Please try again later.'}</Text>);
          }
        } catch (error: any) {
          console.error('Registration error:', error);
          toast.error(
            error?.response?.data?.message ||
            (lang === 'ar' ? 'حدث خطأ. حاول مرة أخرى' : 'An error occurred. Please try again')
          );
        } finally {
          setLoading(false);
        }
      }
    },
  });

  const fetchCustomers = async (reset = false) => {
    if (loadingCustomers) return;
    setLoadingCustomers(true);
  
    try {
      const response = await axiosClient.get(`/api/EndUser/GetAll/${shopId}`, {
        params: {
          PageNumber: reset ? 1 : page,
          PageSize: 10,
          Name: searchName || null,
          PhoneNumber: searchPhone || null,
        },
        headers: { 'Accept-Language': lang },
      });
  
      const newCustomers = response.data.entities || [];
  
      if (reset) {
        setCustomers(newCustomers);
      } else {
        setCustomers(prev => [...prev, ...newCustomers]);
      }
  
      setHasMore(response.data.nextPage !== 0);
      if (reset) setPage(2);
      else setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };
    
  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loadingCustomers) {
      fetchCustomers();
    }
  };

  useEffect(() => {
    fetchCustomers(true);
  }, [searchName, searchPhone]);

  useEffect(() => {
    if (languages === 0) {
      mainFormik.setFieldValue('nameEn', 'no data');
    } else if (languages === 1) {
      mainFormik.setFieldValue('nameAr', 'no data');
    }
  }, [languages]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (pages === 'chooseAddress' && selectedCustomer?.id) {
        setIsFetchingAddress(true);
        try {
          const response = await axiosClient.get(`/api/EndUser/GetById/${selectedCustomer.id}`);
          const data = response.data;
          console.log('Fetched address data:', data);

          const isInsideZone = (lat: number, lng: number) => {
            return filteredBranchZones.some(zone => {
              const dx = zone.lat - lat;
              const dy = zone.lng - lng;
              const distance = Math.sqrt(dx * dx + dy * dy) * 111000;
              return distance <= zone.zoonRadius;
            });
          };

          const validAddresses = (data.addresses || []).filter(
            (address: any) =>
              typeof address.latitude === 'number' &&
              typeof address.longtude === 'number' &&
              isInsideZone(address.latitude, address.longtude)
          );

          if (validAddresses.length > 0) {
            setUserAddressData(validAddresses);
          } else {
            mainFormik.setFieldValue('firstName', data.firstName || '');
            mainFormik.setFieldValue('lastName', data.lastName || '');
            mainFormik.setFieldValue('phoneNumber', data.phoneNumber || '');
            setPages('newCustomer');
          }
        } catch (error) {
          console.error('Failed to fetch address data:', error);
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء تحميل العنوان' : 'Failed to fetch address');
        } finally {
          setIsFetchingAddress(false);
        }
      }
    };
  
    fetchUserDetails();
  }, [pages, selectedCustomer]);  

  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      if (thirdFormik.values.selectedAddress) {
        try {
          const response = await axiosClient.get(
            `/api/Order/GetDeliveryCharge/${shopId}/${thirdFormik.values.selectedAddress}`
          );
          setShippingFees(response.data.message.shippingFees || 0);
        } catch (error) {
          console.error('Failed to fetch shipping fees:', error);
          setShippingFees(null);
        }
      } else {
        setShippingFees(null);
      }
    };
  
    fetchDeliveryCharge();
  }, [thirdFormik.values.selectedAddress, shopId]);  
  
  const mainFormSchema = Yup.object().shape({
    firstName: Yup.string().required(text.firstName + ' ' + requiredMessage),
    lastName: Yup.string().required(text.lastName + ' ' + requiredMessage),
    phoneNumber: Yup.string().required(`${text.phoneNumber} ${requiredMessage}`).matches(/^20(1[0-2,5][0-9]{8})$/, text.wrongPhone),
    lat: Yup.number().required(text.location + ' ' + requiredMessage),
		lng: Yup.number().required(text.location + ' ' + requiredMessage),
		type: Yup.string().required(text.type + ' ' + requiredMessage),
		aptNo: Yup.number().required(text.aptNo + ' ' + requiredMessage),
		floor: Yup.string().required(text.floor + ' ' + requiredMessage),
		street: Yup.string().required(text.street + ' ' + requiredMessage),
		additionalDirections: Yup.string().optional(),
  });

  const mainFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      lat: initLng || undefined,
			lng: initLng || undefined,
			type: 0,
			aptNo: '',
			floor: '',
			street: '',
			additionalDirections: undefined,
    },
    validationSchema: mainFormSchema,
    onSubmit: async (values) => {
      setIsSubmit(true);
      const accessToken = GetCookiesClient('accessToken') as string;
      const decodedToken = decodeJWT(accessToken);
      console.log("decodedToken: ",decodedToken);
      try {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          shopId: shopId,
          address: {
            additionalDirections: values.additionalDirections || '',
            apartmentNumber: Number(values.aptNo),
            floor: values.floor,
            street: values.street,
            latitude: values.lat,
            longtude: values.lng,
            buildingType: Number(values.type)
          }
        };

        const response = await axiosClient.post(
          `/api/Auth/RegisterEndUserWithAddress/RegisterEndUserWithAddress/${shopId}`,
          payload
        );

        if (response.status === 200 || response.status === 201) {
          console.log("response.message: ", response.data.message);
          const userId = response.data.message.userId;
          const addressId = response.data.message.addressId;
          const deliveryChargeRes = await axiosClient.get(
            `/api/Order/GetDeliveryCharge/${shopId}/${addressId}`
          );
          const shippingFees = deliveryChargeRes?.data?.message?.shippingFees || 0;
        
          const service =
            shopData?.applyServiceOnDineInOnly ? 0 : shopData?.service;
          try {
            const formData = new FormData();
            formData.append('paymentmethod', '0');
            formData.append('TotalPrice', "0");
            formData.append('ShippingFees', shippingFees.toString());
            formData.append('TotalVat', shopData.vat? shopData.vat.toString() : "0");
            formData.append('Service', service || '0');
            formData.append('ShopId', shopId as string);
            formData.append('BranchId', mainBranch);
            formData.append('EndUserId', userId);
            formData.append('AddressId', addressId);
            if (decodedToken.uid) {
              if(userType == '4'){
                formData.append('EmployeeId', decodedToken.uid);
              }else{
                formData.append('SellerId', decodedToken.uid);
              }
            }
            formData.append('Discount', '0');
            formData.append('GrossProfit', '0');
            formData.append('IsPaid', 'false');
            formData.append('OrderType', '2');
            formData.append('OrderNumber', '0');
            formData.append('GrossProfit', '0');
            formData.append('Price', '0');
            formData.append('TotalChoicePrices', '0');
            formData.append('sourceChannel', '1');
            formData.append('Status', '2');
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace('T', ' '); 
            
            formData.append('CreatedAt', formattedDate);
            
            items.forEach((item, index) => {
              const realProductData = parseProductData(item.id as string)
              formData.append(`Items[${index}].quantity`, item.quantity.toString());
              formData.append(`Items[${index}].productId`, realProductData.id.toString());
              item.orderItemVariations?.forEach((order, orderIndex) => {
                const hasValidChoice = order.choices?.some(
                  (choice) => choice.choiceId || choice.inputValue || choice.image
                );
                if (order.variationId && hasValidChoice) {
                  formData.append(`Items[${index}].orderItemVariations[${orderIndex}].variationId`, order.variationId);
                }
                order.choices?.forEach((choice, choiceIndex) => {
                  if (choice.inputValue) {
                    formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].inputValue`, choice.inputValue);
                  }
                  if (choice.choiceId) {
                    formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].choiceId`, choice.choiceId);
                  }
                  if (choice.image) {
                    formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].image`, choice.image);
                  }
                })
              });
            });
      
            formData.forEach((value, key) => {
              console.log(`${key}: ${value}`);
            });
      
            const response = await axiosClient.post(`/api/Order/Create/${shopId}`, formData);
      
            if (response.status === 200) {
              const orderId = response.data.id;
              const orderNumber = response.data.orderNumber;
      
              if (orderNumber) {
                localStorage.setItem('orderNumber', orderNumber.toString());
              }
              const orderDetails: any | null = await fetchOrderDetails(orderId, lang);
              const customerInfo: any | undefined = {
                id: userId,
                firstName: values.firstName,
                lastName: values.lastName,
                email: '',
                phoneNumber: values.phoneNumber
              };

              if (orderDetails) {
                printOrderReceipt(orderDetails, lang, customerInfo);
              }
              toast.success(lang === 'ar' ? 'تم إنشاء الطلب بنجاح' : 'Order created successfully');
              onSuccess?.();
              closeModal();
            } else {
              console.error('Error creating order:', response.data);
              toast.error(<Text as="b">{lang === 'ar' ? 'حدث خطأ أثناء الإنشاء' : 'Failed to create order'}</Text>);
            }
          } catch (error: any) {
            console.error('Error during order submission:', error);
            toast.error(<Text as="b" className="text-center">{error.response.data.message ? error.response.data.message : 'An error occurred. Please try again later.'}</Text>);
          }
        } else {
          toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإنشاء' : 'Failed to create order');
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        toast.error(
          error?.response?.data?.message ||
          (lang === 'ar' ? 'حدث خطأ. حاول مرة أخرى' : 'An error occurred. Please try again')
        );
      } finally {
        setIsSubmit(false);
      }
    },
  });

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

	const handleLocationSelect = (lat: number | undefined, lng: number | undefined, address: string, validateForm: any) => {
		if (lat && lng) {
			mainFormik.setFieldValue('lat', lat);
			mainFormik.setFieldValue('lng', lng);
			// mainFormik.setFieldValue('street', address);
	
			setTimeout(() => {
				validateForm();
			}, 10);
		} else {
			mainFormik.setFieldValue('lat', undefined);
			mainFormik.setFieldValue('lng', undefined);
			// mainFormik.setFieldValue('street', '');
	
			setTimeout(() => {
				validateForm();
			}, 10);
		}
	};	

  
  const secondFormik = useFormik({
    initialValues: {
      selectedCustomer: '',
    },
    validationSchema: () => {
      let schema = Yup.object({
        selectedCustomer: Yup.string().required(secondText.selectIsRequired),
      });
  
      return schema;
    },
    onSubmit: async (values) => {
      console.log("Selected Customer:", selectedCustomer);
      console.log("values:", values);
      setPages('chooseAddress');
    },
  });

  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        {pages == 'newCustomer' ?
          <form onSubmit={(e) => {
            e.preventDefault();
            mainFormik.handleSubmit();
            }}
            className='flex flex-col mt-6'
          >
            <div className="grid grid-cols-1 gap-4 max-h-[60vh] md:max-h-full overflow-y-auto scrollable">
              <div className="flex flex-col gap-4  me-1 md:me-0">
                {/* <MapPicker /> */} 
                {/* <LocationPicker
                  onLocationChange={vals => {
                    setFieldValue('lat', vals?.lat);
                    setFieldValue('lng', vals?.lng);
                  }}
                  initialLocation={initialLocation}
                /> */}
                <LocationPicker
                  apiKey='AIzaSyCPQicAmrON3EtFwOmHvSZQ9IbONbLQmtA' 
                  onLocationSelect={(lat, lng, address) => handleLocationSelect(lat, lng, address, mainFormik.validateForm)}
                  initLat={initLat}
                  initLng={initLng}
                  branchZones={filteredBranchZones}
                  lang={lang!}
                />
                <RadioGroup
                  value={mainFormik.values.type}
                  onChange={(val) => mainFormik.setFieldValue('type', val)}
                  className={'grid md:flex grid-cols-3 gap-1 sm:gap-2 col-span-full'}
                >
                  {addressTypes.map((a, i) => (
                    <RadioGroup.Option key={i} value={a.value} className="flex gap-3">
                    {({ checked }) => (
                      <span
                      className={`px-1 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 w-full capitalize cursor-pointer rounded-lg transition duration-150 ${
                        checked ? 'bg-primary text-white' : 'hover:bg-primary/20'
                      }`}
                      >
                      <a.icon className='w-4 xs:w-auto'/>
                      {a.name}
                      </span>
                    )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={text.firstName} placeholder={text.firstName} name="firstName" value={mainFormik.values.firstName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.firstName && mainFormik.errors.firstName ? mainFormik.errors.firstName : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                <Input label={text.lastName} placeholder={text.lastName} name="lastName" value={mainFormik.values.lastName} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.lastName && mainFormik.errors.lastName ? mainFormik.errors.lastName : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                <PhoneNumber
                  country={'eg'}
                  onlyCountries={['eg']}
                  value={mainFormik.values.phoneNumber}
                  onChange={(value) => mainFormik.setFieldValue('phoneNumber', value)}
                  onBlur={mainFormik.handleBlur}
                  label={text.phoneNumber}
                  error={mainFormik.touched.phoneNumber && mainFormik.errors.phoneNumber ? mainFormik.errors.phoneNumber : ''}
                />
                <Input type='number' label={text.aptNo} placeholder={text.aptNo} name="aptNo" value={mainFormik.values.aptNo} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.aptNo && mainFormik.errors.aptNo ? mainFormik.errors.aptNo : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                <Input label={text.floor} placeholder={text.floor} name="floor" value={mainFormik.values.floor} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.floor && mainFormik.errors.floor ? mainFormik.errors.floor : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                <Input label={text.street} placeholder={text.street} name="street" value={mainFormik.values.street} onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} error={mainFormik.touched.street && mainFormik.errors.street ? mainFormik.errors.street : ''} className="input-placeholder text-[16px]" inputClassName='text-[16px]' />
                <div className="col-span-full">
                  <Textarea
                    label={text.additionalDirections} placeholder={text.additionalDirections} 
                    name="additionalDirections" value={mainFormik.values.additionalDirections}
                    onChange={mainFormik.handleChange} onBlur={mainFormik.handleBlur} 
                    error={mainFormik.touched.additionalDirections && mainFormik.errors.additionalDirections ? mainFormik.errors.additionalDirections : ''} 
                    className="input-placeholder text-[16px]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" isLoading={isSubmit} disabled={isSubmit} className="w-full">
                {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
              </Button>
              <Button onClick={()=>{setPages('');}} variant="outline" className="w-full transition-all duration-300 ease-in-out">
                {text.return}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
              </Button>
            </div>
          </form>
          :
          <>
            {pages == 'chooseAddress'?(
              isFetchingAddress ? (
                <div className="flex justify-center py-6">
                  <Loader className="animate-spin text-primary" />
                </div>
              ) : (
                  <>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      thirdFormik.handleSubmit();
                    }}>
                      <div className="grid grid-cols-2 border-b border-black mb-4 gap-x-4">
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.firstName}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer?.firstName || '----'}</span>
                        </h3>
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.lastName}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer?.lastName || '----'}</span>
                        </h3>
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.email}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer?.email || '----@----.com'}</span>
                        </h3>
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.phone}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer?.phoneNumber || '-- ----------'}</span>
                        </h3>
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.shippingFees}: 
                          <span className="font-normal text-sm leading-[28px] text-gray-500">
                            {shippingFees !== null ? ` ${shippingFees} ${secondText.currency}` : ` 0.00 ${secondText.currency}`}
                          </span>
                        </h3>
                        {!shopData?.applyVatOnDineInOnly && Number(shopData?.vat) > 0 && (
                          <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                            {secondText.vat}:{' '}
                            <span className="font-normal text-sm leading-[28px] text-gray-500">
                              {shopData.vatType === 1
                                ? `${Number(shopData.vat).toFixed(2)} ${secondText.currency}`
                                : `${Number(shopData.vat)}%`}
                            </span>
                          </h3>
                        )}
                        {!shopData?.applyServiceOnDineInOnly && Number(shopData?.service) > 0 && (
                          <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                            {secondText.service}:{' '}
                            <span className="font-normal text-sm leading-[28px] text-gray-500">
                              {`${Number(shopData.service).toFixed(2)} ${secondText.currency}`}
                            </span>
                          </h3>
                        )}
                      </div>
                      <div>
                        <Radio
                          value={thirdFormik.values.selectedAddress}
                          setValue={(value) => thirdFormik.setFieldValue('selectedAddress', value)}
                          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4 items-stretch"
                        >
                          {userAddressData && userAddressData.length > 0 ? (
                            userAddressData.map((address: any) => (
                              <AdvancedRadio
                                key={address.id}
                                value={address.id}
                                contentClassName="h-full px-2 py-2 flex items-start justify-between"
                                inputClassName="[&~span]:border-0 [&~span]:ring-1 [&~span]:ring-gray-200 [&~span:hover]:ring-primary [&:checked~span:hover]:ring-primary [&~span]:bg-white [&:checked~span]:bg-primary-lighter [&:checked~span]:border-1 [&:checked~.rizzui-advanced-checkbox]:ring-2 [&~span>.icon]:opacity-0 [&:checked~span>.icon]:opacity-100"
                              >
                                <div className="w-full h-full flex flex-col justify-between text-sm gap-2">
                                  <div>
                                    <p><b>{text.aptNo}:</b> {address.apartmentNumber}</p>
                                    <p><b>{text.floor}:</b> {address.floor}</p>
                                    <p><b>{text.street}:</b> {address.street}</p>
                                    {address.additionalDirections && (
                                      <p><b>{text.additionalDirections}:</b> {address.additionalDirections}</p>
                                    )}
                                  </div>
                                  
                                  {(() => {
                                    const type = addressTypes.find((a) => a.value === address.buildingType);
                                    return type ? (
                                      <p className='w-full'>
                                        <span className="py-2 flex items-center gap-1 sm:gap-2 w-full capitalize rounded-sm transition duration-150 bg-transparent text-primary-dark">
                                          <type.icon className="w-4 xs:w-auto" />
                                          {type.name}
                                        </span>
                                      </p>
                                    ) : null;
                                  })()}
                                </div>
                                <PiCheckCircleFill className="icon h-5 min-w-[1.25rem] text-primary" />
                              </AdvancedRadio>
                            ))
                          ) : (
                            <Text as="p" className="text-gray-500">{secondText.noCustomers}</Text>
                          )}
                        </Radio>
                      </div>
                      {thirdFormik.errors.selectedAddress && thirdFormik.touched.selectedAddress && (
                        <Text as="p" className="text-red-500 text-sm mb-2">{thirdFormik.errors.selectedAddress}</Text>
                      )}
                      <div className="flex justify-end gap-3">
                        <Button type="submit" isLoading={loading} className="w-full transition-all duration-300 ease-in-out">
                          {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
                        </Button>
                        <Button 
                          onClick={()=>{
                            setPages('');
                            setShippingFees(null);
                            thirdFormik.setFieldValue('selectedAddress', '')
                          }} variant="outline" className="w-full transition-all duration-300 ease-in-out"
                        >
                          {text.return}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
                        </Button>
                      </div> 
                    </form>
                  </>
                )
              ) 
              :
              <>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  secondFormik.handleSubmit();
                }}>
                  {(selectedCustomer) && (
                    <div className='grid grid-cols-2 border-b border-black mb-4 gap-x-4'>
                      {selectedCustomer && (
                        <>
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.firstName}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer.firstName || '----'}</span>
                        </h3>
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.lastName}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer.lastName || '----'}</span>
                        </h3>
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.email}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer.email || '----@----.com'}</span>
                        </h3>
                        <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                          {secondText.phone}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer.phoneNumber || '-- ----------'}</span>
                        </h3>
                        </>
                      )}
                    </div>
                  )}
                  {/* Search Inputs */}
                  <div className="grid col-span-full sm:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder={secondText.searchByName}
                      value={searchName}
                      onChange={(e) => {
                        setSearchName(e.target.value);
                        // handleSearch(e.target.value);
                      }}
                    />
                    <Input
                      type='number'
                      placeholder={secondText.searchByPhone}
                      value={searchPhone}
                      onChange={(e) => {
                        setSearchPhone(e.target.value);
                        // handleSearch(e.target.value);
                      }}
                    />
                  </div>

                  {/* Customer List with Radio Selection */}
                  <div 
                    className={`overflow-auto ${customers.length > 9 ? `max-h-56 ps-1 ${secondFormik.errors.selectedCustomer && secondFormik.touched.selectedCustomer ? 'mb-0':'mb-4'}` : ''}`}
                    onScroll={handleScroll}
                  >
                    <Radio
                      value={secondFormik.values.selectedCustomer}
                      setValue={(value) => {
                        secondFormik.setFieldValue('selectedCustomer', value);
                        const customer = customers.find(c => c.phoneNumber === value);
                        setSelectedCustomer(customer ? {
                          id: customer.id,
                          firstName: customer.firstName || '',
                          lastName: customer.lastName || '',
                          email: customer.email || '',
                          phoneNumber: customer.phoneNumber,
                        } : null);
                      }}
                      className="grid gap-4 pb-4 px-1 pt-1 col-span-full  sm:grid-cols-2 md:grid-cols-3 @4xl:gap-4"
                    >
                      {customers.length > 0 ? (
                        customers.map((customer) => (
                          <AdvancedRadio
                            key={customer.id}
                            value={customer.phoneNumber}
                            contentClassName="px-2 py-2 flex items-center justify-between"
                            inputClassName="[&~span]:border-0 [&~span]:ring-1 [&~span]:ring-gray-200 [&~span:hover]:ring-primary [&:checked~span:hover]:ring-primary [&:checked~span]:border-1 [&:checked~.rizzui-advanced-checkbox]:ring-2 [&~span>.icon]:opacity-0 [&:checked~span>.icon]:opacity-100"
                          >
                            <div className='h-14'>
                              <Text as="p" className="font-medium">{customer.firstName} {customer.lastName}</Text>
                              {customer.email && <Text as="p" className="text-gray-500">{customer.email}</Text>}
                              <Text as="p" className="text-gray-700">{customer.phoneNumber}</Text>
                            </div>
                            <PiCheckCircleFill className="icon h-5 min-w-[1.25rem] text-primary" />
                          </AdvancedRadio>
                        ))
                      ) : (
                        <Text as="p" className="text-gray-500">{secondText.noCustomers}</Text>
                      )}
                    </Radio>
                  </div>
                  {secondFormik.errors.selectedCustomer && secondFormik.touched.selectedCustomer && (
                    <Text as="p" className="text-red-500 text-sm mb-2">{secondFormik.errors.selectedCustomer}</Text>
                  )}
                  <div className="flex justify-end gap-3">
                    <Button type="submit" className="w-full transition-all duration-300 ease-in-out">
                      {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
                    </Button>
                    <Button 
                      onClick={()=>{
                        setSelectedCustomer(null);
                        secondFormik.setFieldValue('selectedCustomer', '');
                        setPages('newCustomer');
                      }} variant="outline" className="w-full transition-all duration-300 ease-in-out"
                    >
                      <span className='block md:hidden'>{secondText.addCustomer}</span><span className='hidden md:block'>{secondText.addNewCustomer}</span><PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
                    </Button>
                  </div> 
                </form>
              </>
            }
          </>
        }
      </div>
    </div>
  );
}
