'use client'
import { Transition } from '@headlessui/react';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const QrCode = dynamic(() => import('./qrCode'), {
  ssr: false,
});

const QrCodeWrapper = ({lang}:{lang:string}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div className="mx-auto flex w-full flex-col justify-center rounded-2xl bg-white px-14 shadow-md">
      <Transition
        enter={'transition duration-100 ease-out'}
        enterFrom={'transform translate-y-1/4 opacity-100'}
        enterTo={'transform -translate-y-0 opacity-100'}
        leave={'transition duration-300 ease-out'}
        leaveFrom={'transform translate-y-0 opacity-100'}
        leaveTo={'transform -translate-y-1/4 opacity-0'}
        show={isMounted}
      >
        <QrCode lang={lang} />
      </Transition>
    </div>
  );
};

export default QrCodeWrapper;
