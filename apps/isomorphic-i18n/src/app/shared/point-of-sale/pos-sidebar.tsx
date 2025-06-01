'use client';

import React, { useEffect, useState } from 'react';
import { CartItem } from '@/types';
import { EmptyProductBoxIcon, Button, Title, Text } from 'rizzui';
import toast from 'react-hot-toast';
import { PriceCalculation } from '@/app/shared/point-of-sale/pos-drawer-view';
import POSOrderProductsTwo from '@/app/shared/point-of-sale/pos-order-products-two';
// import { useCart } from '../../../../../isomorphic/src/store/quick-cart/cart.context';
import { useTranslation } from '@/app/i18n/client';
import { useCart } from '@/store/quick-cart/cart.context';
import { useModal } from '@/app/shared/modal-views/use-modal';
import AddFaqForm from '@/app/components/faq/AddFaqForm/AddFaqForm';
import POSOrderForm from '@/app/components/pos/POSOrderForm/POSOrderForm';
import delivery from '@public/assets/modals/order-being-delivered.png';
import takeaway from '@public/assets/food-pickup.png';
import { RadioGroup, AdvancedRadio } from 'rizzui';
import { PiCheckCircleFill } from 'react-icons/pi';
import Image from 'next/image';
import { useUserContext } from '@/app/components/context/UserContext';
import POSTablesForm from '@/app/components/pos/POSTablesForm/POSTablesForm';
import axiosClient from '@/app/components/context/api';
import { GetCookiesClient } from '@/app/components/ui/getCookiesClient/GetCookiesClient';
import POSTableOrderProductsTwo from './pos-table-order-products-two';
import ModalCancelOrder from '@/app/components/ui/modals/ModalCancelOrder';
import { printOrderReceipt } from '@/app/components/pos/printOrderReceipt ';
import POSDeliveryOrder from '@/app/components/pos/POSDeliveryOrder/posDeliveryOrder';

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

type PosSidebarProps = {
  simpleBarClassName?: string;
  lang?: string;
  orderedItems: CartItem[];
  removeItemFromCart: (id: number | string) => void;
  clearItemFromCart: (id: number | string) => void;
  tables: { value: string; label: string }[];
  branchOption: any[];
  allDatatables: any[];
  languages: number;
  branchZones: { id:string; lat: number; lng: number; zoonRadius: number }[]; 
  freeShppingTarget: number;
  defaultUser: string;
  shopData: any;
  currencyAbbreviation: string;
}; 

