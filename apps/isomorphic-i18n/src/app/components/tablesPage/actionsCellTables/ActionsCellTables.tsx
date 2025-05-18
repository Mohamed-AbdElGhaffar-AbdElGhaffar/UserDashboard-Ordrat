import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import toast from 'react-hot-toast';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import UpdateTablesForm from '../UpdateTablesForm/UpdateTablesForm';

interface ActionsCellProps {
  data: any;
  lang:string;
  languages: number;
}

const ActionsCellTables: React.FC<ActionsCellProps> = ({ data, lang, languages }) => {    
  const { openModal } = useModal();
  const { setTablesData } = useUserContext();

  const handleUpdateModal = () => {
    openModal({
      view: <UpdateTablesForm title={lang == "ar"?'تعديل الطاولة' : 'Update Table'} lang={lang} initData={data} languages={languages}/>,
      customSize: '700px',
    });
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
          content={lang === 'ar' ? 'تعديل الطاولة' : 'Update Table'}
          placement="top"
          color="invert"
        >
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
            onClick={handleUpdateModal}
          >
            <PencilIcon className="h-4 w-4" />
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

export default ActionsCellTables;
