'use client';
import { useState } from 'react';
import { Select, Text } from 'rizzui';
import { PiCheckCircleBold, PiClockBold } from 'react-icons/pi';

interface RoleSelectProps {
  label?: string;
  placeholder?: string;
  options: { id: string; name: string }[];
  selectItem?: string;
  field: {
    value: string | undefined; 
    onChange: (value: string) => void;
  };
  error?: string;
  optionId?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

function RoleSelect({ label, placeholder = "Select Role", optionId, options, selectItem, field, error }: RoleSelectProps) {
  // const selectItemValue = options.find((option) => option.name === selectItem);
  // const [value, setValue] = useState(selectItemValue);
  const staticOptions = [
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
      {label && (
        <label className="block text-sm mb-1.5">
          {label}
        </label>
      )}
      <Select
        dropdownClassName="!z-10"
        className="min-w-[140px]"
        selectClassName="hover:border-primary hover:ring-primary focus:border-primary focus:ring-primary"
        inPortal={false}
        placeholder={placeholder}
        options={selectOptions}
        value={selectOptions.find(option => option.value === field.value) || null}
        onChange={(value: SelectOption | null) => {
          if (value) {
            field.onChange(value.value);
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
