import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import toast from 'react-hot-toast';
import { useUserContext } from '@/app/components/context/UserContext';
import axiosClient from '@/app/components/context/api';
import UpdateCategoryForm from '../categoryTableUpdateForm/categoryTableUpdateForm';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';

interface ActionsCellProps {
  row: { original: { id: string; name: string; }; id: string };
  lang:string;
  languages: number;
} 

const ActionsCellCategory: React.FC<ActionsCellProps> = ({ row, lang, languages }) => {    
  const { openModal } = useModal();
  const { setCategoriesData } = useUserContext();

  const handleOpenModal = () => {
    openModal({
      view: <UpdateCategoryForm title={lang == "en"?"Update Category":'تعديل القسم'} lang={lang} id={row.original.id} onSuccess={()=>setCategoriesData(true)} languages={languages} />,
      customSize: '700px',
    });
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await axiosClient.delete(`/api/Category/Delete/${row.original.id}`);
  
      if (response.status === 200 || response.status === 204) {
        setCategoriesData(true);
        toast.success(lang === 'ar' ? 'تم حذف القسم بنجاح!' : 'Category deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Category');
      }
    } catch (error) {
      console.error('Error deleting Category:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Category');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['UpdateCategory']}>  
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'تعديل القسم' : 'Edit Category'}
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
      <RoleExist PageRoles={['DeleteCategory']}>
        <DeletePopover
          title={lang === 'ar' ? 'حذف القسم' : 'Delete the Category'}
          description={
            lang === 'ar' 
              ? `هل أنت متأكد أنك تريد حذف  ${row.original.name?row.original.name:'هذه القسم'}؟`
              : `Are you sure you want to delete this ${row.original.name?row.original.name:'Category'}?`
          }
          onDelete={handleDeleteCategory}
        />
      </RoleExist>
    </div>
  );
};

export default ActionsCellCategory;
