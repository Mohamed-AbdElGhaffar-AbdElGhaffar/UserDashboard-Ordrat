'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiArrowLineDownBold } from 'react-icons/pi';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import PrinterTableForm from '../components/tables/printer/printerTableForm/printerTableForm';

type AddButtonProps = {
  title?: string;
  modalBtnLabel?: string;
  className?: string;
  buttonLabel?: string;
  lang?: string;
  onSuccess?: () => void;
};

export default function AddButton({
  title,
  className,
  lang,
  onSuccess,
}: React.PropsWithChildren<AddButtonProps>) {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() =>
        openModal({
          view: (
            <PrinterTableForm title={title} lang={lang!} onSuccess={onSuccess}/>
          ),
          customSize: '480px',
        })
      }
      className={cn('w-auto', className)}
    >
      <PiPlusBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
      <span className='hidden sm:block'>{title}</span>
    </Button>
  );
}
