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
import UpdateFAQForm from '../UpdateFAQForm/UpdateFAQForm';
import { useUserContext } from '../../context/UserContext';
import RoleExist from '../../ui/roleExist/RoleExist';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  view?:boolean; 
  languages: number;
}
const ActionsCellFAQ: React.FC<ActionsCellProps> = ({ row, lang, view = false, languages }) => {
    
  const { openModal } = useModal();
  const { setUpdateFaq } = useUserContext();

  const handleOpenModal = () => {
    openModal({
      view: <UpdateFAQForm lang={lang} row={row.original} onSuccess={()=>setUpdateFaq(true)} languages={languages}/>,
      customSize: '700px',
    });
  };

  const handleDeleteFAQ = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/FAQCategory/Delete/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (response.ok) {
        setUpdateFaq(true);
        toast.success(lang === 'ar' ? 'تم حذف قسم الأسئلة بنجاح!' : 'Faq Category deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Category');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Category');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['UpdateFAQCategory']}>
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'تعديل قسم الأسئلة' : 'Edit Faq Category'}
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
      <RoleExist PageRoles={['DeleteFAQCategory']}>
        <DeletePopover
          title={lang === 'ar' ? 'حذف قسم الأسئلة' : 'Delete Faq Category'}
          description={
            lang === 'ar' 
              ? `هل أنت متأكد أنك تريد حذف  ${row.original.name?row.original.name:'قسم الأسئلة هذا '}؟`
              : `Are you sure you want to delete this ${row.original.name?row.original.name:'Faq Category '}?`
          }
          onDelete={handleDeleteFAQ}
        />
      </RoleExist>
    </div>
  );
};

export default ActionsCellFAQ;
