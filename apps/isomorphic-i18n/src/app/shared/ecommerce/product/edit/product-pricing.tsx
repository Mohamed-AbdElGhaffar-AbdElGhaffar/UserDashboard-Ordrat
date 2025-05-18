import { useTranslation } from '@/app/i18n/client';
import { useFormContext } from 'react-hook-form';
import { Input } from 'rizzui';

export default function ProductPricing({ lang }:{ lang?:string; }) {
  const text = {
    inputPrice: lang === 'ar' ? "السعر الحالي" : "Price",
    inputOldPrice: lang === 'ar' ? "السعر القديم" : "Old Price",
    currency: lang === 'ar' ? "ج.م" : "EGP",
  };
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { t } = useTranslation(lang!, 'form');

  return (
    <>
      <Input
        label={text.inputPrice}
        placeholder="10"
        {...register('price')}
        error={t(errors.price?.message as string)}
        prefix={text.currency}
        type="number"
      />
      <Input
        label={text.inputOldPrice}
        placeholder="10"
        {...register('oldPrice')}
        error={t(errors.oldPrice?.message as string)}
        prefix={text.currency}
        type="number"
      />
    </>
  );
}
