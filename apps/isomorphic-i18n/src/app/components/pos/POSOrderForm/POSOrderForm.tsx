'use client';

import dynamic from 'next/dynamic';
import { PiXBold, PiPlusBold, PiMinusBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import { ActionIcon, Title, Button, Input, Textarea, Text } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import toast from 'react-hot-toast';
import styles from './POSOrderForm.module.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import axiosClient from '../../context/api';
import { RadioGroup, AdvancedRadio } from 'rizzui';
import { PiCheckCircleFill } from 'react-icons/pi';
import SelectLoader from '@components/loader/select-loader';
import { useUserContext } from '../../context/UserContext';
import POSNewCustomerForm from '../POSNewCustomerForm/POSNewCustomerForm';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
// import { useCart } from '@/store/quick-cart/cart.context';
import { CartItem as Item } from '@/types';
import { printOrderReceipt } from '../printOrderReceipt ';

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

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});
type POSOrderFormProps = {
  title?: string;
  lang: string;
  onSuccess?: () => void;
  tables: { value: string; label: string }[];
  clearItemFromCart: (id: number | string) => void;
  items: Item[];
  branchOption: any[];
};

// const customers = [
//   { id: '1', firstName: 'Ahmed', lastName: 'Ali', email: 'ahmed@example.com', phoneNumber: '0123456789' },
//   { id: '2', firstName: 'Sara', lastName: 'Mohamed', email: '', phoneNumber: '01122334455' },
//   { id: '3', firstName: 'Khaled', lastName: 'Hassan', email: 'khaled@example.com', phoneNumber: '0109876543' },
//   { id: '4', firstName: 'Youssef', lastName: 'Ibrahim', email: 'youssef@example.com', phoneNumber: '0155556789' },
//   { id: '5', firstName: 'Fatima', lastName: 'Sami', email: 'fatima@example.com', phoneNumber: '0167893456' },
//   { id: '6', firstName: 'Omar', lastName: 'Nour', email: '', phoneNumber: '0178881234' },
//   { id: '7', firstName: 'Layla', lastName: 'Fouad', email: 'layla@example.com', phoneNumber: '0186543210' },
//   { id: '8', firstName: 'Zain', lastName: 'Mahmoud', email: 'zain@example.com', phoneNumber: '0199876543' },
//   { id: '9', firstName: 'Mariam', lastName: 'Othman', email: '', phoneNumber: '0101122334' },
//   { id: '10', firstName: 'Tariq', lastName: 'Saleh', email: 'tariq@example.com', phoneNumber: '0115566778' },

//   { id: '11', firstName: 'Hala', lastName: 'Adel', email: 'hala@example.com', phoneNumber: '0126677889' },
//   { id: '12', firstName: 'Bassem', lastName: 'Fathi', email: '', phoneNumber: '0137788990' },
//   { id: '13', firstName: 'Amira', lastName: 'Nader', email: 'amira@example.com', phoneNumber: '0148899001' },
//   { id: '14', firstName: 'Samir', lastName: 'Gamal', email: 'samir@example.com', phoneNumber: '0159900112' },
//   { id: '15', firstName: 'Dina', lastName: 'Ehab', email: '', phoneNumber: '0160011223' },
//   { id: '16', firstName: 'Nour', lastName: 'Salah', email: 'nour@example.com', phoneNumber: '0171122334' },
//   { id: '18', firstName: 'Hassan', lastName: 'Refaat', email: 'hassan@example.com', phoneNumber: '0193344556' },
//   { id: '19', firstName: 'Rania', lastName: 'Mansour', email: 'rania@example.com', phoneNumber: '0104455667' },

// ];

type Customer = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber: string;
};

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

