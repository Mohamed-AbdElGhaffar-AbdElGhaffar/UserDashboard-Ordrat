import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import toast from 'react-hot-toast';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';
import UpdateBranchForm from '../branchTableUpdateForm/branchTableUpdateForm';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  currencyAbbreviation:string;
  languages: number;
}

const ActionsCellBranch: React.FC<ActionsCellProps> = ({ row, lang, languages,currencyAbbreviation }) => {    
  const { openModal } = useModal();
  const { setBranchesData } = useUserContext();

  const handleOpenModal = () => {
    openModal({
      view: <UpdateBranchForm title={lang == "en"?"Update Branch":'تعديل الفرع'} lang={lang} id={row.original.id} onSuccess={()=>setBranchesData(true)} languages={languages} currencyAbbreviation={currencyAbbreviation}/>,
      customSize: '700px',
    });
  };

  const handleDeleteBranch = async () => {
    try {
      const response = await axiosClient.delete(`/api/Branch/Delete/${row.original.id}`);
  
      if (response.status === 200 || response.status === 204) {
        setBranchesData(true);
        toast.success(lang === 'ar' ? 'تم حذف الفرع بنجاح!' : 'Branch deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Branch');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Branch');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['UpdateBranch','GetBranchById','GetBranchByShopId']}>  
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'تعديل الفرع' : 'Edit Branch'}
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
      <RoleExist PageRoles={['DeleteBranch','GetBranchByShopId']}>
        <DeletePopover
          title={lang === 'ar' ? 'حذف الفرع' : 'Delete the Branch'}
          description={
            lang === 'ar' 
              ? `هل أنت متأكد أنك تريد حذف  ${row.original.name?row.original.name:'هذه الفرع'}؟`
              : `Are you sure you want to delete this ${row.original.name?row.original.name:'Branch'}?`
          }
          onDelete={handleDeleteBranch}
        />
      </RoleExist>
    </div>
  );
};

export default ActionsCellBranch;
