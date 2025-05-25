'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { Label } from './label';
import { TimePickerInput } from './time-picker-input';

type DurationValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface TimePickerDemoProps {
  duration: DurationValue | undefined;
  setDuration: (duration: DurationValue | undefined) => void;
  lang: string;
  onEnter?: () => void;
}

export function TimePickerDemo({ duration, setDuration, lang, onEnter }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);
  const dayRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!duration) {
      setDuration({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
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

  const update = (key: keyof DurationValue, value: number) => {
    if (!duration) return;
  
    const updated = { ...duration };
  
    switch (key) {
      case 'hours':
        updated.hours = Math.max(0, Math.min(23, updated.hours + value));
        break;
      case 'minutes':
        updated.minutes = Math.max(0, Math.min(59, updated.minutes + value));
        break;
      case 'seconds':
        updated.seconds = Math.max(0, Math.min(59, updated.seconds + value));
        break;
      case 'days':
        updated.days = Math.max(0, updated.days + value);
        break;
    }
  
    setDuration(updated);
  };

  const getDateFromDuration = (duration: DurationValue | undefined): Date => {
    const date = new Date();
    date.setHours(duration?.hours || 0);
    date.setMinutes(duration?.minutes || 0);
    date.setSeconds(duration?.seconds || 0);
    date.setMilliseconds(0);
    return date;
  };

  const handleSetDate = (field: keyof DurationValue) => (date: Date | undefined) => {
    if (!duration || !date) return;
  
    const updated = { ...duration };
  
    switch (field) {
      case 'hours':
        updated.hours = date.getHours();
        break;
      case 'minutes':
        updated.minutes = date.getMinutes();
        break;
      case 'seconds':
        updated.seconds = date.getSeconds();
        break;
    }
  
    setDuration(updated);
  };  
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <p className="font-medium text-base flex items-center gap-1">
          {lang === 'ar' ? 'حدد مدة التوصيل' : 'Specify the delivery period'}
          <Clock className="ms-2 h-4 w-4" />
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
      <div className="flex items-end gap-2">
        {/* Days */}
        <div className="flex flex-col items-center gap-1 w-16">
          <Label htmlFor="days" className="text-xs">
            {lang === 'ar' ? 'الأيام' : 'Days'}
          </Label>
          <button
            type="button"
            onClick={() => update('days', 1)}
            className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
          <TimePickerInput
            picker="days"
            date={new Date()}
            setDate={() => {}}
            ref={dayRef}
            value={duration?.days.toString().padStart(2, '0')}
            onChange={() => {}}
            className="text-center w-full focus:ring-red-500 focus:border-red-500"
            onRightFocus={() => hourRef.current?.focus()}
          />
          <button
            type="button"
            onClick={() => update('days', -1)}
            className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center gap-1 w-16">
          <Label htmlFor="hours" className="text-xs">
            {lang === 'ar' ? 'الساعات' : 'Hours'}
          </Label>
          <button
            type="button"
            onClick={() => update('hours', 1)}
            className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
          >
            +
          </button>

          <TimePickerInput
            picker="hours"
            date={getDateFromDuration(duration)}
            setDate={handleSetDate('hours')}
            ref={hourRef}
            value={duration?.hours.toString().padStart(2, '0')}
            onChange={() => {}}
            className="text-center w-full focus:ring-red-500 focus:border-red-500"
            onLeftFocus={() => dayRef.current?.focus()}
            onRightFocus={() => minuteRef.current?.focus()}
          />

          <button
            type="button"
            onClick={() => update('hours', -1)}
            className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
          >
            -
          </button>
        </div>


        {/* Minutes */}
        <div className="flex flex-col items-center gap-1 w-16">
          <Label htmlFor="minutes" className="text-xs">
            {lang === 'ar' ? 'الدقائق' : 'Minutes'}
          </Label>
          <button
            type="button"
            onClick={() => update('minutes', 1)} 
            className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
          >
            +
          </button>
          <TimePickerInput
            picker="minutes"
            date={getDateFromDuration(duration)}
            setDate={handleSetDate('minutes')}
            ref={minuteRef}
            value={duration?.minutes.toString().padStart(2, '0')}
            onChange={() => {}}
            className="text-center w-full focus:ring-red-500 focus:border-red-500"
            onLeftFocus={() => hourRef.current?.focus()}
            onRightFocus={() => secondRef.current?.focus()}
          />
          <button
            type="button"
            onClick={() => update('minutes', -1)}
            className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
          >
            -
          </button>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center gap-1 w-16">
          <Label htmlFor="seconds" className="text-xs">
            {lang === 'ar' ? 'الثواني' : 'Seconds'}
          </Label>
          <button
            type="button"
            onClick={() => update('seconds', 1)}
            className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
          >
            +
          </button>
          <TimePickerInput
            picker="seconds"
            date={getDateFromDuration(duration)}
            setDate={handleSetDate('seconds')}
            ref={secondRef}
            value={duration?.seconds.toString().padStart(2, '0')}
            onChange={() => {}}
            className="text-center w-full focus:ring-red-500 focus:border-red-500"
            onLeftFocus={() => minuteRef.current?.focus()}
          />
          <button
            type="button"
            onClick={() => update('seconds', -1)}
            className="w-full text-xs py-1 bg-gray-200 rounded hover:bg-gray-300 active:bg-gray-400"
          >
            -
          </button>
        </div>


      </div>
    </div>
  );
}