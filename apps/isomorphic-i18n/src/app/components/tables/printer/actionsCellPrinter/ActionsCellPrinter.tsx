import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import toast from 'react-hot-toast';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import UpdatePrinterForm from '../printerTableUpdateForm/printerTableUpdateForm';
import CategoryPrinterForm from '../CategoryPrinterForm/CategoryPrinterForm';
import { PiTagBold } from 'react-icons/pi';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  categories: any[];
}

const ActionsCellPrinter: React.FC<ActionsCellProps> = ({ row, lang, categories }) => {    
  const { openModal } = useModal();
  const { setPrintersData } = useUserContext();

  const handleOpenModal = () => {
    openModal({
      view: <UpdatePrinterForm title={lang == "en"?"Update Printer":'تعديل الطابعة'} lang={lang} data={row.original} onSuccess={()=>setPrintersData(true)}/>,
      customSize: '480px',
    });
  };

  const handleCategoryPrinter = () => {
    openModal({
      view: <CategoryPrinterForm title={lang == "en"?"Assign Category Printer":'تعيين اقسام الطابعة'} lang={lang} data={row.original} onSuccess={()=>setPrintersData(true)} categories={categories}/>,
      customSize: '480px',
    });
  };

  const handleDeletePrinter = async () => {
    try {
      const response = await axiosClient.delete(`/api/Printer/DeletePrinter/${row.original.id}`);
  
      if (response.status === 200 || response.status === 204) {
        setPrintersData(true);
        toast.success(lang === 'ar' ? 'تم حذف الطابعة بنجاح!' : 'Printer deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Printer');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Printer');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['AssignCategoryPrinter', 'DeleteCategoryPrinter']}>  
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'تعيين اقسام الطابعة':"Assign Category Printer"}
          placement="top"
          color="invert"
        >
          <ActionIcon
            as="span"
            size="sm"
            variant="outline"
            className="hover:!border-gray-900 hover:text-gray-700"
            onClick={handleCategoryPrinter}
          >
            <PiTagBold className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      </RoleExist>
      <RoleExist PageRoles={['UpdatePrinter']}>  
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'تعديل الطابعة' : 'Edit Printer'}
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
      <RoleExist PageRoles={['DeletePrinter']}>
        <DeletePopover
          title={lang === 'ar' ? 'حذف الطابعة' : 'Delete the Printer'}
          description={
            lang === 'ar' 
              ? `هل أنت متأكد أنك تريد حذف  ${row.original.name?row.original.name:'هذه الطابعة'}؟`
              : `Are you sure you want to delete this ${row.original.name?row.original.name:'Printer'}?`
          }
          onDelete={handleDeletePrinter}
        />
      </RoleExist>
    </div>
  );
};

export default ActionsCellPrinter;