export default function POSOrderForm({
  title,
  lang = 'en',
  onSuccess,
  tables,
  clearItemFromCart,
  items,
  branchOption
}: POSOrderFormProps) {
  const shopId = GetCookiesClient('shopId');
  const userType = GetCookiesClient('userType');
  const { closeModal } = useModal();
  const { shipping } = useUserContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newCustomer, setNewCustomer] = useState(false);
  const [isBranch, setIsBranch] = useState(true);
  const [loading, setLoading] = useState(false);
  // const { items, clearItemFromCart } = useCart();  
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  } | null>(null);  
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const text = {
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
    tablePlaceIsRequired: lang === 'ar' ? 'الرجاء تحديد رقم التربيزة' : 'Please select a table number',
  };
  console.log("shipping: ",shipping);

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
  
  useEffect(() => {
    fetchCustomers(true);
  }, [searchName, searchPhone]);
  
  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loadingCustomers) {
      fetchCustomers();
    }
  };
  
  const requiredMessage = lang === 'ar' ? 'مطلوب' : 'is required';

  const mainFormik = useFormik({
    initialValues: {
      selectedCustomer: '',
      tableNumber: '',
      // branchId: '',
    },
    validationSchema: () => {
      let schema = Yup.object({
        selectedCustomer: Yup.string().required(text.selectIsRequired),
        // branchId: Yup.string().required(text.branchId + ' ' + requiredMessage),    
      });
  
      if (shipping === 'delivery') {
        schema = schema.shape({
          tableNumber: Yup.string().required(text.tablePlaceIsRequired),
        });
      }
  
      return schema;
    },
    onSubmit: async (values) => {
      console.log("Selected Customer:", selectedCustomer);
      console.log("values:", values);
      setLoading(true);
      // setTimeout(() => {
      //   setLoading(false);
      //   if(onSuccess)onSuccess();
      //   closeModal();
      //   toast.success(<Text as="b">Order created successfully</Text>);
      // }, 600);
      const storedBranch = localStorage.getItem('mainBranch');
      const accessToken = GetCookiesClient('accessToken') as string;
      const decodedToken = decodeJWT(accessToken);
      try {
        const formData = new FormData();
        formData.append('paymentmethod', '0');
        formData.append('TotalPrice', "0");
        formData.append('ShippingFees', "0");
        formData.append('TotalVat', "0");
        // formData.append('ShippingFees',fees);
        // formData.append('TotalPrice', String(total || 0));
        // formData.append('TotalVat', String(summary?.tax || 0));
  
        formData.append('ShopId', shopId as string);
        formData.append('BranchId', storedBranch as string);
        formData.append('EndUserId', selectedCustomer?.id || '');
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
        if (shipping == 'delivery') {
          formData.append('OrderType', '1');
          formData.append('TableId', values.tableNumber);
        }else{
          formData.append('OrderType', '0');
        }
        formData.append('OrderNumber', '0');
        formData.append('GrossProfit', '0');
        formData.append('Price', '0');
        formData.append('TotalChoicePrices', '0');
        formData.append('sourceChannel', '1');
        formData.append('Service', '0');
        // formData.append('OrderNumber', 'ORD123456');
        // formData.append('TableNumber', '5');
        formData.append('Status', '1');
        // formData.append('ShopId', `${shopId}`);
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
          if (orderId) {
            localStorage.setItem('orderId', orderId.toString());
          }    
          if (shipping === 'takeaway') {
            try {
              const payOrderResponse = await axiosClient.patch(
                `/api/Order/PayOrder/PayOrder/${orderId}`,
                new FormData().append('sourceChannel', '1'),
              );
              const ChangeOrderStatus = await axiosClient.patch(
                `/api/Order/ChangeOrderStatus/${orderId}?orderStatus=4`,
                new FormData().append('sourceChannel', '1'),
              );
        
              if (payOrderResponse.status === 200 && ChangeOrderStatus.status === 200) {
                // Clear the cart items
                items.forEach(item => clearItemFromCart(item.id));
                if(onSuccess)onSuccess();
                closeModal();
                // Display success toast
                toast.success(<Text as="b">{lang == 'ar'? 'تم تقديم الطلب بنجاح!' : 'Order placed successfully!'}</Text>);
              } else {
                console.error('Error paying order:', payOrderResponse.data);
                toast.error(<Text as="b">{lang == 'ar'? 'فشل الدفع. يُرجى المحاولة مرة أخرى.' : 'Payment failed. Please try again.'}</Text>);
              }
            } catch (error: any) {
              console.error('Error during order payment:', error);
              toast.error(
                <Text as="b" className="text-center">
                  {error.response?.data?.message || 'An error occurred while processing payment.'}
                </Text>
              );
            }
          }else {
            // Clear the cart items
            items.forEach(item => clearItemFromCart(item.id));
            if(onSuccess)onSuccess();
            closeModal();
            toast.success(<Text as="b">{lang == 'ar'? 'تم تقديم الطلب بنجاح!' : 'Order placed successfully!'}</Text>);
          }   
          const orderDetails: any | null = await fetchOrderDetails(orderId, lang);
          const customerInfo: any | undefined = selectedCustomer ? {
            id: selectedCustomer.id,
            firstName: selectedCustomer.firstName,
            lastName: selectedCustomer.lastName,
            email: selectedCustomer.email,
            phoneNumber: selectedCustomer.phoneNumber
          } : undefined;

          if (orderDetails) {
            // Auto-print the invoice
            console.log("orderDetails: ",orderDetails);
            
            printOrderReceipt(orderDetails, lang, customerInfo);
          }
        } else {
          console.error('Error creating order:', response.data);
          toast.error(<Text as="b">Failed to place order. Please try again.</Text>);
        }
      } catch (error: any) {
        console.error('Error during order submission:', error);
        toast.error(<Text as="b" className="text-center">{error.response.data.message ? error.response.data.message : 'An error occurred. Please try again later.'}</Text>);
      } finally {
        setLoading(false);
      }
    },
  });

  // const handleSearch = (search: string) => {
  //   const filtered = customers.filter(
  //     (customer) =>
  //       customer.firstName?.toLowerCase().includes(search.toLowerCase()) ||
  //       customer.phoneNumber.includes(search)
  //   );
  //   console.log("filtered: ",filtered);
    
  //   setFilteredCustomers(filtered);
  // };

  // const tables = [
  //   {value: '1', label: lang=='ar'?'1':'1',},
  //   {value: '2', label: lang=='ar'?'2':'2',},
  //   {value: '3', label: lang=='ar'?'3':'3',},
  //   {value: '4', label: lang=='ar'?'4':'4',},
  //   {value: '5', label: lang=='ar'?'5':'5',},
  // ]

  return (
    <div className='py-1'>
      <div className={`m-auto ps-3 rounded-xl pe-1.5 me-1.5 pb-4 pt-4 IBM-Plex-sans ${styles.customScroll}`}>
        <div className="mb-6 flex items-center justify-between">
          <Title as="h3" className="text-lg IBM-Plex-sans">{title || text.submit}</Title>
          <ActionIcon size="sm" variant="text" onClick={closeModal} className="p-0 text-gray-500 hover:!text-gray-900">
            <PiXBold className="h-[18px] w-[18px]" />
          </ActionIcon>
        </div>
        {newCustomer?
          <>
            <POSNewCustomerForm onSuccess={()=>{console.log('done')}} onReturn={()=>{setNewCustomer(false)}} lang={lang!} />
          </>
        :
          <form onSubmit={(e) => {
            e.preventDefault();
            mainFormik.handleSubmit();
          }}>
            {(selectedCustomer || shipping == 'delivery') && (
              <div className='grid grid-cols-2 border-b border-black mb-4 gap-x-4'>
                {selectedCustomer && (
                  <>
                  <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                    {text.firstName}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer.firstName || '----'}</span>
                  </h3>
                  <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                    {text.lastName}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer.lastName || '----'}</span>
                  </h3>
                  <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                    {text.email}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer.email || '----@----.com'}</span>
                  </h3>
                  <h3 className="font-bold text-sm leading-[28px] text-black pb-[10px] truncate overflow-hidden whitespace-nowrap">
                    {text.phone}: <span className="font-normal text-sm leading-[28px] text-gray-500">{selectedCustomer.phoneNumber || '-- ----------'}</span>
                  </h3>
                  </>
                )}
                {shipping == 'delivery' && (
                  <Select
                    options={tables}
                    value={tables.find((option: any) => option.value === mainFormik.values.tableNumber)}
                    onChange={(value) => {
                      mainFormik.setFieldValue('tableNumber', value);
                    }}
                    label={text.tablePlaceLable}
                    placeholder={text.tablePlaceIsRequired}
                    className="mb-4"
                    labelClassName='font-bold text-sm leading-[28px] text-black'
                    error={mainFormik.errors.tableNumber as string}
                    getOptionValue={(option) => option.value}
                    inPortal={false}
                  />
                )}
                {/* <Select
                  options={branchOption}
                  value={branchOption?.find((option: any) => option.value === mainFormik.values.branchId)}
                  onChange={(value) => mainFormik.setFieldValue('branchId', value)}
                  label={text.branchLable}
                  placeholder={text.placeholderBranch}
                  className="mb-4"
                  labelClassName='font-bold text-sm leading-[28px] text-black'
                  error={mainFormik.errors.branchId as string}
                  getOptionValue={(option) => option.value}
                  inPortal={false}
                /> */}
              </div>
            )}
            {/* Search Inputs */}
            <div className="grid col-span-full sm:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder={text.searchByName}
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  // handleSearch(e.target.value);
                }}
              />
              <Input
                type='number'
                placeholder={text.searchByPhone}
                value={searchPhone}
                onChange={(e) => {
                  setSearchPhone(e.target.value);
                  // handleSearch(e.target.value);
                }}
              />
            </div>

            {/* Customer List with Radio Selection */}
            <div 
              className={`overflow-auto ${customers.length > 9 ? `max-h-56 pl-1 ${mainFormik.errors.selectedCustomer && mainFormik.touched.selectedCustomer ? 'mb-0':'mb-4'}` : ''}`}
              onScroll={handleScroll}
            >
              <RadioGroup
                value={mainFormik.values.selectedCustomer}
                setValue={(value) => {
                  mainFormik.setFieldValue('selectedCustomer', value);
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
                  <Text as="p" className="text-gray-500">{text.noCustomers}</Text>
                )}
              </RadioGroup>
            </div>
            {mainFormik.errors.selectedCustomer && mainFormik.touched.selectedCustomer && (
              <Text as="p" className="text-red-500 text-sm mb-2">{mainFormik.errors.selectedCustomer}</Text>
            )}
            <div className="flex justify-end gap-3">
              <Button onClick={()=>{setNewCustomer(true)}} variant="outline" className="w-full transition-all duration-300 ease-in-out">
                <span className='block md:hidden'>{text.addCustomer}</span><span className='hidden md:block'>{text.addNewCustomer}</span><PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
              </Button>
              <Button type="submit" isLoading={loading} className="w-full transition-all duration-300 ease-in-out">
                {text.submit}<PiPlusBold className="ms-1.5 h-[17px] w-[17px]" />
              </Button>
            </div> 
          </form>
        }
      </div>
    </div>
  );
}
