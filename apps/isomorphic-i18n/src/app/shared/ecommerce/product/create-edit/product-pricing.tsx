import { useTranslation } from '@/app/i18n/client';
import { useEffect } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Input, Select, Switch } from 'rizzui';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'
import Image from 'next/image';

export default function ProductPricing({ lang, currencyAbbreviation }: { lang?: string; currencyAbbreviation?: string; }) {
  const text = {
    inputPrice: lang === 'ar' ? "سعر البيع" : "Selling Price",
    inputOldPrice: lang === 'ar' ? "السعر القديم" : "Old Price",
    BuyingPrice: lang === 'ar' ? "سعر شراء المنتج" : "Buying Price",
    inputDiscount: lang === 'ar' ? "الخصم" : "Discount",
    inputVAT: lang === 'ar' ? "الضريبة" : "VAT",
    inputVATType: lang === 'ar' ? "نوع الضريبة" : "VAT Type",
    IsDiscountActive: lang === 'ar' ? "هل تريد اضافة خصم؟" : "Do you want to add Discount?",
    inputDiscountType: lang === 'ar' ? "نوع الخصم" : "Discount Type",
    placeholderDiscountType: lang === 'ar' ? "اختر نوع الخصم" : "Select Discount Type",
    placeholderVATType: lang === 'ar' ? "اختر نوع الضريبة" : "Select VAT Type",
    currency: lang === 'ar' ? "ج.م" : "EGP",
  };
  const {
    register,
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useFormContext();
  const { t } = useTranslation(lang!, 'form');
  const categoryOption = [
    {
      value: '0',
      label: lang == 'ar' ? 'نسبة مئوية' : 'Percentage',
    },
    {
      value: '1',
      label: lang == 'ar' ? 'سعر ثابت' : 'Fixed Price',
    },
  ];
  const IsDiscountActive = useWatch({ name: 'IsDiscountActive' });
  const DiscountType = useWatch({ name: 'DiscountType' });
  const Discount = useWatch({ name: 'Discount' });
  const watchPrice = useWatch({ name: 'price' });
  // console.log("IsDiscountActive: ",IsDiscountActive);
  useEffect(() => {
    if (!IsDiscountActive && (Discount || DiscountType)) {
      setValue('DiscountType', '', { shouldValidate: true, shouldDirty: true });
      setValue('Discount', null, { shouldValidate: true, shouldDirty: true });
    }
  }, [IsDiscountActive]);
  useEffect(() => {
    if (!IsDiscountActive) return;
  
    if (DiscountType === '0' && Discount > 100) {
      setError('Discount', {
        type: 'manual',
        message: lang === 'ar' ? 'لا يمكن أن يتجاوز الخصم 100%' : 'Discount cannot exceed 100%',
      });
    } else if (DiscountType === '1') {
      const price = Number(watchPrice);
      if (Discount > price) {
        setError('Discount', {
          type: 'manual',
          message: lang === 'ar'
            ? 'الخصم لا يمكن أن يكون أكبر من السعر'
            : 'Discount cannot exceed price',
        });
      } else {
        clearErrors('Discount');
      }
    } else {
      clearErrors('Discount');
    }
  }, [Discount, DiscountType, IsDiscountActive]);
  
  return (
    <>
      <Input
        label={text.inputPrice}
        placeholder="10"
        {...register('price')}
        error={t(errors.price?.message as string)}
        prefix={currencyAbbreviation === 'ر.س' ? (
          <Image src={sarIcon} alt="SAR" width={10} height={10} />
        ) : (
          currencyAbbreviation
        )}
        type="number"
      />
      {/* <Input
        label={text.inputOldPrice}
        placeholder="10"
        {...register('oldPrice')}
        error={t(errors.oldPrice?.message as string)}
        prefix={text.currency}
        type="number"
      /> */}
      <Input
        label={text.BuyingPrice}
        placeholder="10"
        {...register('BuyingPrice')}
        error={t(errors.BuyingPrice?.message as string)}
        prefix={currencyAbbreviation === 'ر.س' ? (
          <Image src={sarIcon} alt="SAR" width={10} height={10} />
        ) : (
          currencyAbbreviation
        )}
        type="number"
      />
      <div className='col-span-full'>
        <div className='flex items-center gap-4'>
          <label className='rizzui-input-label block text-sm font-medium'>
            {text.IsDiscountActive}
          </label>
          <Controller
            name="IsDiscountActive"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch
                // label={text.HasStock}
                className="h-full flex items-center"
                value={value}
                checked={value}
                onChange={onChange}
              />
            )}
          />
        </div>
        {IsDiscountActive && (
          <div className='w-full col-span-full grid gap-4 @2xl:grid-cols-2 @4xl:col-span-8 @4xl:gap-5 xl:gap-7'>
            <div>
              <Controller
                name="DiscountType"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={categoryOption}
                    value={categoryOption.find((option: any) => option.value === value)}
                    onChange={onChange}
                    label={text.inputDiscountType}
                    placeholder={text.placeholderDiscountType}
                    // className="col-span-full"
                    error={t(errors?.DiscountType?.message as string)}
                    getOptionValue={(option) => option.value}
                    inPortal={false}
                  />
                )}
              />
            </div>
            <div>
              <Input
                label={text.inputDiscount}
                placeholder="0"
                {...register('Discount')}
                error={t(errors.Discount?.message as string)}
                type="number"
              />
            </div>
          </div>
        )}
      </div>
      {/* <Controller
        name="VATType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            options={categoryOption}
            value={categoryOption.find((option: any) => option.value === value)}
            onChange={onChange}
            label={text.inputVATType}
            placeholder={text.placeholderVATType}
            // className="col-span-full"
            error={t(errors?.VATType?.message as string)}
            getOptionValue={(option) => option.value}
            inPortal={false}
          />
        )}
      />
      <Input
        label={text.inputVAT}
        placeholder="0"
        {...register('VAT')}
        error={t(errors.VAT?.message as string)}
        type="number"
      /> */}
    </>
  );
}
