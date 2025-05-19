import { useState } from "react";
import { Textarea } from "rizzui";
import * as Yup from "yup";

type Props = {
    label: string;
    name: string;
    lang?:string;
    placeholder: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error: string | undefined;
};

export default function DescTextField({ label, name, placeholder,id, lang,value, onBlur,onChange,error }: Props) {
    const maxLength = 160;
    const minLength = 130;
    const extraMinLength = 50;
    const textLength = value.length;

    let progressColor = "bg-green-500";
    if (textLength > maxLength || textLength < extraMinLength) {
        progressColor = "bg-red-500";
    } else if (textLength < minLength) {
        progressColor = "bg-yellow-500";
    }

    return (
        <div className="w-full">
            <Textarea
                label={label}
                name={name}
                placeholder={placeholder}
                value={value}
                id={id}
                onChange={onChange}
                onBlur={onBlur}
                error={error}

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
       
        </div>
    );
}
