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
type POSDeliveryOrderProps = {
  title?: string;
  onSuccess?: () => void;
  lang: string;
  languages: number;
  branchZones: { lat: number; lng: number; zoonRadius: number }[]; 
  items: Item[];
  freeShppingTarget: number;
};

export default function POSDeliveryOrder({
  title,
  onSuccess,
  lang = 'en',
  languages,
  branchZones,
  items,
  freeShppingTarget
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
  };

  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [radius, setRadius] = useState<number | ''>('');
  const { setGuard } = useGuardContext();
  const { mainBranch } = useUserContext();

  useEffect(() => {
    if (languages === 0) {
      mainFormik.setFieldValue('nameEn', 'no data');
    } else if (languages === 1) {
      mainFormik.setFieldValue('nameAr', 'no data');
    }
  }, [languages]);
  
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
      lat: undefined,
			lng: undefined,
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
          try {
            const formData = new FormData();
            formData.append('paymentmethod', '0');
            formData.append('TotalPrice', "0");
            formData.append('ShippingFees', freeShppingTarget.toString() || '0');
            formData.append('TotalVat', "0");
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
            formData.append('Service', '0');
            formData.append('Status', '1');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader className="animate-spin text-blue-500" width={40} height={40} />
      </div>
    );
  }

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
  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
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
                initLat={30.023173855111207}
                initLng={31.185028997638923}
                branchZones={branchZones}
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
          </div>
        </form>
      </div>
    </div>
  );
}
