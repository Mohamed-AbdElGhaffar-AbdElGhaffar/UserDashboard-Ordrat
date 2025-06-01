'use client';

import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function ResponsiveToaster() {
  const [top, setTop] = useState(50);

  useEffect(() => {
    const handleResize = () => {
      setTop(window.innerWidth < 800 ? 90 : 50);
    };

    handleResize(); // أول مرة
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Toaster
      toastOptions={{
        style: { zIndex: 999999 },
        className: 'toastTop',
      }}
      containerStyle={{
        zIndex: 999999,
        position: 'fixed',
        left: 0,
        top,
      }}
    />
  );
}
