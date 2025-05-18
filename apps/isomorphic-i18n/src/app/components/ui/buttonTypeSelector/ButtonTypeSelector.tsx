import React from 'react';
import cn from '@utils/class-names';
import { BsTextareaT } from 'react-icons/bs';
import { MdOutlineKeyboardArrowDown, MdOutlineRadioButtonChecked, MdCheckBox } from 'react-icons/md';
import { FiMail } from 'react-icons/fi';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { CgPhone } from 'react-icons/cg';
import { BiImageAlt } from 'react-icons/bi';

// Type definitions
export interface ButtonTypeOption {
  label: string;
  value: number;
}

interface ButtonTypeInfo {
  icon: React.ReactNode;
  description: string;
  descriptionEn: string;
  example: React.ReactNode;
}

interface ButtonTypeSelectorProps {
  label?: string;
  options: ButtonTypeOption[];
  value?: ButtonTypeOption;
  onChange: (option: ButtonTypeOption) => void;
  className?: string;
  lang?: string;
}

// A custom selector component that displays button types as cards in a grid
const ButtonTypeSelector: React.FC<ButtonTypeSelectorProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  className, 
  lang = 'en', 
}) => {
  // Map button type values to their icons and descriptions
  const buttonTypeInfo: Record<number, ButtonTypeInfo> = {
    0: { // Radio
      icon: <MdOutlineRadioButtonChecked className="h-5 w-5" />,
      description: "اختيار خيار واحد من عدة خيارات",
      descriptionEn: "Select one option from multiple choices",
      example: (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-primary bg-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <span className="text-xs">{lang=='ar'?'خيار 1' : 'choice 1'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full border border-gray-300"></div>
            <span className="text-xs">{lang=='ar'?'خيار 2' : 'choice 2'}</span>
          </div>
        </div>
      )
    },
    1: { // Dropdown
      icon: <MdOutlineKeyboardArrowDown className="h-5 w-5" />,
      description: "قائمة منسدلة للاختيار من عدة خيارات",
      descriptionEn: "Dropdown list for selecting from multiple options",
      example: (
        <div className="w-full rounded border border-gray-300 px-2 py-1 text-xs flex justify-between items-center">
          <span>{lang=='ar'?'اختر خيارًا':'Select Option'}</span>
          <span className="border-4 border-transparent border-t-gray-400 h-0 w-0"></span>
        </div>
      )
    },
    // 2: { // Checkbox
    //   icon: <MdCheckBox className="h-5 w-5" />,
    //   description: "اختيار متعدد من خيارات متعددة",
    //   descriptionEn: "Select multiple options from multiple choices",
    //   example: (
    //     <div className="flex flex-col gap-1">
    //       <div className="flex items-center gap-1.5">
    //         <div className="w-3.5 h-3.5 rounded-sm bg-primary flex items-center justify-center">
    //           <div className="w-2 h-1 border-l border-b border-white rotate-[-45deg] translate-y-[-1px]"></div>
    //         </div>
    //         <span className="text-xs">{lang=='ar'?'خيار 1' : 'choice 1'}</span>
    //       </div>
    //       <div className="flex items-center gap-1.5">
    //         <div className="w-3.5 h-3.5 rounded-sm border border-gray-300"></div>
    //         <span className="text-xs">{lang=='ar'?'خيار 2' : 'choice 2'}</span>
    //       </div>
    //     </div>
    //   )
    // },
    3: { // Input
      icon: <BsTextareaT className="h-5 w-5" />,
      description: "إدخال نص",
      descriptionEn: "Text Input",
      example: (
        <div className="w-full rounded border border-gray-300 px-2 py-1 text-xs">
          <span className="text-gray-400">{lang=='ar'? 'أدخل نصًا...' : 'Enter text...'}</span>
        </div>
      )
    },
    4: { // Phone Number
      icon: <CgPhone className="h-5 w-5" />,
      description: "إدخال رقم هاتف",
      descriptionEn: "Phone number input",
      example: (
        <div className="flex text-xs gap-1">
          <div className="bg-gray-100 rounded-l border border-gray-300 px-1.5 py-1">+20</div>
          <div className="rounded-s border border-gray-300 px-1.5 py-1 flex-1 text-gray-400">1XXXXXXXXX</div>
        </div>
      )
    },
    5: { // Email
      icon: <FiMail className="h-5 w-5" />,
      description: "إدخال بريد إلكتروني",
      descriptionEn: "Email address input",
      example: (
        <div className="w-full rounded border border-gray-300 px-2 py-1 text-xs text-gray-400">
          example@email.com
        </div>
      )
    },
    // 6: { // Date
    //   icon: <FaRegCalendarAlt className="h-5 w-5" />,
    //   description: "اختيار تاريخ",
    //   descriptionEn: "Date selection",
    //   example: (
    //     <div className="w-full rounded border border-gray-300 px-2 py-1 text-xs text-gray-400">
    //       YYYY/MM/DD
    //     </div>
    //   )
    // },
    // 7: { // Image
    //   icon: <BiImageAlt className="h-5 w-5" />,
    //   description: "تحميل صورة",
    //   descriptionEn: "Image upload",
    //   example: (
    //     <div className="flex items-center gap-1.5">
    //       <div className="w-8 h-8 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
    //         <BiImageAlt className="h-4 w-4 text-gray-500" />
    //       </div>
    //       <div className="text-xs bg-gray-100 rounded border border-gray-300 px-2 py-1">
    //         {lang=='ar'? 'ارفع صورة' : 'Upload Image'}
    //       </div>
    //     </div>
    //   )
    // }
  };

  const handleSelect = (option: ButtonTypeOption): void => {
    onChange(option);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 4xl:grid-cols-4 gap-3 mt-2">
        {options.map((option) => {
          const isSelected = value?.value === option.value;
          const info = buttonTypeInfo[option.value];
          
          return (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={cn(
                "border-2 rounded-lg p-3 cursor-pointer transition-all relative",
                "hover:border-gray-400 hover:shadow-md hover:translate-y-[-2px]",
                isSelected 
                  ? "border-primary bg-primary/10" 
                  : "border-gray-200 bg-white"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 end-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-1 border-l border-b border-white rotate-[-45deg] translate-y-[-1px]"></div>
                </div>
              )}
              
              <div className="flex items-start mb-2">
                <h3 className="text-base font-medium text-gray-900">
                  {option.label}
                </h3>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 rtl:text-right">
                {lang == 'ar'? info?.description : info?.descriptionEn}
              </p>
              
              <div className="bg-gray-50 p-2 rounded mt-2">
                {info?.example}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonTypeSelector;