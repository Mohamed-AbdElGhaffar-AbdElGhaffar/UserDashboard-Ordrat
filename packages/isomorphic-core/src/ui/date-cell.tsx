import cn from '../utils/class-names';

interface DateCellProps {
  date: Date;
  lang: string;
  className?: string;
  dateClassName?: string;
  timeClassName?: string;
}

export default function DateCell({
  date,
  lang,
  className,
  dateClassName,
  timeClassName,
}: DateCellProps) {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return <span className="text-red-500 text-sm">Invalid date</span>;
  }
  // Format date based on the language
  const formattedDate = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);

  const formattedTime = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(parsedDate);

  return (
    <div className={cn('grid gap-1', className)}>
      <time dateTime={parsedDate.toISOString()} className={cn('font-medium text-gray-700', dateClassName)}>
        {formattedDate}
      </time>
      <time dateTime={parsedDate.toISOString()} className={cn('text-[13px] text-gray-500', timeClassName)}>
        {formattedTime}
      </time>
    </div>
  );
}
