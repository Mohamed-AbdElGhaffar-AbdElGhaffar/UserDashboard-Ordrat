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

type DateDurationPickerProps = {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  lable: string;
  lang: string;
};

export function DateDurationPicker({ selectedDate, onChange, lang, lable }: DateDurationPickerProps) {

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
              <ClockIcon className="me-2 h-5 w-5" />
              {selectedDate ? (
                format(selectedDate, "HH:mm:ss", { locale: getLocale() })
              ) : (
                <span>{lang === 'ar' ? `اختر ${lable?lable:'موعدًا'}` : `Pick a ${lable?lable:'date'}`}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[1000000] bg-white rounded-lg shadow-md border">
            <div className="p-4">
              <div className="px-3 flex flex-col justify-center gap-4">
                <TimePickerDemo
                  setDate={(date) => handleDateChange(date ?? null)}
                  date={selectedDate ?? undefined}
                  lang={lang}
                  lable={lang === 'ar' ? `اختر ${lable?lable:'موعدًا'}:` : `Pick a ${lable?lable:'date'}:`}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
    </div>
  );
}
