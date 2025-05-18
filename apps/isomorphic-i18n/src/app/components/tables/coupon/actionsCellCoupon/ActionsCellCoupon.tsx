import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import toast from 'react-hot-toast';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';
import CouponTableUpdateForm from '../couponTableUpdateForm/CouponTableUpdateForm';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
}

const ActionsCellCoupon: React.FC<ActionsCellProps> = ({ row, lang }) => {    
  const { openModal } = useModal();
  const { setCouponData } = useUserContext();

  const handleOpenModal = () => {
    openModal({
      view: <CouponTableUpdateForm title={lang == "en"?"Update Coupon":'تعديل الكوبون'} lang={lang} id={row.original.id} onSuccess={()=>setCouponData(true)} />,
      customSize: '700px',
    });
  };

  const handleDeleteCoupon = async () => {
    try {
      const response = await axiosClient.delete(`/api/Coupon/Delete/${row.original.id}`);
  
      if (response.status === 200 || response.status === 204) {
        setCouponData(true);
        toast.success(lang === 'ar' ? 'تم حذف الكوبون بنجاح!' : 'Coupon deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Coupon');
      }
    } catch (error) {
      console.error('Error deleting Coupon:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Coupon');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['UpdateCoupon']}>  
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'تعديل الكوبون' : 'Edit Coupon'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
            onClick={handleOpenModal}
          >
            <PencilIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      </RoleExist>
      <RoleExist PageRoles={['DeleteCoupon']}>
        <DeletePopover
          title={lang === 'ar' ? 'حذف الكوبون' : 'Delete the Coupon'}
          description={
            lang === 'ar' 
              ? `هل أنت متأكد أنك تريد حذف  ${row.original.name?row.original.name:'هذه الكوبون'}؟`
              : `Are you sure you want to delete this ${row.original.name?row.original.name:'Coupon'}?`
          }
          onDelete={handleDeleteCoupon}
        />
      </RoleExist>
    </div>
  );
};

export default ActionsCellCoupon;
