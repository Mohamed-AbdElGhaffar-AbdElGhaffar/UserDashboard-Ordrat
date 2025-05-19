import { useFormContext } from 'react-hook-form';
import { Input } from 'rizzui';
import cn from '@utils/class-names';
import FormGroup from '@/app/shared/form-group';

export default function ProductSeo({ className, lang='en' }: { className?: string; lang?: string; }) {
  const text = {
    sectionTitle: lang === 'ar' ? "تحسين محركات البحث" : "Search Engine Optimization",
    sectionDescription: lang === 'ar' ? "أضف معلومات تحسين محركات البحث لمنتجك هنا" : "Add your product's SEO info here",
    pageTitleEn: lang === 'ar' ? "عنوان صفحة المنتج (بالإنجليزية)" : "Page Title (English)",
    pageTitleAr: lang === 'ar' ? "عنوان صفحة المنتج (بالعربية)" : "Page Title (Arabic)",
    metaDescriptionEn: lang === 'ar' ? "وصف صفحة المنتج (بالإنجليزية)" : "Meta Description (English)",
    metaDescriptionAr: lang === 'ar' ? "وصف صفحة المنتج (بالعربية)" : "Meta Description (Arabic)",
  };

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup
      title={text.sectionTitle}
      description={text.sectionDescription}
      className={cn(className)}
    >
      <Input
        label={text.pageTitleEn}
        placeholder={text.pageTitleEn}
        {...register('pageTitleEn')}
        error={errors.pageTitleEn?.message as string}
      />
      <Input
        label={text.pageTitleAr}
        placeholder={text.pageTitleAr}
        {...register('pageTitleAr')}
        error={errors.pageTitleAr?.message as string}
      />
      <Input
        label={text.metaDescriptionEn}
        placeholder={text.pageTitleEn}
        {...register('metaDescriptionEn')}
        error={errors.metaDescriptionEn?.message as string}
      />
      <Input
        label={text.metaDescriptionAr}
        placeholder={text.metaDescriptionAr}
        {...register('metaDescriptionAr')}
        error={errors.metaDescriptionAr?.message as string}
      />
    </FormGroup>
  );
}
