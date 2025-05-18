'use client';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import TablesForm from '../components/tablesPage/TablesForm/TablesForm';

type AddButtonProps = {
  className?: string;
  buttonLabel?: string;
  lang?: string;
  onSuccess?: () => void;
  languages: number;
};

export default function TableAddButton({
  className,
  buttonLabel = 'Add table',
  lang,
  onSuccess,
  languages
}: React.PropsWithChildren<AddButtonProps>) {
  const { openModal } = useModal();
  return (
    <Button
      onClick={() =>
        openModal({
          view: (
            <TablesForm title={lang === 'ar' ? 'إضافة طاولة' : 'Add Table'} lang={lang!} onSuccess={onSuccess} languages={languages}/>
          ),
          customSize: '700px',
        })
      }
      className={cn('w-auto', className)}
    >
      <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
      <span className='block'>{buttonLabel}</span>
    </Button>
  );
}
