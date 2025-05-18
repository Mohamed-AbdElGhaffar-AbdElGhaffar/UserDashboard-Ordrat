'use client';

import { useEffect, useState } from 'react';
import { Text, Input } from 'rizzui';

type InputFieldTypes = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function InputField({
  value,
  onChange,
  className,
  placeholder
}: InputFieldTypes) {
  const [input, setInput] = useState(value ?? '');

  function handleInput(value: string) {
    setInput(() => value);
    onChange(value);
  }

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <div className={`${className} price-field flex items-center`}>
      <div className={`${className} flex items-center`}>
        <Input
          inputClassName={`${className} h-9`}
          className={className}
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(event) => handleInput(event.target.value)}
        />
      </div>
    </div>
  );
}