function PostSidebar({
  simpleBarClassName,
  lang = 'en',
  orderedItems,
  removeItemFromCart,
  clearItemFromCart,
  tables,
  branchOption, 
  allDatatables,
  languages,
  branchZones,
  freeShppingTarget,
  defaultUser,
  shopData,
  currencyAbbreviation
}: PosSidebarProps) {
  const { shipping, setShipping, posTableOrderId, setPOSTableOrderId, 
    updateMainBranch, setUpdateMainBranch, setTablesData,
    mainBranch } = useUserContext();
  const shopId = GetCookiesClient('shopId');
  const userType = GetCookiesClient('userType');
  const [loading, setLoading] = useState(false);
  const [updateOrderLoading, setUpdateOrderLoading] = useState(false);
  const [addOrderToTable, setAddOrderToTable] = useState(false);
  const [closeOrder, setCloseOrder] = useState(false);
  const [isUpdatedAvailable, setIsUpdatedAvailable] = useState(false);
  const { t, i18n } = useTranslation(lang!, "home");
  const { openModal } = useModal();
  
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  useEffect(() => {
    if (updateMainBranch == true) {
      setPOSTableOrderId('');
      localStorage.removeItem('posTableOrderId');
      items.forEach(item => clearItemFromCart(item.id));
      setUpdateMainBranch(false);
    }
  }, [updateMainBranch]);
  const { resetCart, items, addItemToCart } = useCart();
  
  useEffect(() => {
    if (!posTableOrderId?.order?.items) return;
  
    const filteredItems = filterItems(items, posTableOrderId);
    const increasedQuantityItems = findMatchingItems(items, posTableOrderId);
  
    setIsUpdatedAvailable(filteredItems.length === 0 && increasedQuantityItems.length === 0);
  }, [lang, items, posTableOrderId]);
  

  function handleOrder() {
    setLoading(true);
    if (shipping == 'takeaway') {
      setTimeout(() => {
        setLoading(false); 
        openModal({
          view: (
            <POSOrderForm 
              clearItemFromCart={clearItemFromCart} 
              items={items} tables={tables} onSuccess={resetCart} 
              title={lang === 'ar' ? "الكاشير" : "POS"} 
              lang={lang!} 
              currencyAbbreviation={shopData.currencyAbbreviation}
              branchOption={branchOption}
            />
          ),
          customSize: '700px',
        })
        console.log('createOrder data ->', orderedItems);
      }, 600);
    }else{
      setTimeout(() => {
        setLoading(false); 
        openModal({
          view: (
            <POSDeliveryOrder 
              title={lang === 'ar' ? "الكاشير" : "POS"} 
              lang={lang!} onSuccess={resetCart} 
              languages={languages} branchZones={branchZones}
              items={items}
              freeShppingTarget={freeShppingTarget}
              shopData={shopData}
              currencyAbbreviation={shopData.currencyAbbreviation}

            />
          ),
          customSize: '700px',
        })
        console.log('createOrder data ->', orderedItems);
      }, 600);
    }
  }

  function handleTables() {
    openModal({
      view: (
        <POSTablesForm
          title={lang === 'ar' ? "الطاولات" : "Tables"} 
          lang={lang!} 
          items={items} 
          clearItemFromCart={clearItemFromCart} 
          allDatatables={allDatatables}
          languages={languages}
          addItemToCart={addItemToCart}
        />
      ),
      customSize: '700px',
    })
  }

  function handleReturn() {
    setPOSTableOrderId('');
    localStorage.removeItem('posTableOrderId');
    items.forEach(item => clearItemFromCart(item.id));
  }

  function variationsMatch(orderVariations: any[], realVariations: any): boolean {
    return orderVariations.every((orderVar) => {
      const realVar = realVariations[orderVar.variationId];
      if (!realVar) return false;
  
      return orderVar.choices.every((choice: any) => {
        // Check for input-based variation (e.g., inputValue)
        if (choice.inputValue) {
          return realVar.inputValue === choice.inputValue;
        }
  
        // Check for choice-based variation (e.g., choiceId)
        return realVar.choiceId === choice.choiceId;
      });
    });
  }

  function filterItems(items: any[], posTableOrderId: any) {
    const orderItems = posTableOrderId?.order?.items ?? [];
  
    // Find items that are not in the current order or are cancelled
    return items.filter((item) => {
      const realProductData = parseProductData(item.id);
      const orderItem = orderItems.find((orderItem: any) =>
        orderItem.product.id === realProductData.id &&
        variationsMatch(orderItem.orderItemVariations, realProductData.variations)
      );
  
      // Include items that are either not found or marked as cancelled
      if (!orderItem || orderItem.cancelled) {
        return true;
      }
  
      return false;
    });
  }
  
  function findMatchingItems(items: any[], posTableOrderId: any) {
    const orderItems = posTableOrderId.order.items;
  
    // Find all matching order items and attach their ID
    return items
      .map((item) => {
        const realProductData = parseProductData(item.id);
  
        // Find matching order item
        const orderItem = orderItems.find((orderItem: any) =>
          orderItem.product.id === realProductData.id &&
          !orderItem.cancelled &&
          variationsMatch(orderItem.orderItemVariations, realProductData.variations) &&
          item.quantity > orderItem.quantity
        );
  
        // If a matching order item is found, attach the orderItem.id to the item
        if (orderItem) {
          return { ...item, orderItemId: orderItem.id, orderId: posTableOrderId.order.id };
        }
  
        // Return null if no match
        return null;
      })
      .filter((item) => item !== null); // Remove null values
  }
  
  async function handleUpdateOrder() {
    setUpdateOrderLoading(true);
    setIsUpdatedAvailable(true);
    console.log("posTableOrderId: ", posTableOrderId);
    console.log("items: ", items);
    
    const filteredItems = filterItems(items, posTableOrderId);
    console.log("Filtered Items: ", filteredItems);
    
    const increasedQuantityItems = findMatchingItems(items, posTableOrderId);
    console.log("Increased Quantity Items: ", increasedQuantityItems);
  
    try {
      // Handle filtered items (new items to be added)
      if (filteredItems.length !== 0) {
        for (const item of filteredItems) {
          const realProductData = parseProductData(item.id);
          const formData = new FormData();
          
          // Append required fields
          formData.append('Quantity', item.quantity.toString());
          formData.append('ItemPrice', item.price.toString());
          formData.append('TotalChoicesPrice', item.itemTotal.toString());
          formData.append('OriginalPrice', item.oldPrice.toString());
          formData.append('DiscountAmount', '0');
          formData.append('DiscountType', '0');
          formData.append('SpecialInstructions', item.notes || '');
          formData.append('ShopId', shopId as string);
          formData.append('ProductId', realProductData.id);
          formData.append('sourceChannel', '1');
  
          // Handle variations
          item.orderItemVariations?.forEach((variation: any, vIndex: any) => {
            formData.append(`OrderItemVariations[${vIndex}].variationId`, variation.variationId);
            
            variation.choices.forEach((choice: any, cIndex: any) => {
              if (choice.choiceId) {
                formData.append(`OrderItemVariations[${vIndex}].choices[${cIndex}].choiceId`, choice.choiceId);
              }
              if (choice.inputValue) {
                formData.append(`OrderItemVariations[${vIndex}].choices[${cIndex}].inputValue`, choice.inputValue);
              }
              if (choice.image) {
                formData.append(`OrderItemVariations[${vIndex}].choices[${cIndex}].image`, choice.image);
              }
            });
          });
  
          try {
            const response = await axiosClient.put(
              `/api/Order/AddOrderitemasync/${posTableOrderId.order.id}`,
              formData,
              {
                headers: {
                  Accept: '*/*',
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
  
            if (response.status === 200) {
              console.log(`Item ${item.name} added successfully!`);
              toast.success(
                lang === 'ar'
                  ? `تمت إضافة المنتج ${item.name} بنجاح!`
                  : `Item ${item.name} added successfully!`
              );
            } else {
              console.error(`Failed to add item ${item.name}:`, response.data);
              toast.error(
                lang === 'ar'
                  ? `فشل في إضافة المنتج ${item.name}`
                  : `Failed to add item ${item.name}`
              );
            }
          } catch (error) {
            console.error(`Error adding item ${item.name}:`, error);
            toast.error(
              lang === 'ar'
                ? `حدث خطأ أثناء إضافة المنتج ${item.name}`
                : `Error adding item ${item.name}`
            );
          } finally {
            setTablesData(true);
            if (increasedQuantityItems.length === 0) {
              handleReturn();
            }
          }
        }
      }
  
      // Handle increased quantity items (update existing items)
      if (increasedQuantityItems.length !== 0) {
        for (const item of increasedQuantityItems) {
          try {
            const formData = new FormData();
            formData.append('sourceChannel', '1');
            const quantity = item.quantity;
  
            await axiosClient.put(
              `/api/Order/UpdateOrderItemQuantity/UpdateOrderItemQuantity${item.orderId}/${item.orderItemId}`,
              formData,
              {
                params: { quantity },
              }
            );
  
            toast.success(lang === 'ar' ? 'تم تحديث الكمية بنجاح!' : 'Quantity updated successfully!');
          } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error(lang === 'ar' ? 'خطأ أثناء تحديث الكمية' : 'Error updating quantity');
          } finally {
            setTablesData(true);
            if (filteredItems.length === 0) {
              handleReturn();
            }
          }
        }
      }
  
      // No items to add or update
      if (filteredItems.length === 0 && increasedQuantityItems.length === 0) {
        console.log("No items to add.");
        toast.error(lang === 'ar' ? 'لا توجد منتجات للإضافة أو التحديث' : 'No items to add or update.');
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(
        lang === 'ar'
          ? "حدث خطأ أثناء تحديث الطلب. حاول مرة أخرى."
          : "Error while updating order. Please try again."
      );
    } finally {
      setUpdateOrderLoading(false);
      setIsUpdatedAvailable(false);
      setTablesData(true);
      if (filteredItems.length != 0 && increasedQuantityItems.length != 0) {
        handleReturn();
      }
    }
  }
  
  const handleAddOrderItems = async () => {
    setAddOrderToTable(true);
    const accessToken = GetCookiesClient('accessToken') as string;
    const decodedToken = decodeJWT(accessToken);
    console.log("decodedToken: ",decodedToken);
    try {
      const formData = new FormData();
      formData.append('paymentmethod', '0');
      formData.append('TotalPrice', "0");
      formData.append('ShippingFees', "0");
      formData.append('TotalVat', "0");
      formData.append('ShopId', shopId as string);
      formData.append('BranchId', mainBranch);
      formData.append('EndUserId', defaultUser);
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
      formData.append('OrderType', '1');
      formData.append('TableId', posTableOrderId.id);
      formData.append('OrderNumber', '0');
      formData.append('GrossProfit', '0');
      formData.append('Price', '0');
      formData.append('TotalChoicePrices', '0');
      formData.append('sourceChannel', '1');
      formData.append('Service', '0');
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
        // Clear the cart items
        // items.forEach(item => clearItemFromCart(item.id));
        // Display success toast
        const orderId = response.data.id;
        const orderNumber = response.data.orderNumber;

        if (orderNumber) {
          localStorage.setItem('orderNumber', orderNumber.toString());
        }     
        if (orderId) {      
          try {
            const tableResponse = await axiosClient.patch(
              `/api/Order/SelectTableForOrder/SelectTableForOrder/${orderId}/${posTableOrderId.id}`
            );
      
            if (tableResponse.status === 200) {
              setTablesData(true);
              handleReturn();
              toast.success(<Text as="b">{lang == 'ar'? `تم فتح الطلب رقم ${response.data.orderNumber} للطاولة بنجاح!` : `Order placed ${response.data.orderNumber} to table successfully!`}</Text>);
            } else {
              console.error('Error assigning table:', tableResponse.data);
              toast.error(
                <Text as="b">
                  {lang == 'ar' 
                    ? 'فشل في تعيين الطاولة. حاول مجددًا.' 
                    : 'Failed to assign table. Please try again.'}
                </Text>
              );
            }
          } catch (error) {
            console.error('Error during table assignment:', error);
            toast.error(
              <Text as="b">
                {lang == 'ar' 
                  ? 'حدث خطأ أثناء تعيين الطاولة. حاول مجددًا.' 
                  : 'Error occurred while assigning table. Please try again.'}
              </Text>
            );
          }
        } 
      } else {
        console.error('Error creating order:', response.data);
        toast.error(<Text as="b">Failed to place order. Please try again.</Text>);
      }
    } catch (error: any) {
      console.error('Error during order submission:', error);
      toast.error(<Text as="b" className="text-center">{error.response.data.message ? error.response.data.message : 'An error occurred. Please try again later.'}</Text>);
    } finally {
      setAddOrderToTable(false);
    }
  };
  
  const handleCloseOrder = async () => {
    setCloseOrder(true);
    try {
      // Attempt to pay the order
      let payOrderResponse;
      try {
        payOrderResponse = await axiosClient.patch(
          `/api/Order/PayOrder/PayOrder/${posTableOrderId.order.id}`,
          new FormData().append('sourceChannel', '1')
        );
        console.log("Payment API Response:", payOrderResponse.data);
      } catch (paymentError: any) {
        // Check if the error is due to the order being already paid
        if (paymentError.response?.status === 404 && paymentError.response?.data?.message === "the order already paid") {
          console.warn("Order already paid, proceeding to change order status.");
        } else {
          console.error('Error during order payment:', paymentError.response?.data?.message || paymentError.message);
          toast.error(
            <Text as="b" className="text-center">
              {paymentError.response?.data?.message || 'An error occurred while processing payment.'}
            </Text>
          );
          setCloseOrder(false);
          return;
        }
      }
  
      // Change the order status if the order is paid or already paid
      try {
        const changeOrderStatusResponse = await axiosClient.patch(
          `/api/Order/ChangeOrderStatus/${posTableOrderId.order.id}?orderStatus=4`,
          new FormData().append('sourceChannel', '1')
        );
  
        if (changeOrderStatusResponse.status === 200) {
          // Clear the cart items
          items.forEach(item => clearItemFromCart(item.id));
          setTablesData(true);
          handleReturn();
          // Display success toast
          toast.success(
            <Text as="b">{lang === 'ar' ? 'تم تقفيل الطاولة بنجاح!' : 'Table Paid successfully!'}</Text>
          );
          const mockOrder = {
            id: posTableOrderId.order.id,
            orderNumber: posTableOrderId.order.orderNumber,
            createdAt: new Date(posTableOrderId.order.createdAt),
            price: posTableOrderId.order.price,
            shippingFees: posTableOrderId.order.shippingFees,
            totalVat: posTableOrderId.order.totalVat,
            discount: posTableOrderId.order.discount,
            totalPrice: posTableOrderId.order.totalPrice,
            // address: {
            //   street: "No address",
            //   apartmentNumber: "-",
            //   floor: "-"
            // },
            items: posTableOrderId.order.items
              .filter((item: any) => !item.cancelled)
              .map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                itemPrice: item.itemPrice,
                product: {
                  id: item.product.id,
                  name: lang == 'ar'? item.product.nameAr : item.product.nameEn
                },
                orderItemVariations: item.orderItemVariations.map((variation: any) => ({
                  variationId: variation.variationId,
                  variationNameEn: variation.variationNameEn,
                  variationNameAr: variation.variationNameAr,
                  choices: variation.choices.map((choice: any) => ({
                    choiceId: choice.choiceId,
                    choiceNameEn: choice.choiceNameEn,
                    choiceNameAr: choice.choiceNameAr,
                    price: choice.price
                  }))
                }))
              }))
          };          
          
          const mockCustomer = {
            id: "cust-001",
            firstName: "Ahmed",
            lastName: "Ali",
            phoneNumber: "+966501234567"
          };
          const orderDetails: any | null = await fetchOrderDetails(posTableOrderId.order.id, lang);

          printOrderReceipt(orderDetails, lang,undefined,currencyAbbreviation);
          // printOrderReceipt(posTableOrderId.order, lang, {
          //   firstName: posTableOrderId.order.endUser?.firstName,
          //   lastName: posTableOrderId.order.endUser?.lastName,
          //   phoneNumber: posTableOrderId.order.endUser?.phoneNumber
          // });
        } else {
          console.error('Error changing order status:', changeOrderStatusResponse.data);
          toast.error(
            <Text as="b">{lang === 'ar' ? 'فشل تغيير حالة الطلب. حاول مجددًا.' : 'Failed to change order status. Please try again.'}</Text>
          );
        }
      } catch (statusError: any) {
        console.error('Error during status change:', statusError);
        toast.error(
          <Text as="b" className="text-center">
            {statusError.response?.data?.message || 'An error occurred while changing order status.'}
          </Text>
        );
      }
    } catch (error: any) {
      console.error('Unexpected error during order closure:', error);
      toast.error(
        <Text as="b" className="text-center">
          {error.response?.data?.message || 'An unexpected error occurred while closing the order.'}
        </Text>
      );
    } finally {
      setCloseOrder(false);
    }
  };
    
  function findMatchingOrderItem(orderItems: any[], realProductData: any): string | null {
    const matchingItem = orderItems.find((item) => {
      // Check if product ID matches
      if (item.product.id !== realProductData.id) return false;
      if (item.cancelled == true) return false;

      // Check if variations match
      const orderVariations = item.orderItemVariations || [];
      const realVariations = realProductData.variations || {};

      return variationsMatch(orderVariations, realVariations);
    });

    // Return the item ID if found, otherwise null
    return matchingItem ? matchingItem.id : null;
  }

  const handleDeleteOrder = async () => {
    const localStorageOrder = localStorage.getItem('posTableOrderId');
    let allItemsCancelled = true;
  
    if (localStorageOrder && posTableOrderId?.order?.items?.length > 0) {
      for (const item of items) {
        const realProductData = parseProductData(item.id as string);
        const matchingItem = posTableOrderId.order.items.find(
          (orderItem: any) =>
            orderItem.product.id === realProductData.id &&
            variationsMatch(orderItem.orderItemVariations, realProductData.variations)
        );
  
        if (matchingItem && matchingItem.cancelled === false) {
          allItemsCancelled = false;
          break;
        }
      }
  
      if (!allItemsCancelled) {
        openModal({
          view: (
            <ModalCancelOrder
              lang={lang}
              orderId={posTableOrderId.order.id}
              onSuccess={() => {
                setTablesData(true);
                resetCart();
                handleReturn();
              }}
            />
          ),
          customSize: '480px',
        });
        return;
      }
    }
  
    resetCart();
  };  

  const options = [
    {
      value: 'delivery',
      name: lang === 'ar' ? 'توصيل' : 'Delivery',
      image: delivery,
    },
    {
      value: 'takeaway',
      name: lang === 'ar' ? 'استلام يدوي' : 'Take Away',
      image: takeaway,
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-5 py-3 pb-0 lg:px-7">
        <Title as="h5" className="font-semibold">
          {posTableOrderId? lang=='ar'? `طاولة رقم ${posTableOrderId.tableNumber}`:`Table ${posTableOrderId.tableNumber}` : t('customer-order')}
        </Title>
        {orderedItems?.length > 0 && (
          <Button variant="text" onClick={handleDeleteOrder} className="pe-0">
            {t('clear-all')}
          </Button>
        )}
      </div>
      <div className="ps-5 lg:ps-7">
        {!!orderedItems?.length && (
          <>
          {posTableOrderId?.tableStatus == 1?
            <POSTableOrderProductsTwo
              orderedItems={orderedItems}
              orderId={posTableOrderId.order.id}
              lang={lang}
              removeItemFromCart={removeItemFromCart}
              clearItemFromCart={clearItemFromCart}
              simpleBarClassName={simpleBarClassName}
              currencyAbbreviation={shopData.currencyAbbreviation}
              showControls
            />
            :
            <POSOrderProductsTwo
              orderedItems={orderedItems}
              lang={lang}
              removeItemFromCart={removeItemFromCart}
              clearItemFromCart={clearItemFromCart}
              simpleBarClassName={simpleBarClassName}
              currencyAbbreviation={shopData.currencyAbbreviation}
              showControls
            />
          }
          </>
        )}
      </div>
      {!!orderedItems?.length && (
        <>
          {posTableOrderId?
            <>
              {posTableOrderId.tableStatus == 1 && (
                <div className="flex gap-4 px-5 my-4 lg:px-7">
                  <Button
                    className="h-11 w-full"
                    isLoading={closeOrder}
                    onClick={handleCloseOrder}
                  >
                    {t("close-order")}
                  </Button>
                </div>
              )}
            </>
            :
            <>
            {!!orderedItems?.length && (
              <RadioGroup
                value={shipping}
                setValue={setShipping}
                className="col-span-full grid gap-4 p-4 @2xl:grid-cols-2 @4xl:gap-4 items-stretch"
              >
                {options.map((item) => (
                  <AdvancedRadio
                    key={item.value}
                    value={item.value}
                    contentClassName="h-full px-2 py-2 flex items-center justify-around"
                    inputClassName="[&~span]:border-0 [&~span]:ring-1 [&~span]:ring-gray-200 [&~span:hover]:ring-primary [&:checked~span:hover]:ring-primary [&:checked~span]:border-1 [&:checked~.rizzui-advanced-checkbox]:ring-2 [&~span>.icon]:opacity-0 [&:checked~span>.icon]:opacity-100"
                  >
                    <div className='flex flex-col justify-between gap-2 font-bold'>
                      <Image src={item.image} alt={item.name} className='w-14 h-14 object-cover' width={650} height={300} />
                      <p>{item.name}</p>
                    </div>
                    <PiCheckCircleFill className="icon h-5 min-w-[1.25rem] text-primary" />
                  </AdvancedRadio>
                ))}
              </RadioGroup>
            )}
            </>
          }
        </>
      )}
      {!orderedItems?.length && (
        <div className="flex h-full flex-col justify-center">
          <span />
          <div>
            <EmptyProductBoxIcon className="mx-auto h-auto w-52 text-gray-400" />
            <Title as="h5" className="mt-6 text-center">
              {t('you-have-no-order')}
            </Title>
            <Text className="mt-1 text-center">{t('start-ordering')}!!</Text>
          </div>
        </div>
      )}
      {!!orderedItems?.length && (
        <div className="border-t border-gray-300 p-4 pb-0 lg:p-4">
          <PriceCalculation lang={lang} shippingValue={shipping} shopData={shopData} currencyAbbreviation={currencyAbbreviation} />
          {posTableOrderId?
            <div className="flex gap-4">
              {posTableOrderId.tableStatus == 1?
                <Button
                  className="h-11 w-full"
                  isLoading={updateOrderLoading}
                  disabled={isUpdatedAvailable}
                  onClick={handleUpdateOrder}
                >
                  {t("update-order")}
                </Button>
                :
                <Button
                  className="h-11 w-full"
                  isLoading={addOrderToTable}
                  onClick={handleAddOrderItems}
                >
                  {t("open-order")}
                </Button>
              }
              <Button
                variant="outline"
                className="h-11 w-full"
                onClick={handleReturn}
              >
                {t("return")}
              </Button>
            </div>
            :
            <div className="flex gap-4">
              <Button
                className="h-11 w-full"
                isLoading={loading}
                onClick={handleOrder}
              >
                {t("order-now")}
              </Button>
              <Button
                variant="outline"
                className="h-11 w-full"
                onClick={handleTables}
              >
                {t("open-tables")}
              </Button>
            </div>
          }
        </div>
      )}
      {!orderedItems?.length && (
        <div className="border-t border-gray-300 p-4 pb-0 lg:p-4 mt-4">
          {posTableOrderId?
            <div className="flex flex-col gap-4">
              {posTableOrderId.tableStatus == 1 &&(
                <Button
                 className="h-11 w-full"
                 isLoading={closeOrder}
                 onClick={handleCloseOrder}
                >
                 {t("close-order")}
                </Button>
              )}
              <Button
                // variant="outline"
                className="h-11 w-full"
                onClick={handleReturn}
              >
                {t("return")}
              </Button>
            </div>
            :
            <div className="flex gap-4">
              <Button
                // variant="outline"
                className="h-11 w-full"
                onClick={handleTables}
              >
                {t("open-tables")}
              </Button>
            </div>
          }
        </div>
      )}
    </>
  );
}

export default PostSidebar;
