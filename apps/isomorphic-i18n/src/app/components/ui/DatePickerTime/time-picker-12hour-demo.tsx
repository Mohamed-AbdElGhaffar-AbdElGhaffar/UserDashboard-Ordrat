"use client";

import * as React from "react";
import { Label } from "./label";
import { TimePickerInput } from "./time-picker-input";
import { TimePeriodSelect } from "./period-select";
import { Period } from "./time-picker-utils";

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  lang: string;
  onEnter?: () => void;
}

export function TimePicker12Demo({ date, setDate, lang, onEnter }: TimePickerDemoProps) {
  const [period, setPeriod] = React.useState<Period>('AM');

  React.useEffect(() => {
    if (date) {
      setPeriod(date.getHours() >= 12 ? 'PM' : 'AM');
    }
  }, [date]);
  React.useEffect(() => {
    if (!date) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      setDate(now);
    }

  }, []);
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter]);
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <div className="flex flex-col w-60 gap-2">
        <div className="flex justify-between">
          <p className="font-medium text-base flex items-center gap-1">
            {lang === 'ar' ? 'حدد الموعد' : 'Make an appointment'}
          </p>
          <button
            type="button"
            onClick={() => {
              onEnter?.();
            }}
            className="w-14 text-xs py-1 bg-redColor text-white rounded hover:bg-gray-300 active:bg-gray-400"
          >

            {lang === 'ar' ? 'حفظ' : 'save'}

          </button>
        </div>
        {/* <p className="font-medium text-base">{lang==='ar'? 'حدد الموعد':'Make an appointment'}</p> */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col items-center gap-1 w-16">
            <Label htmlFor="hours" className="text-xs">
              {lang === 'ar' ? 'الساعات' : 'Hours'}
            </Label>
            <button
              type="button"
              onClick={() => {
                const newDate = new Date(date ?? 0);
                newDate.setHours(newDate.getHours() + 1);
                setDate(newDate);
              }}
              className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
            >
              +
            </button>
            <TimePickerInput
              picker="12hours"
              period={period}
              date={date}
              setDate={setDate}
              className="text-center w-full focus:ring-red-500 focus:border-red-500"

              ref={hourRef}
              onRightFocus={() => minuteRef.current?.focus()}
            />
            <button
              type="button"
              onClick={() => {
                const newDate = new Date(date ?? 0);
                newDate.setHours(newDate.getHours() - 1);
                setDate(newDate);
              }}
              className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
            >
              -
            </button>
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              {lang === 'ar' ? 'الدقائق' : 'Minutes'}
            </Label>
            <button
              type="button"
              onClick={() => {
                const newDate = new Date(date ?? 0);
                newDate.setMinutes(newDate.getMinutes() + 1);
                setDate(newDate);
              }}
              className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
            >
              +
            </button>
            <TimePickerInput
              picker="minutes"
              id="minutes12"
              date={date}
              setDate={setDate}
              className="text-center w-full focus:ring-red-500 focus:border-red-500"

              ref={minuteRef}
              onLeftFocus={() => hourRef.current?.focus()}
              onRightFocus={() => secondRef.current?.focus()}
            />
            <button
              type="button"
              onClick={() => {
                const newDate = new Date(date ?? 0);
                newDate.setMinutes(newDate.getMinutes() - 1);
                setDate(newDate);
              }}
              className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
            >
              -
            </button>
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="seconds" className="text-xs">
              {lang === 'ar' ? 'الثواني' : 'Seconds'}
            </Label>
            <button
              type="button"
              onClick={() => {
                const newDate = new Date(date ?? 0);
                newDate.setSeconds(newDate.getSeconds() + 1);
                setDate(newDate);
              }}
              className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
            >
              +
            </button>
            <TimePickerInput
              picker="seconds"
              id="seconds12"
              className="text-center w-full focus:ring-red-500 focus:border-red-500"
              date={date}
              setDate={setDate}
              ref={secondRef}
              onLeftFocus={() => minuteRef.current?.focus()}
              onRightFocus={() => periodRef.current?.focus()}
            />
            <button
              type="button"
              onClick={() => {
                const newDate = new Date(date ?? 0);
                newDate.setSeconds(newDate.getSeconds() - 1);
                setDate(newDate);
              }}
              className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
            >
              -
            </button>
          </div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="period" className="text-xs">
              {lang === 'ar' ? 'الفترة الزمنية' : 'Period'}
            </Label>
            <TimePeriodSelect
              period={period}
              setPeriod={setPeriod}
              date={date}
              setDate={setDate}
              ref={periodRef}
              className=" focus:ring-red-500 focus:border-red-500"
              onLeftFocus={() => secondRef.current?.focus()}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </>
  );
}