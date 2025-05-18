
import { ColorTypes } from '@/app/components/contsxt1/colorTypes';
import { Disclosure, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ArrowSvg } from '../../svgs/arrowSvg';
import { ResetSvg } from '../../svgs/resetSvg';
import { CheckMarkSvg } from '../../svgs/checkMarkSvg';

type DetailsProps = {
  title: string;
  children: React.ReactNode;
};

export type ButtonProps = {
  title: string;
  lang?: string;
  active?: boolean;
  onClick?: () => void;
  isColorPicker?: boolean;
  color?: ColorTypes['colors'];
  resettable?: boolean;
};

const Details = ({ title ,children }: DetailsProps) => {
  return (
    <>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={clsx(
                'mt-5 flex w-full items-center border justify-between rounded-lg bg-[#F8F9FA] hover:bg-[#E2E8F0] py-5 px-6  text-sm text-[#3A4B5D] focus:outline-none focus-visible:ring focus-visible:ring-[#2F566A] focus-visible:ring-opacity-75',
                {
                  'rounded-b-lg': !open,
                  'rounded-b-none': open,
                }
              )}
            >
              <span className={'font-semibold uppercase'}>{title}</span>
              <span
                className={clsx('mr-5', {
                  'rotate-180 transform': !open,
                  'rotate-0 transform': open,
                })}
              >
                <ArrowSvg />
              </span>
            </Disclosure.Button>
            <>
              <Transition
           enter="transition-opacity duration-100"
           enterFrom="opacity-0"
           enterTo="opacity-100"
           leave="transition-opacity duration-100"
           leaveFrom="opacity-100"
           leaveTo="opacity-0"
                unmount={false}
              >
                <Disclosure.Panel
                  className={'rounded-b-lg bg-white border px-6 pb-8 pt-2 text-sm text-gray-500'}
                >
                  {children}
                </Disclosure.Panel>
              </Transition>
            </>
          </>
        )}
      </Disclosure>
    </>
  );
};

export const Button = ({
  title,
  isColorPicker,
  color,
  active,
  onClick,
  resettable,
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'mr-2 flex items-center rounded-lg bg-[#2F566A] px-2 py-3 text-white transition-all duration-300 ease-in-out',
        {
          'bg-blue-light': active && !isColorPicker,
          'opacity-50': !active && !isColorPicker,
          'h-7 w-7 rounded-full': isColorPicker,
          'text-white': isColorPicker && color !== '#FFFFFF',
          'text-black': isColorPicker && active && color === '#FFFFFF',
        }
      )}
      onClick={onClick}
      style={{
        ...(isColorPicker && {
          backgroundColor: color,
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }),
      }}
      aria-label={title}
      aria-pressed={active}
      {...(isColorPicker && {
        title: title,
      })}
    >
      {!isColorPicker && title}
      {resettable && !active && (
        <span
          className={clsx('w-full', {
            'text-black': isColorPicker && color === '#FFFFFF',
          })}
        >
          <ResetSvg />
        </span>
      )}

      <motion.span
        animate={
          active && isColorPicker
            ? {
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 1],
                width: ['100%', '100%', '100%'],
              }
            : {
                scale: [1, 0.8, 0],
                opacity: [1, 1, 0],
                width: ['100%', '100%', '0%'],
              }
        }
        transition={{
          duration: 0.3,
        }}
        className={clsx('w-full', {
          'text-black': isColorPicker && color === '#FFFFFF',
          // prevents the checkmark from being visible when active is false
          'text-transparent': !active,
        })}
      >
        {<CheckMarkSvg />}
      </motion.span>
    </button>
  );
};

export default Details;
