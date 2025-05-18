import React, { useState } from 'react';
import { ActionIcon, Text, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import toast from 'react-hot-toast';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import { CartItem as Item } from '@/types';
import { GetCookiesClient } from '../../ui/getCookiesClient/GetCookiesClient';
import { printOrderReceipt } from '../printOrderReceipt ';
import { CheckCircle, Plus } from 'lucide-react';

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

interface ActionsCellProps {
  data: any;
  lang:string;
  languages: number;
  items: Item[];
  clearItemFromCart: (id: number | string) => void;
}

const ActionsPosTables: React.FC<ActionsCellProps> = ({ data, lang, languages, items, clearItemFromCart, }) => {    
  const { closeModal } = useModal();  
  const shopId = GetCookiesClient('shopId');
  const { setTablesData, shipping, setPOSTableOrderId } = useUserContext();
  const [loadingAddOrderItemsTable, setLoadingAddOrderItemsTable] = useState('');
  const [loadingEndOrder, setLoadingEndOrder] = useState('');
  
  const handleAddOrderItems = async () => {
    // openModal({
    //   view: <UpdateTablesForm title={lang == "ar"?'تعديل الطاولة' : 'Update Table'} lang={lang} initData={data} languages={languages}/>,
    //   customSize: '700px',
    // });
    setLoadingAddOrderItemsTable(data.id);const 
    accessToken = GetCookiesClient('accessToken') as string;
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
      formData.append('BranchId', "7b509bf6-7e75-4895-8d3f-0d7c4afa28f5");
      formData.append('EndUserId', "9fd5a273-7273-4a2b-ab50-0bc908d3381e");
      if (decodedToken.uid) {
        formData.append('EmployeeId', decodedToken.uid);
      }
      formData.append('Discount', '0');
      formData.append('GrossProfit', '0');
      formData.append('IsPaid', 'false');
      formData.append('OrderType', '1');
      formData.append('TableId', data.id);
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
        // Clear the cart items
        items.forEach(item => clearItemFromCart(item.id));
        closeModal();
        // Display success toast
        toast.success(<Text as="b">{lang == 'ar'? `تم تقديم الطلب رقم ${response.data.orderNumber} بنجاح!` : 'Order placed ${response.data.orderNumber} successfully!'}</Text>);
        const orderId = response.data.id;
        const orderNumber = response.data.orderNumber;

        if (orderNumber) {
          localStorage.setItem('orderNumber', orderNumber.toString());
        }     
        if (orderId) {
          localStorage.setItem('orderId', orderId.toString());
        } 
      } else {
        console.error('Error creating order:', response.data);
        toast.error(<Text as="b">Failed to place order. Please try again.</Text>);
      }
    } catch (error: any) {
      console.error('Error during order submission:', error);
      toast.error(<Text as="b" className="text-center">{error.response.data.message ? error.response.data.message : 'An error occurred. Please try again later.'}</Text>);
    } finally {
      setLoadingAddOrderItemsTable('');
    }
  };

  const handleEndOrder = async () => {
    setLoadingEndOrder(data.id);
    setTimeout(() => {
      closeModal();
      toast.success(<Text as="b">Order ended successfully</Text>);
      setLoadingEndOrder('');
    }, 600);
  };

  const handleUpdateTable = async () => {
    setPOSTableOrderId(data.id);
    // setTimeout(() => {
    //   closeModal();
    //   toast.success(<Text as="b">Order ended successfully</Text>);
    //   setLoadingEndOrder('');
    // }, 600);
  };

  const handleDeleteTable = async () => {
    try {
      const response = await axiosClient.delete(`/api/Table/DeleteTable/${data.id}`);
  
      if (response.status === 200 || response.status === 204) {
        setTablesData(true);
        toast.success(lang === 'ar' ? 'تم حذف الطاولة بنجاح!' : 'Table deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the table');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the table');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['UpdateTable']}>  
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'اضافة طلب للطاولة' : 'Add Order to Table'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
            onClick={handleAddOrderItems}
            isLoading={loadingAddOrderItemsTable == data.id}
          >
            <Plus className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      </RoleExist>
      <RoleExist PageRoles={['UpdateTable']}>  
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'تعديل طلب الطاولة' : 'Update Table Order'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
            onClick={handleUpdateTable}
            // isLoading={loadingAddOrderItemsTable == data.id}
          >
            <PencilIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      </RoleExist>
      <RoleExist PageRoles={['UpdateTable']}>  
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'إنهاء الطلب' : 'End Order'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
            onClick={handleEndOrder}
            isLoading={loadingEndOrder == data.id}
          >
            <CheckCircle className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      </RoleExist>
      <RoleExist PageRoles={['DeleteTable']}>
        <DeletePopover
          title={lang === 'ar' ? 'حذف الطاولة' : 'Delete the Table'}
          description={
            lang === 'ar' 
              ? `هل أنت متأكد أنك تريد حذف هذه الطاولة ؟`
              : `Are you sure you want to delete this Table ?`
          }
          onDelete={handleDeleteTable}
        />
      </RoleExist>
    </div>
  );
};

export default ActionsPosTables;
