'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import cn from '@utils/class-names';
import { Button } from 'rizzui';

interface ActionButtonProps {
  text: string;
  icon?: StaticImageData | string;
  iconHover?: StaticImageData | string;
  onClick?: () => void;
  type?: "button" | "submit";
  buttonClassName?: string;
  textClassName?: string; 
  imageClassName?: string; 
  imageHoverClassName?: string; 
  disabled?: boolean;
}

const ActionButton = ({ text, icon, iconHover, onClick, type = "button", buttonClassName = "bg-[#FFFFFF] border-solid border-[1px] border-[#707070] hover:bg-[#272c34] hover:border-[#272c34]",
  textClassName= "text-[#333333] ", imageClassName= "hidden", imageHoverClassName= "hidden", disabled=false }:ActionButtonProps) => (
  <>
  {type == 'button'?
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-3 group md:px-4 text-[10px] md:text-xs font-medium text-center inline-flex justify-center items-center md:gap-2 rounded cursor-pointer group h-8",
        buttonClassName
      )}
    >
      {icon && (
        <>
          <Image className={cn("w-4 h-4 md:block md:group-hover:hidden", imageClassName)} src={icon} alt="Icon" width={16} height={16} />
          <Image className={cn("w-4 h-4 md:hidden md:group-hover:block", imageHoverClassName)} src={iconHover? iconHover : icon} alt="Icon Hover" width={16} height={16} />
        </>
      )}
      <span className={cn("group-hover:text-white text-xs md:text-sm", textClassName)}>{text}</span>
    </button>
    :
      <Button
        type={type}
        onClick={onClick}
        disabled={disabled}
        isLoading={disabled}
        className={cn(
          "px-3 group md:px-4 text-[10px] md:text-xs font-medium text-center inline-flex justify-center items-center md:gap-2 rounded cursor-pointer group h-8",
          buttonClassName
        )}
      >
        {icon && (
          <>
            <Image className={cn("w-4 h-4 md:block md:group-hover:hidden", imageClassName)} src={icon} alt="Icon" width={16} height={16} />
            <Image className={cn("w-4 h-4 md:hidden md:group-hover:block", imageHoverClassName)} src={iconHover? iconHover : icon} alt="Icon Hover" width={16} height={16} />
          </>
        )}
        <span className={cn("group-hover:text-white text-xs md:text-sm", textClassName)}>{text}</span>
      </Button>
      }
  </>
);

export default ActionButton;