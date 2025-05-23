import { Button } from 'rizzui';
import cn from '../utils/class-names';
import Link from 'next/link';

interface FormFooterProps {
  className?: string;
  altBtnText?: string;
  submitBtnText?: string;
  isLoading?: boolean;
  cancel?: boolean;
  hrefCancel?: string;
  handleAltBtn?: () => void;
}

// export const negMargin = '-mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10';
export const negMargin = 'mx-0';

export default function FormFooter({
  isLoading,
  altBtnText = 'Save as Draft',
  submitBtnText = 'Submit',
  className,
  cancel,
  hrefCancel,
  handleAltBtn,
}: FormFooterProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 left-0 right-0 z-10 flex items-center justify-end gap-4 border-t bg-white px-4 py-4 md:px-5 lg:px-6 3xl:px-8 4xl:px-10 dark:bg-gray-50',
        className,
        negMargin
      )}
    >
      {/* <Button
        variant="outline"
        className="w-full @xl:w-auto"
        onClick={handleAltBtn}
      >
        {altBtnText}
      </Button> */}
      {cancel && hrefCancel &&(
        <Link
          href={hrefCancel}
          className="w-full @xl:w-auto"
        >
          <Button
            variant="outline"
            className="w-full @xl:w-auto"
          >
              {altBtnText}
          </Button>
        </Link>
      )}
      <Button type="submit" isLoading={isLoading} className="w-full @xl:w-auto">
        {submitBtnText}
      </Button>
    </div>
  );
}
