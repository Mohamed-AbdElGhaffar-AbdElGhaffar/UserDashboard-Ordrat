'use client';

import dynamic from 'next/dynamic';
import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiArrowLineDownBold } from 'react-icons/pi';
import { PiPlusBold } from 'react-icons/pi';
import { useModal } from '@/app/shared/modal-views/use-modal';
import StoresForm from './updateStore/UpdateStore';
import StoresAddForm from './updateAddStore/UpdateAddStore';
import UpdateFakeDataStore from './updateFakeDataStore/UpdateFakeDataStore';
import { useNextStep } from 'nextstepjs';
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
};

export default function UpdateFakeDataStoreButton({
  title,
  modalBtnLabel = 'Add Store',
  className,
  buttonLabel = 'Add Store',
  lang,
  onSuccess,
}: React.PropsWithChildren<AddButtonProps>) {
  const { openModal } = useModal();

  const { setCurrentStep, isNextStepVisible } = useNextStep();

  return (
    <Button
      onClick={() =>{
        openModal({
          view: (
            <UpdateFakeDataStore
              // id=
              title={title}
              modalBtnLabel={modalBtnLabel}
              lang={lang!}
              onSuccess={onSuccess}
            />
          ),
          customSize: '480px',
        });
        if (isNextStepVisible) {
          setTimeout(() => {
            setCurrentStep(1);
          }, 200)        }
      }}
      className={cn('w-auto bg-redColor hover:bg-mainTextColor', className)}
      id='update-fake-data'
    >
      {/* <PiPlusBold className="me-1.5 h-[17px] w-[17px]" /> */}
      {buttonLabel}
    </Button>
  );
}