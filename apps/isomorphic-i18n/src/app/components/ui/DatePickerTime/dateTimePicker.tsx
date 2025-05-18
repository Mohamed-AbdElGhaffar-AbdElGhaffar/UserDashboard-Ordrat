import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import { useState } from "react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Button } from "./button";
import { TimePicker12Demo } from "./time-picker-12hour-demo";
import 'react-datepicker/dist/react-datepicker.css';
type DateTimePickerProps = {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  lable: string;
  lang: string;
};

export function DateTimePicker({ selectedDate, onChange, lang, lable }: DateTimePickerProps) {

  const handleDateChange = (date: Date | Date[] | null) => {
    if (date instanceof Date) {
      onChange(date);
    } else if (Array.isArray(date) && date.length > 0) {
      onChange(date[0]);
    } else {
      onChange(null);
    }
  };

  const getLocale = () => (lang === 'ar' ? ar : enUS);

  return (
    <div className="w-full">
        <label htmlFor="date" className="block text-sm font-medium pb-1">
          {lable}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal border rounded-md px-4 py-2 ${
                !selectedDate ? "text-muted-foreground" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {selectedDate ? (
                format(selectedDate, "PPP hh:mm:ss a", { locale: getLocale() })
              ) : (
                <span>{lang === 'ar' ? 'اختر موعدًا' : 'Pick a date'}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[1000000] bg-white rounded-lg shadow-md border">
            <div className="p-4">
              <Calendar
                onChange={(value) => handleDateChange(value as Date | Date[] | null)}
                value={selectedDate}
                className="custom-calendar"
                locale={lang === 'ar' ? 'ar' : 'en'}
              />
              <style>
                {`.custom-calendar {
                  width: 250px;
                  border: none;
                  box-shadow: none;
                }
                .react-calendar__month-view__days__day--weekend {
                  color: inherit !important;
                }
                .custom-calendar .react-calendar__tile--active {
                  background: #1E40AF;
                  color: white !important;
                  border-radius: 6px;
                }
                .custom-calendar .react-calendar__tile--now {
                  background-color: #e6e6e6 !important;
                  color: #000 !important;
                  border: 1px solid #e6e6e6;
                  border-radius: 6px;
                }
                .react-calendar__tile:enabled:hover{
                  border-radius: 6px;
                }
                `}
              </style>
              <div className="p-3 mt-1 border-t border-border flex justify-center gap-4">
                <TimePicker12Demo
                  setDate={(date) => handleDateChange(date ?? null)}
                  date={selectedDate ?? undefined}
                  lang={lang}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
    </div>
  );
}
