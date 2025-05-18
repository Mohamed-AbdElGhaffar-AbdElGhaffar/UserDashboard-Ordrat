'use client';

import { useEffect, useState } from 'react';
import { Text, Input } from 'rizzui';

type FromToFieldTypes = {
  label?: string;
  toPlaceholder?: string;
  fromPlaceholder?: string;
  value: string[];
  onChange: ([]: string[]) => void;
};

export default function FromToField({
  label = 'Lable',
  toPlaceholder = '0',
  fromPlaceholder = '100',
  value,
  onChange,
}: FromToFieldTypes) {
  const [to, setTo] = useState(value[0] ?? '');
  const [from, setFrom] = useState(value[1] ?? '');

  function handleTo(value: string) {
    setTo(() => value);
    onChange([value, from]);
  }

  function handleFrom(value: string) {
    setFrom(() => value);
    onChange([to, value]);
  }

  useEffect(() => {
    setTo(value[0]);
    setFrom(value[1]);
  }, [value]);

  return (
    <div className="price-field flex items-center">
      <Text
        as="span"
        className="me-2 whitespace-nowrap font-medium text-gray-500"
      >
        {label}
      </Text>
      <div className="flex items-center">
        <Input
          inputClassName="w-24 h-9"
          type="number"
          placeholder={toPlaceholder}
          min={0}
          value={to}
          onChange={(event) => handleTo(event.target.value)}
        />
        <Text as="span" className="mx-1.5 h-0.5 w-3 bg-gray-200" />
        <Input
          min={Number(to)}
          inputClassName="w-24 h-9"
          type="number"
          placeholder={fromPlaceholder}
          value={from}
          onChange={(event) => handleFrom(event.target.value)}
          disabled={to.length > 0 ? false : true}
        />
      </div>
    </div>
  );
}
