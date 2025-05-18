import React, { Component } from 'react'
import { Input } from 'rizzui'
// import {
//     MagnifyingGlassIcon,
//     ArrowRightIcon,
//     CurrencyDollarIcon,
//   } from "@heroicons/react/24/outline";
type InputProps = {
    name?: string;
    value?: any,
    id?: string;
    type?: string | any;
    inputClassName?: string;
    className?: string;
    placeholder?: string;
    labelClassName?: string;
    label?: string;
    onChange?: any;
    onBlur?: any;
    error?: any;
    disabled?: boolean;
    readOnly?: boolean;
    prefix?: any; 
}

function CustomInput({ name,error, disabled =false , readOnly=false,labelClassName,type, id, label, onBlur,prefix, inputClassName, value, placeholder, onChange, className }: InputProps) {
    return (
        <Input
            label={label}
            id={id}
            labelClassName={labelClassName}
            min={0}
            prefix={prefix} 
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={onChange}
            readOnly={readOnly}
            onBlur={onBlur}
            className={className}
            inputClassName={inputClassName}
            error={error}
        />
    )
}

export default CustomInput