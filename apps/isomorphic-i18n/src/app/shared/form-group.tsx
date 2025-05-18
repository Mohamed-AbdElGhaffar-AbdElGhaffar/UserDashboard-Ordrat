import cn from '@utils/class-names';
import DivBadge from '../components/ui/Badge/Badge';

interface FormGroupProps {
  title: React.ReactNode;
  className?: string;
  description?: string;
  badge?: { title: string; status:string; };
  children?: React.ReactNode;
}

export default function FormGroup({
  title,
  className,
  description,
  badge,
  children,
}: FormGroupProps) {
  return (
    <div className={cn('grid gap-5 @3xl:grid-cols-12', className)}>
      <div className="col-span-full @4xl:col-span-4">
        <h4 className="text-base font-medium flex gap-2">
          {title}
          {badge && (
            <DivBadge title={badge.title as string} status={badge.status as string} />
          )}
        </h4>
        {description && <p className="mt-2">{description}</p>}
      </div>
      {children && (
        <div className="col-span-full grid gap-4 @2xl:grid-cols-2 @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
          {children}
        </div>
      )}
    </div>
  );
}
