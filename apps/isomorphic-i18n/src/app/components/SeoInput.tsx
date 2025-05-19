import { useState } from "react";
import { Input } from "rizzui";
import * as Yup from "yup";

type Props = {
    label: string;
    name: string;
    placeholder: string;
    value?: string;
    id: string;

    lang?:string;
    className?:string;
    inputClassName?:string;
    size?: "lg" | "xl" | "sm" | "md";
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
};

export default function SeoInput({ label, size = "lg", id, onBlur, name,lang, placeholder,className, inputClassName,value = "", onChange, error }: Props) {
    const maxLength = 60;
    const extraMinLength = 20;
    const minLength = 40;

    const textLength = value.length;

    let progressColor = "bg-green-500";
    if (textLength > maxLength || textLength < extraMinLength) {
        progressColor = "bg-red-500";
    } else if (textLength < minLength) {
        progressColor = "bg-yellow-500";
    }
    return (
        <div className="w-full">
            <Input
                name={name}
                label={label}
                id={id}
                size={size}
                onBlur={onBlur}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                error={error}
                inputClassName={inputClassName}
                className={className}
            />
            <div className="mt-1 text-sm text-gray-500">
            {lang === 'ar'? 'طول النص':'Text Length'} {textLength} / {maxLength}     {lang === 'ar'? 'حرف':'character'}
            </div>
            <div className="relative w-full h-2 mt-1 bg-gray-300 rounded-md">
                <div
                    className={`absolute top-0 left-0 h-full rounded-md ${progressColor}`}
                    style={{ width: `${Math.min((textLength / maxLength) * 100, 100)}%` }}
                ></div>
            </div>
            {/* {textLength > maxLength && (
                <div className="text-sm text-red-500 mt-1">❌ النص تجاوز الحد الأقصى المسموح به!</div>
            )} */}
        </div>
    );
}