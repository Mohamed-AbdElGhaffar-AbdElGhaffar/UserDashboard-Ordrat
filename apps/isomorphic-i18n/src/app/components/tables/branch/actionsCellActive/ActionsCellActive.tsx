import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import ExchangeIcon from '@components/icons/exchange';
import ModalBranchActive from '@/app/components/ui/modals/ModalBranchActive';

interface ActionsCellProps {
  row: { original: any; id: string };
  lang:string;
  view?:boolean;
  initialUserName?: string;
  initialEmail?: string;
  initialPhone?: string;

}

const ActionsCellActive: React.FC<ActionsCellProps> = ({ row, lang,initialPhone,initialEmail,initialUserName, view = false }) => {
    // console.log("row: ",row);

  const { openModal } = useModal();
 
  const handleOpenModal = () => {
    openModal({
      view: <ModalBranchActive 
        lang={lang} 
        userId={row.original.id}
        status={row.original.isActive}
      />,
      customSize: '480px',
    });
  };
  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <Tooltip
        size="sm"
        content={lang === 'ar' ? 'تعديل حالة المستخدم' : 'Edit User Status'}
        placement="top"
        color="invert"
      >
        <ActionIcon
          as="span"
          size="sm"
          variant="flat"
          className="hover:!border-gray-900 hover:text-gray-700"
          onClick={handleOpenModal}
        >
          {/* <ExchangeIcon */}
           <ExchangeIcon className="h-4 w-4" />
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

export default ActionsCellActive;