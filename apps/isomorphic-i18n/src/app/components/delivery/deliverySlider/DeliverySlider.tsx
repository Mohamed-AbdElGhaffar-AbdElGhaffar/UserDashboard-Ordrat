'use client';

import { useState } from 'react';
import Image from 'next/image';
import cn from '@utils/class-names';

interface DeliveryOption {
  id: string;
  name: string;
  value: string;
  icon?: any;
}

interface DeliverySliderProps {
  lang: string;
  options: DeliveryOption[];
  defaultValue?: string;
  onChange: (value: string) => void;
}

export default function DeliverySlider({ lang, options, defaultValue = '', onChange }: DeliverySliderProps) {
  const [selected, setSelected] = useState<string>(defaultValue);

  const handleSelect = (id: string) => {
    setSelected(id);
    onChange(id);
  };

  return (
    <div className="flex w-[480px] items-center gap-2.5 overflow-x-auto pb-[2px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((option) => (
        <label key={option.id} className="cursor-pointer">
          <input
            type="radio"
            name="deliveryMethod"
            value={option.id}
            checked={selected === option.id}
            onChange={() => handleSelect(option.id)}
            className="hidden"
          />
          <div
            className={cn(
              'w-fit py-2 px-4 flex flex-col justify-center items-center rounded-[5px] border-2 transition-all duration-200',
              selected === option.id ? 'border-[#e11d48] bg-[#e11d48] text-white' : 'bg-[#E8E8E8] border-transparent'
            )}
          >
            {option.icon &&(
              <Image src={option.icon} alt={option.name} className="w-[60px]" width={60} height={60} />
            )}
            <p className={`text-md text-center ${option.icon? 'mt-2':''} font-bold`}>{option.name}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
