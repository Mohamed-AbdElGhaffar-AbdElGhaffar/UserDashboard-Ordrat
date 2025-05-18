'use client';
import { useState } from 'react';
import { Select, Text } from 'rizzui';
import { PiCheckCircleBold, PiClockBold } from 'react-icons/pi';

interface RoleSelectProps {
  placeholder?: string;
  options: { id: string; name: string }[];
  selectItem?: string;
  selectValue: string | undefined; 
  onChange: (value: string) => void;
  error?: string;
  optionId?: boolean;
  lang?: string;
}

interface SelectOption {
  value: string;
  label: string;
}

function RoleSelect({ lang = 'en', placeholder = "Select Role", optionId, options, selectItem, selectValue, onChange, error }: RoleSelectProps) {
  // const selectItemValue = options.find((option) => option.name === selectItem);
  // const [value, setValue] = useState(selectItemValue);
  const staticOptions = lang === 'ar' 
  ? [
      { id: '1', name: 'نشط' },    
      { id: '2', name: 'غير نشط' },
      { id: '3', name: 'قيد الانتظار' }
    ] 
  : [
      { id: '1', name: 'Active' },
      { id: '2', name: 'Inactive' },
      { id: '3', name: 'Pending' }
    ];
  const finalOptions = options && options.length > 0 ? options : staticOptions;
  
  const selectOptions = finalOptions.map(option => ({
    id: option.id,
    value: option.id,
    label: option.name
  }));



  const selectItemValue = selectOptions.find((option) => option.label === selectItem);
  const [value, setValue] = useState(selectItemValue);
  return (
    <div>
      <Select
        dropdownClassName="!z-10"
        className="min-w-[140px]"
        inPortal={false}
        placeholder={placeholder}
        options={selectOptions}
        value={selectOptions.find(option => option.value === selectValue) || null}
        onChange={(value: SelectOption | null) => {
          if (value) {
            onChange(value.value);
          }
        }}
        displayValue={(option: { label: any }) =>
          renderOptionDisplayValue(option.label as string)
        }
        error={error}
      />
    </div>
  );
}

function renderOptionDisplayValue(value: string) {
  switch (value) {
    default:
      return (
        <div className="flex items-center">
          <PiCheckCircleBold className="shrink-0 fill-green text-base" />
          <Text className="ms-1.5 text-sm font-medium capitalize text-gray-700">
            {value}
          </Text>
        </div>
      );
  }
}

export default RoleSelect;
