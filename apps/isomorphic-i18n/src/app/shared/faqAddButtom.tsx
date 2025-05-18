'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import AddFaqForm from '../components/faq/AddFaqForm/AddFaqForm';
// import AddFaqForm from '../components/Dashboard/AddFaqForm/AddFaqForm';
const FileUpload = dynamic(() => import('@/app/shared/file-upload'), {
  ssr: false,
});

type AddButtonProps = {
  className?: string;
  buttonLabel?: string;
  lang?: string;
  onSuccess?: () => void;
  languages: number;
};

export default function FaqsAddButton({
  className,
  buttonLabel = 'Add Faqs',
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
            <AddFaqForm title={lang === 'ar' ? "قسم أسئلة" : "FAQ Category"} lang={lang!} onSuccess={onSuccess} languages={languages}/>
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
