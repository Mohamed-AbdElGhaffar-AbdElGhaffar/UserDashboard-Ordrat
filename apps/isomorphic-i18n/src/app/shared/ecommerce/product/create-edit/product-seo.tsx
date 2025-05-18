import { useFormContext, useWatch } from 'react-hook-form';
import { Button, Input } from 'rizzui';
import cn from '@utils/class-names';
import FormGroup from '@/app/shared/form-group';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';

export default function ProductSeo({ className, lang='en', languages }: { className?: string; lang?: string; languages?: number; }) {
  const { t } = useTranslation(lang!, 'form');
  const text = {
    sectionTitle: lang === 'ar' ? "تحسين محركات البحث" : "Search Engine Optimization",
    sectionDescription: lang === 'ar' ? "أضف معلومات تحسين محركات البحث لمنتجك هنا" : "Add your product's SEO info here",
    pageTitleEn: lang === 'ar' ? "عنوان الصفحة (بالإنجليزية)" : "Page Title (English)",
    pageTitleAr: lang === 'ar' ? "عنوان الصفحة (بالعربية)" : "Page Title (Arabic)",
    metaDescriptionEn: lang === 'ar' ? "وصف الميتا (بالإنجليزية)" : "Meta Description (English)",
    metaDescriptionAr: lang === 'ar' ? "وصف الميتا (بالعربية)" : "Meta Description (Arabic)",

    manualSeo: lang === 'ar' ? 'تحرير يدوي' : 'Manual SEO',
    autoSeo: lang === 'ar' ? 'تحسين تلقائي' : 'Automatic SEO',
  };

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [manualMode, setManualMode] = useState(false);

  const titleEn = useWatch({ name: 'titleEn' });
  const titleAr = useWatch({ name: 'titleAr' });
  const descriptionEn = useWatch({ name: 'descriptionEn' });
  const descriptionAr = useWatch({ name: 'descriptionAr' });

  const pageTitleEn = useWatch({ name: 'pageTitleEn' });
  const pageTitleAr = useWatch({ name: 'pageTitleAr' });
  const metaDescriptionEn = useWatch({ name: 'metaDescriptionEn' });
  const metaDescriptionAr = useWatch({ name: 'metaDescriptionAr' });


  // Auto update SEO fields from product data only in auto mode
  useEffect(() => {
    const isAllEqual =
      titleEn === pageTitleEn &&
      titleAr === pageTitleAr &&
      descriptionEn === metaDescriptionEn &&
      descriptionAr === metaDescriptionAr;
      
    console.log("isAllEqual= ",isAllEqual);
    console.log("descriptionEn= ",descriptionEn);
    console.log("metaDescriptionEn= ",metaDescriptionEn);
    
    setManualMode(!isAllEqual);
  
    if (isAllEqual) {
      setValue('pageTitleEn', titleEn || '');
      setValue('pageTitleAr', titleAr || '');
      setValue('metaDescriptionEn', descriptionEn || '');
      setValue('metaDescriptionAr', descriptionAr || '');
    }
  }, [
    titleEn,
    titleAr,
    descriptionEn,
    descriptionAr,
    pageTitleEn,
    pageTitleAr,
    metaDescriptionEn,
    metaDescriptionAr,
    setValue,
    lang
  ]);  

  useEffect(() => {
    if (languages === 0) {
      setValue('pageTitleEn', 'no data');
      setValue('metaDescriptionEn', 'no data');
    } else if (languages === 1) {
      setValue('pageTitleAr', 'no data');
      setValue('metaDescriptionAr', 'no data');
    }
  }, [languages]);

  const toggleManualMode = () => {
    const newManualMode = !manualMode;
    setManualMode(newManualMode);
  
    if (!newManualMode) {
      // Auto-sync again when going back to auto
      setValue('pageTitleEn', titleEn || '');
      setValue('pageTitleAr', titleAr || '');
      setValue('metaDescriptionEn', descriptionEn || '');
      setValue('metaDescriptionAr', descriptionAr || '');
    }
  };
  
  const badgeTitle = manualMode ? text.manualSeo : text.autoSeo;
  return (
    <FormGroup
      title={text.sectionTitle}
      description={text.sectionDescription}
      badge={{ title: badgeTitle, status: 'danger' }}
      className={cn(className)}
    >
      <Button variant="outline" className="col-span-full w-fit" onClick={toggleManualMode}>
        {manualMode ? text.autoSeo : text.manualSeo}
      </Button>
      {manualMode && (
        <>
          {languages!=1 &&(
            <Input
              label={text.pageTitleAr}
              placeholder={text.pageTitleAr}
              {...register('pageTitleAr')}
              error={t(errors.pageTitleAr?.message as string)}
            />
          )}
          {languages!=0 &&(
            <Input
              label={text.pageTitleEn}
              placeholder={text.pageTitleEn}
              {...register('pageTitleEn')}
              error={t(errors.pageTitleEn?.message as string)}
            />
          )}
          {languages!=1 &&(
            <Input
              label={text.metaDescriptionAr}
              placeholder={text.metaDescriptionAr}
              {...register('metaDescriptionAr')}
              error={t(errors.metaDescriptionAr?.message as string)}
            />
          )}
          {languages!=0 &&(
            <Input
              label={text.metaDescriptionEn}
              placeholder={text.pageTitleEn}
              {...register('metaDescriptionEn')}
              error={t(errors.metaDescriptionEn?.message as string)}
            />
          )}
        </>
      )}
    </FormGroup>
  );
}
