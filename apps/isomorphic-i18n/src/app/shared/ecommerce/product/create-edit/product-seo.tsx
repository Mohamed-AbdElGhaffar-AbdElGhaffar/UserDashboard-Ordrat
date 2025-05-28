import { useFormContext, useWatch } from 'react-hook-form';
import { Button, Input } from 'rizzui';
import cn from '@utils/class-names';
import FormGroup from '@/app/shared/form-group';
import { useTranslation } from '@/app/i18n/client';
import { useEffect, useState } from 'react';

export default function ProductSeo({ className, lang='en', languages, subdomainName }: { className?: string; lang?: string; languages?: number; subdomainName?: string; }) {
  const { t } = useTranslation(lang!, 'form');
  const text = {
    sectionTitle: lang === 'ar' ? "تحسين محركات البحث" : "Search Engine Optimization",
    sectionDescription: lang === 'ar' ? "أضف معلومات تحسين محركات البحث لمنتجك هنا" : "Add your product's SEO info here",
    pageTitleEn: lang === 'ar' ? "عنوان صفحة المنتج (بالإنجليزية)" : "Page Title (English)",
    pageTitleAr: lang === 'ar' ? "عنوان صفحة المنتج (بالعربية)" : "Page Title (Arabic)",
    metaDescriptionEn: lang === 'ar' ? "وصف صفحة المنتج (بالإنجليزية)" : "Meta Description (English)",
    metaDescriptionAr: lang === 'ar' ? "وصف صفحة المنتج (بالعربية)" : "Meta Description (Arabic)",
    slugEn: lang === 'ar' ? "رابط المنتج (بالإنجليزية)" : "Product Link (English)",
    slugAr: lang === 'ar' ? "رابط المنتج (بالعربية)" : "Product Link (Arabic)",

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

  
  const formatSlug = (text: string) => {
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    return text ? `${randomNumber}-${text.trim().replace(/\s+/g, '-')}` : '';
  };
  // Auto update SEO fields from product data only in auto mode
  // useEffect(() => {
  //   const isAllEqual =
  //     titleEn === pageTitleEn &&
  //     titleAr === pageTitleAr &&
  //     descriptionEn === metaDescriptionEn &&
  //     descriptionAr === metaDescriptionAr;
      
  //   console.log("isAllEqual= ",isAllEqual);
  //   console.log("descriptionEn= ",descriptionEn);
  //   console.log("metaDescriptionEn= ",metaDescriptionEn);
    
  //   // setManualMode(!isAllEqual);
  
  //   if (!manualMode) {
  //     setValue('pageTitleEn', titleEn || '');
  //     setValue('pageTitleAr', titleAr || '');
  //     setValue('metaDescriptionEn', descriptionEn || '');
  //     setValue('metaDescriptionAr', descriptionAr || '');
  //     setValue('slugEn', formatSlug(titleEn));
  //     setValue('slugAr', formatSlug(titleAr));
  //   }
  // }, [
  //   titleEn,
  //   titleAr,
  //   descriptionEn,
  //   descriptionAr,
  //   pageTitleEn,
  //   pageTitleAr,
  //   metaDescriptionEn,
  //   metaDescriptionAr,
  //   setValue,
  //   lang
  // ]); 
  useEffect(() => {
    if (!manualMode) {
      setValue('pageTitleEn', titleEn || '');
      setValue('pageTitleAr', titleAr || '');
      setValue('metaDescriptionEn', descriptionEn || '');
      setValue('metaDescriptionAr', descriptionAr || '');
      setValue('slugEn', formatSlug(titleEn));
      setValue('slugAr', formatSlug(titleAr));
    }
  }, [
    titleEn,
    titleAr,
    descriptionEn,
    descriptionAr,
    manualMode,
    setValue,
  ]); 

  useEffect(() => {
    if (languages === 0) {
      setValue('pageTitleEn', 'no data');
      setValue('metaDescriptionEn', 'no data');
      setValue('slugEn', 'no data');
    } else if (languages === 1) {
      setValue('pageTitleAr', 'no data');
      setValue('metaDescriptionAr', 'no data');
      setValue('slugAr', 'no data');
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
      setValue('slugEn', formatSlug(titleEn));
      setValue('slugAr', formatSlug(titleAr));
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
              placeholder={text.metaDescriptionEn}
              {...register('metaDescriptionEn')}
              error={t(errors.metaDescriptionEn?.message as string)}
            />
          )}
          {languages!=1 &&(
            <Input
              label={text.slugAr}
              placeholder={text.slugAr}
              prefix={`${subdomainName}.ordrat.com/`}
              inputClassName='ltr seoInputLTR'
              prefixClassName=''
              {...register('slugAr')}
              error={t(errors.slugAr?.message as string)}
            />
          )}
          {languages!=0 &&(
            <Input
              label={text.slugEn}
              placeholder={text.slugEn}
              prefix={`${subdomainName}.ordrat.com/`}
              inputClassName='ltr seoInputLTR'
              prefixClassName=''
              {...register('slugEn')}
              error={t(errors.slugEn?.message as string)}
            />
          )}
        </>
      )}
    </FormGroup>
  );
}
