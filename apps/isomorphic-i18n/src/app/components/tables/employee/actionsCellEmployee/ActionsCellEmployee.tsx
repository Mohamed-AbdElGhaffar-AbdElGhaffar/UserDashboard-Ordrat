import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import toast from 'react-hot-toast';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import CreateUser from '@/app/shared/roles-permissions/create-user';
import UpdateUser from '@/app/shared/roles-permissions/update-user';

interface ActionsCellProps {
  user: any;
  lang:string;
  onDeleteItem: () => void;
  groupOptions:{ value: string, label: string }[];
  branchOption: any[];
}

const ActionsCellEmployee: React.FC<ActionsCellProps> = ({ user, lang, onDeleteItem, groupOptions, branchOption }) => {    
  const { openModal } = useModal();
  const { setGroupsPermissions } = useUserContext();
  // console.log("user: ",user);
  
  const handleOpenModal = () => {
    openModal({
      view: <UpdateUser lang={lang} groupOptions={groupOptions} branchOption={branchOption} user={user}/>,
      customSize: '700px',
    });
  };


  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['UpdateBranch','GetBranchById','GetBranchByShopId']}>  
        <Tooltip size="sm" content={lang === 'ar' ? 'تعديل المستخدم' : 'Edit User'} placement="top" color="invert">
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
      <RoleExist PageRoles={['UpdateBranch','GetBranchById','GetBranchByShopId']}>
        <DeletePopover
          title={
            lang === 'ar'
              ? 'حذف هذا المستخدم'
              : 'Delete this user'
          }
          description={
            lang === 'ar'
              ? `هل أنت متأكد أنك تريد حذف المستخدم رقم #${user.id}؟`
              : `Are you sure you want to delete this #${user.id} user?`
          }
          onDelete={onDeleteItem}
        />
      </RoleExist>
    </div>
  );
};

export default ActionsCellEmployee;
