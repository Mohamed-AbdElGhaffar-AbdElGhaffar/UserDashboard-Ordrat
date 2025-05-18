'use client';

import { Title, ActionIcon } from 'rizzui';
import cn from '@utils/class-names';
import { PiXBold } from 'react-icons/pi';
import { useUserContext } from '../components/context/UserContext';
import { useEffect, useState } from 'react';

type DrawerHeaderProps = {
  heading: string;
  lang?: string;
  onClose: () => void;
  headerClassName?: string;
};

export default function DrawerHeader({
  onClose,
  heading,
  lang = 'en',
  headerClassName,
}: DrawerHeaderProps) {
  const { posTableOrderId } = useUserContext();
  return (
    <div
      className={cn(
        'mb-4 flex items-center justify-between border-b border-muted px-4 py-[14px]',
        headerClassName
      )}
    >
      <Title as="h5" className="font-semibold">
        {posTableOrderId? lang=='ar'? `طاولة رقم ${posTableOrderId.tableNumber}`:`Table ${posTableOrderId.tableNumber}` : heading}
      </Title>
      <ActionIcon variant="outline" onClick={onClose} className="border-0 p-0">
        <PiXBold className="h-auto w-5" />
      </ActionIcon>
    </div>
  );
}
