'use client';

import { atom, useAtomValue, useSetAtom } from 'jotai';

export type DrawerPlacements = 'left' | 'right' | 'top' | 'bottom';

type DrawerTypes = {
  view: React.ReactNode;
  isOpen: boolean;
  placement?: DrawerPlacements;
  customSize?: string;
};

const drawerAtom = atom<DrawerTypes>({
  isOpen: false,
  view: null,
  placement: 'left', // default placement
  customSize: '280px',
});

export function useDrawer({lang}:{lang:string}) {
  const state = useAtomValue(drawerAtom);
  const setState = useSetAtom(drawerAtom);

  const openDrawer = ({
    view,
    placement,
    customSize,
    lang,
  }: {
    view: React.ReactNode;
    placement?: DrawerPlacements;
    customSize?: string;
    lang: string;
  }) => {
    const calculatedPlacement = lang === 'ar' ? 'right' : 'left';

    setState({
      ...state,
      isOpen: true,
      view,
      placement:  calculatedPlacement,
      customSize,
    });
  };

  const closeDrawer = () => {
    setState({
      ...state,
      isOpen: false,
    });
  };

  return {
    ...state,
    openDrawer,
    closeDrawer,
  };
}
