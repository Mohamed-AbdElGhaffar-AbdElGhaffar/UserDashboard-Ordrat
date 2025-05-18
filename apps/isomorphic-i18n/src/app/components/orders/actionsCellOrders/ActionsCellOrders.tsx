// components/ActionsCell.tsx
import React from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import EyeIcon from '@components/icons/eye';
import DeletePopover from '@/app/shared/delete-popover';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';
import UpdateFAQForm from '../AddOrdersForm/OrdersForm.module.css';
import { useUserContext } from '../../context/UserContext';
import RoleExist from '../../ui/roleExist/RoleExist';
import axiosClient from '../../context/api';
import TrashIcon from '@components/icons/trash';
import ModalCancelOrderItem from '../../ui/modals/ModalCancelOrderItem';

interface ActionsCellProps {
  orderId: string ;
  itemId: string ;
  lang:string;
  view?:boolean; 
  status:number;
  cancelled:boolean; 
}
const ActionsCellOrders: React.FC<ActionsCellProps> = ({ itemId, orderId, lang, view = false, status, cancelled }) => {
  console.log("itemId status: ",status);
  const isDeleteDisabled = [0,4].includes(status);
  
  const { setOrderDetailsTable } = useUserContext();
  const { openModal } = useModal();

  const handleDeleteOrders = async () => {
    if (isDeleteDisabled || cancelled) return; 
    openModal({
      view: <ModalCancelOrderItem
        lang={lang} 
        orderId={orderId}
        itemId={itemId}
      />,
      customSize: '480px',
    });
  };
  // const handleDeleteOrders = async () => {
  //   try {
  //     const cancelReason = 'no reason'; // تقدر تخليها ديناميكية لاحقًا
  //     await axiosClient.patch(
  //       `/api/Order/CancleOrderItem/${itemId}/${orderId}`,
  //       null,
  //       {
  //         params: { cancelReason },
  //         headers: { Accept: '*/*' },
  //       }
  //     );
  
  //     setOrderDetailsTable(true);
  //     toast.success(lang === 'ar' ? 'تم إزالة المنتج من الطلب بنجاح!' : 'Product deleted from order successfully!');
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //     toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإزالة' : 'An error occurred while deleting Product');
  //   }
  // };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['DeleteFAQCategory']}>
        {/* <DeletePopover
          title={lang === 'ar' ? 'إزالة المنتج من الطلب' : 'Delete Product from Order'}
          description={
            lang === 'ar' 
              ? `هل أنت متأكد أنك تريد إزالة  هذا المنتج؟`
              : `Are you sure you want to delete this Product?`
          }
          onDelete={handleDeleteOrders}
        /> */}
        <Tooltip
          size="sm"
          content={
            (isDeleteDisabled || cancelled)
              ? lang === 'ar'
                ? 'لا يمكن حذف المنتج في هذه الحالة'
                : 'Cannot delete product in this status'
              : lang === 'ar'
              ? 'إزالة المنتج'
              : 'Delete Product'
          }
          placement="top"
          color="invert"
        >  
          <ActionIcon
            size="sm"
            variant="outline"
            aria-label={'Delete Item'}
            className={`hover:!border-gray-900 hover:text-gray-700 ${
              (isDeleteDisabled || cancelled) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            onClick={handleDeleteOrders}
          >
            <TrashIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      </RoleExist>
    </div>
  );
};

export default ActionsCellOrders;
