'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import AddProductForm from '@/app/components/storeProducts/products/AddProductForm/AddProductForm';
// import AddProductForm from '@/app/components/storeProducts/products/AddProductForm/AddProductForm';

type AddButtonProps = {
  className?: string;
  buttonLabel?: string;
  lang?: string;
  onSuccess?: () => void;
};

export default function ProductAddButton({
  className,
  buttonLabel = 'Add Product',
  lang,
  onSuccess,
}: React.PropsWithChildren<AddButtonProps>) {
  const { openModal } = useModal();
  return (
    <Button
      onClick={() =>
        openModal({
          view: (
            <AddProductForm title={lang === 'ar' ? "المنتج" : "Product"} lang={lang!} onSuccess={onSuccess} branchOption={[]} />
          ),
          customSize: '700px',
        })
      }
      className={cn('w-auto', className)}
    >
      <PiPlusBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
      <span className='hidden sm:block'>{buttonLabel}</span>
    </Button>
  );
}
