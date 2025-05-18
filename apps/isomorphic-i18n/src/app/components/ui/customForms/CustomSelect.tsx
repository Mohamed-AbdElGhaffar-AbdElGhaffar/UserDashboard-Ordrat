'use client'
import Select from 'react-select';

type Option = {
  lang?: string;
  value?: any;
  name?: string;
  id: string;
  options?: any;
  placeholder?: string;
  isMulti?: boolean;
  InputClass?: string;
  isDisabled?: boolean;
  onChange?: any;
  onBlur?: any;
  styles
  ?: any;
};

function CustomSelect({
  lang,
  value,
  options,
  isMulti,
  onChange,
  InputClass,
  name,
  isDisabled,
  placeholder,
  onBlur,
  id,
  styles
}: Option) {
  // const customStyles = {
  //   menu: (provided: any) => ({
  //     ...provided,
  //     maxHeight: '100px',
  //     overflowY: 'auto', 

  //   }),
  //   control: (provided: any) => ({
  //     ...provided,
  //     zIndex: 1000,
  //   }),
  // };

  return (
    <Select
      id={id}
      name={name}
      isMulti={isMulti}
      placeholder={placeholder}
      options={options}
      value={value}
      onChange={(value: any) => onChange(value)}
      onBlur={onBlur}
      className={InputClass}
      styles={
        styles
      }
      isDisabled={isDisabled}
    />
  );
}

export default CustomSelect;
