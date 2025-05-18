import { useFormContext } from 'react-hook-form';
import UploadZone from '@ui/file-upload/upload-zone';
import FormGroup from '@/app/shared/form-group';
import cn from '@utils/class-names';
import { useTranslation } from '@/app/i18n/client';

interface ProductMediaProps {
  className?: string;
  lang?: string;
  languages?: number;
}

export default function ProductMedia({ className, lang, languages }: ProductMediaProps) {
  const text = {
    sectionTitle: lang === 'ar' ? "تحميل صور المنتج الجديدة" : "Upload new product images",
    sectionDescription: lang === 'ar' ? "قم بتحميل معرض صور المنتج هنا" : "Upload your product image gallery here",
  }
  const { getValues, setValue, formState: { errors } } = useFormContext();
  const { t } = useTranslation(lang!, 'form');
  
  return (
    <FormGroup
      title={text.sectionTitle}
      description={text.sectionDescription}
      className={cn(className)}
    >
      <UploadZone
        className="col-span-full" 
        name="productImages"
        getValues={getValues}
        setValue={setValue}
        error={t(errors.productImages?.message as string)}
        lang={lang}
        recommendedDimensions="1000×500"
      />
    </FormGroup>
  );
}
