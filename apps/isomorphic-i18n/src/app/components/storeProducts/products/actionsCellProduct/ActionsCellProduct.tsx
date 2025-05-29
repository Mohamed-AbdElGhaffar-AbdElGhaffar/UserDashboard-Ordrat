import React from 'react';
import { ActionIcon, Tooltip } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PencilIcon from '@components/icons/pencil';
import DeletePopover from '@/app/shared/delete-popover';
import { API_BASE_URL } from '@/config/base-url';
import toast from 'react-hot-toast';
// import { useFileContext } from '../../context/FileContext';
import { useUserContext } from '@/app/components/context/UserContext';
import UpdateProductForm from '../UpdateProductForm/UpdateProductForm';
import Link from 'next/link';
import RoleExist from '@/app/components/ui/roleExist/RoleExist';
import UpdateCategoryForm from '@/app/components/tables/category/categoryTableUpdateForm/categoryTableUpdateForm';
import { Package } from 'lucide-react';
import ModalChangeOrderStatus from '@/app/components/ui/modals/ModalChangeOrderStatus';
import ModalChangeStockNumber from '../ModalChangeStockNumber';

interface ActionsCellProps {
  row: any ;
  lang:string;
  view?:boolean; 
}

const ActionsCellProduct: React.FC<ActionsCellProps> = ({ row, lang, view = false }) => {    
  const { openModal } = useModal();
  const { setProductData } = useUserContext();  
  
  const handleOpenModal = () => {
    openModal({
      view: <ModalChangeStockNumber
        lang={lang} 
        stocks={row.original.stocks}
        productImage={row.original.imageUrl}
        productName={row.original.name}
      />,
      customSize: '480px',
    });
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Products/Delete/${row.original.id}`, {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
        },
      });

      if (response.ok) {
        setProductData(true);
        toast.success(lang === 'ar' ? 'تم حذف المنتج بنجاح!' : 'Product deleted successfully!');
      } else {
        toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Product');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الحذف' : 'An error occurred while deleting the Product');
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 pe-3">
      <RoleExist PageRoles={['sellerDashboard-storeProducts-products-update']}> 
        <Tooltip
          size="sm"
          content={lang === 'ar' ? 'تعديل المنتج' : 'Edit Product'}
          placement="top"
          color="invert"
        >
          <Link href={`/${lang}/storeProducts/products/update/${row.original.id}`}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              className="hover:!border-gray-900 hover:text-gray-700"
            >
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
      </RoleExist>
      {row.original.stocks.length != 0 && (
        <RoleExist PageRoles={['UpdateProductStock']}>  
          <Tooltip
            size="sm"
            content={lang === 'ar' ? 'تغيير عدد المخزون' : 'Change Stock Number'}
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
              <Package className="h-4 w-4" />
            </ActionIcon>
          </Tooltip>
        </RoleExist>
      )}
      <RoleExist PageRoles={['DeleteProducts']}>
        <DeletePopover
          title={lang === 'ar' ? 'حذف المنتج' : 'Delete Product'}
          description={
            lang === 'ar' 
              ? `هل أنت متأكد أنك تريد حذف  (${row.original.title?row.original.title:'المنتج هذه '})؟`
              : `Are you sure you want to delete this (${row.original.title?row.original.title:'Product '})?`
          }
          onDelete={handleDeleteProduct}
        />
      </RoleExist>
    </div>
  );
};

export default ActionsCellProduct;
