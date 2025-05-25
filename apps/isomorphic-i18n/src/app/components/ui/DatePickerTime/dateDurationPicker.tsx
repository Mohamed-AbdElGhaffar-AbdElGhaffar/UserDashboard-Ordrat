'use client'
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Clock as ClockIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Button } from "./button";
import { TimePickerDemo } from "./time-picker-demo";
import { useState } from "react";

type DurationValue = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type DateDurationPickerProps = {
  selectedDuration: DurationValue | null;
  onChange: (duration: DurationValue | null) => void;
  lable: string;
  lang: string;
};

export function DateDurationPicker({ selectedDuration, onChange, lang, lable }: DateDurationPickerProps) {

  const handleDurationChange = (duration: DurationValue | null) => {
    onChange(duration);
  };

  const getLocale = () => (lang === 'ar' ? ar : enUS);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <label htmlFor="date" className="block text-sm font-medium pb-1">
        {lable}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal border rounded-md px-4 py-2 ${!selectedDuration ? "text-muted-foreground" : ""
              }`}
          >
            <ClockIcon className="me-2 h-5 w-5" />
            {selectedDuration ? (
              <span>
                {selectedDuration.days > 0 && `${selectedDuration.days}d `}
                {selectedDuration.hours.toString().padStart(2, '0')}:
                {selectedDuration.minutes.toString().padStart(2, '0')}:
                {selectedDuration.seconds.toString().padStart(2, '0')}
              </span>
            ) : (
              <span>{lang === 'ar' ? `اختر ${lable ? lable : 'موعدًا'}` : `Pick a ${lable ? lable : 'date'}`}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[1000000] bg-white rounded-lg shadow-md border">
          <div className="p-4">
            <div className=" flex justify-center gap-4">
              <TimePickerDemo
                setDuration={(d) => handleDurationChange(d ?? null)}
                duration={selectedDuration ?? undefined}
                lang={lang}
                onEnter={() => {
                  if (!selectedDuration) {
                    onChange({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                  }                  
                  setIsOpen(false);
                }}
              />

            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}