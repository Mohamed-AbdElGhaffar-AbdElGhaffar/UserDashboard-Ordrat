'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiArrowLineDownBold } from 'react-icons/pi';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import BranchTableForm from '../components/tables/branch/branchTableForm/branchTableForm';
// import PlanForm from '../components/plan/planForm/PlanForm';
const FileUpload = dynamic(() => import('@/app/shared/file-upload'), {
  ssr: false,
});

type AddButtonProps = {
  title?: string;
  modalBtnLabel?: string;
  className?: string;
  buttonLabel?: string;
  lang?: string;
  onSuccess?: () => void;
  languages: number;
};

export default function AddButton({
  title,
  className,
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
            <BranchTableForm title={title} lang={lang!} onSuccess={onSuccess} languages={languages}/>
          ),
          customSize: '700px',
        })
      }
      className={cn('w-auto', className)}
    >
      <PiPlusBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
      <span className='hidden sm:block'>{title}</span>
    </Button>
  );
}
