'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { AdvancedRadio, FieldError, RadioGroup } from 'rizzui';
import cn from '@utils/class-names';
import { useTranslation } from '@/app/i18n/client';
import { useEffect } from 'react';

type Option = {
  label: string | JSX.Element;
  value: number | string;
};

interface GetRadioProps {
  name: string;
  options: Option[];
  lang?: string;
}

export default function GetRadio({ name, options, lang='en' }: GetRadioProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { t, i18n } = useTranslation(lang!, 'form');
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, ref } }) => {
          return (
            <RadioGroup
              value={value}
              setValue={onChange}
              className="flex flex-wrap items-center gap-4"
            >
              {options.map((option) => (
                <AdvancedRadio
                  key={option.value}
                  value={option.value}
                  contentClassName={cn(
                    'px-3 py-2 min-w-[unset] min-h-[unset] flex items-center justify-between content-classname',
                    'hover:border-primary focus:ring-primary peer-checked:border-primary peer-checked:ring-primary',
                    'hover:border-primary focus:ring-primary',
                    String(option.value) === String(value) &&
                      'border-primary ring-primary ring-1'
                  )}
                >
                  {typeof option.label === 'string' ? (
                    option.label
                  ) : (
                    <div className="flex items-center gap-2">
                      {option.label}
                    </div>
                  )}
                </AdvancedRadio>
              ))}
            </RadioGroup>
          );
        }}
      />
      {errors?.[name] && (
        <FieldError
          className="mt-1"
          error={t(errors?.[name]?.message as string)}
        />
      )}
    </>
  );
}
