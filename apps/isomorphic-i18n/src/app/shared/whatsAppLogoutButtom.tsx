'use client';

import { Button } from 'rizzui';
import cn from '@utils/class-names';
import { PiPlusBold } from 'react-icons/pi';
import { GetCookiesClient } from '../components/ui/getCookiesClient/GetCookiesClient';
import toast from 'react-hot-toast';
import axiosClient from '../components/context/api';
import { useState } from 'react';
type LogoutButtomProps = {
  title?: string;
  className?: string;
  lang?: string;
  onSuccess?: () => void;
  loading: boolean;
};

export default function LogoutButtom({
  title,
  className,
  lang,
  onSuccess,
  loading
}: React.PropsWithChildren<LogoutButtomProps>) {
  const shopId = GetCookiesClient('shopId') as string;
  const [isSubmit, setSubmiting] = useState(false);

  const handleDisconnect = async () => {
    setSubmiting(true);
    try {
      const response = await axiosClient.post(
        `/api/Whatsapp/disconnect/${shopId}?clearSession=true`
      );

      if (response.data?.success) {
        if(onSuccess){onSuccess();}
      } else {
        toast.error(lang === 'ar' ? 'فشل فصل الجهاز' : 'Failed to disconnect device');
      }
    } catch (error) {
      console.error('Disconnect Error:', error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الفصل' : 'An error occurred while disconnecting');
    }finally{
      setSubmiting(false);
    }
  };
  return (
    <Button
      onClick={handleDisconnect}
      isLoading={loading || isSubmit}
      disabled={loading || isSubmit}
      className={cn('w-auto', className)}
    >
      <PiPlusBold className="me-0 sm:me-1.5 h-[17px] w-[17px]" />
      <span className='hidden sm:block'>{title}</span>
    </Button>
  );
}
