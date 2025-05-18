'use client';

import dynamic from 'next/dynamic';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Input, Button, ActionIcon, Checkbox, Switch } from 'rizzui';
import cn from '@utils/class-names';
import FormGroup from '@/app/shared/form-group';
import { ChangeEvent, useCallback, useState } from 'react';
import TrashIcon from '@components/icons/trash';
import SelectLoader from '@components/loader/select-loader';
import { PiPlusBold, PiTrashBold, PiUploadSimple } from 'react-icons/pi';
import Image from 'next/image';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});

// Button type options
const buttonTypeOptions = [
  { label: 'Radio', value: 0 },
  { label: 'Dropdown', value: 1 },
  { label: 'Checkbox', value: 2 },
  { label: 'Input', value: 3 },
  { label: 'Phone Number', value: 4 },
  { label: 'Email', value: 5 },
  { label: 'Date', value: 6 },
  { label: 'Image', value: 7 },
];

export default function ProductVariants({ className, lang = 'en' }: { className?: string; lang?: string }) {
  const text = {
    sectionTitle: lang === 'ar' ? "خيارات المتغيرات" : "Variant Options",
    sectionDescription: lang === 'ar' ? "أضف متغيرات المنتج هنا" : "Add your product variants here",
    nameAr: lang === 'ar' ? "اسم المتغير (بالعربية)" : "Variant Name (Arabic)",
    nameEn: lang === 'ar' ? "اسم المتغير (بالإنجليزية)" : "Variant Name (English)",
    buttonType: lang === 'ar' ? "نوع الزر" : "Button Type",
    priority: lang === 'ar' ? "الأولوية" : "Priority",
    isRequired: lang === 'ar' ? "إلزامي؟" : "Required?",
    choicesLabel: lang === 'ar' ? "الخيارات" : "Choices",
    addVariant: lang === 'ar' ? "إضافة متغير" : "Add Variant",
    choiceNameAr: lang === 'ar' ? "اسم الخيار (بالعربية)" : "Choice Name (Arabic)",
    choiceNameEn: lang === 'ar' ? "اسم الخيار (بالإنجليزية)" : "Choice Name (English)",
    choicePrice: lang === 'ar' ? "السعر" : "Price",
    choiceImage: lang === 'ar' ? "رابط الصورة" : "Image URL",
    isDefault: lang === 'ar' ? "اساسي؟" : "Default?",
  };

  const { control, register, getValues, setValue, watch, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productVariants',
  });

  const addVariant = useCallback(() => {
    append({
      nameAr: '',
      nameEn: '',
      buttonType: 0,
      priority: 0,
      isRequired: true,
      choices: [],
    });
  }, [append]);

  return (
    <FormGroup
      title={text.sectionTitle}
      description={text.sectionDescription}
      className={cn(className)}
    >
      {fields.map((item, index) => {
        const buttonType = watch(`productVariants.${index}.buttonType`);
        console.log("buttonType: ",buttonType);
        
        return (
          <div key={item.id} className="col-span-full flex flex-col gap-4 xl:gap-7 border p-4 rounded-md">
            {/* Arabic Name */}
            <Input
              label={text.nameAr}
              placeholder="مثال: اللون"
              {...register(`productVariants.${index}.nameAr`)}
            />

            {/* English Name */}
            <Input
              label={text.nameEn}
              placeholder="Example: Color"
              {...register(`productVariants.${index}.nameEn`)}
            />

            {/* Button Type Selection */}
            <Controller
              name={`productVariants.${index}.buttonType`}
              control={control}
              render={({ field }) => (
                <Select
                  label={text.buttonType}
                  options={buttonTypeOptions}
                  {...field}
                />
              )}
            />

            {/* Priority */}
            <Input
              type="number"
              label={text.priority}
              placeholder="0"
              {...register(`productVariants.${index}.priority`)}
            />

            {/* Is Required */}
            <Controller
              name={`productVariants.${index}.isRequired`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  label={text.isRequired}
                  className="col-span-full"
                  value={value}
                  checked={value}
                  onChange={onChange}
                />
              )}
            />

            {/* Choices (Only for Radio, Dropdown, Checkbox) */}
            {(buttonType?.value === 0 || buttonType?.value === 1 || buttonType?.value === 2) && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-medium">{text.choicesLabel}</h3>
                <ChoicesField control={control} index={index} text={text} register={register} getValues={getValues} setValue={setValue} />
              </div>
            )}

            {/* Remove Variant Button */}
            {fields.length > 1 && (
              <ActionIcon
                onClick={() => remove(index)}
                variant="flat"
                className="mt-2 shrink-0"
              >
                <TrashIcon className="h-4 w-4" />
              </ActionIcon>
            )}
          </div>
        );
      })}

      {/* Add Variant Button */}
      <Button onClick={addVariant} variant="outline" className="col-span-full ml-auto w-auto">
        <PiPlusBold className="me-2 h-4 w-4" /> {text.addVariant}
      </Button>
    </FormGroup>
  );
}

// Component for Managing Choices
function ChoicesField({ control, index, text, register, getValues, setValue }: any) {
  const [images, setImages] = useState<Record<number, File | null>>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: `productVariants.${index}.choices`,
  });
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, choiceIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
        setImages((prevImages) => ({ ...prevImages, [choiceIndex]: file }));

        // Use setValue to register the file properly in the form state
        setValue(`productVariants.${index}.choices.${choiceIndex}.image`, file, {
            shouldValidate: true, // Ensures it triggers validation
            shouldDirty: true,
        });
    }
  };


  const handleRemoveImage = (choiceIndex: number) => {
    setImages((prevImages) => ({ ...prevImages, [choiceIndex]: null }));
    setValue(`productVariants.${index}.choices.${choiceIndex}.image`, undefined, {
        shouldValidate: true,
        shouldDirty: true,
    });
  };

  
  return (
    <div className="flex flex-col gap-4">
      {fields.map((choice, choiceIndex) => {
      console.log("images[choiceIndex]: ",fields,"choiceIndex: ",choiceIndex); // ✅ Now correctly placed inside {}
      const imageChoice = getValues(`productVariants.${index}.choices.${choiceIndex}.image`);
      return (
        <div key={choice.id} className="flex items-center gap-4 border p-2 rounded-md">
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Arabic Name */}

            <Input
              label={text.choiceNameAr}
              placeholder="مثال: أحمر"
              {...register(`productVariants.${index}.choices.${choiceIndex}.nameAr`)}
            />

            {/* English Name */}
            <Input
              label={text.choiceNameEn}
              placeholder="Example: Red"
              {...register(`productVariants.${index}.choices.${choiceIndex}.nameEn`)}
            />

            {/* Price */}
            <Input
              type="number"
              label={text.choicePrice}
              placeholder="0"
              {...register(`productVariants.${index}.choices.${choiceIndex}.price`)}
            />

            {/* Image URL */}
            {/* <Input
              label={text.choiceImage}
              placeholder="https://example.com/image.jpg"
              {...register(`productVariants.${index}.choices.${choiceIndex}.image`)}
            /> */}

            <div className="flex items-end">
              <div className={`${imageChoice? "hidden" : "flex" } w-full flex-col md:flex-row gap-4`}>
                {imageChoice ? (
                  <></>
                ) : (
                  <label className="w-full h-[40px] flex justify-center items-center cursor-pointer bg-gray-100 border border-gray-300 rounded-md px-6 md:px-3 py-2 text-sm">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, choiceIndex)}
                    />
                    <PiUploadSimple className="w-4 h-4 text-gray-600" />
                  </label>
                )}
              </div>
              <div className={`${imageChoice? "flex" : "hidden" } w-full justify-center items-center gap-4`}>
                {imageChoice && (
                  <div
                    className="flex min-h-[58px] w-full items-center rounded-xl border border-muted px-3 dark:border-gray-300"
                  >
                    <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-muted bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
                      {imageChoice instanceof File && imageChoice.type.includes('image') ? (
                        <Image
                          src={URL.createObjectURL(imageChoice)}
                          fill
                          className="object-contain"
                          priority
                          alt={imageChoice.name}
                          sizes="(max-width: 768px) 100vw"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="truncate px-2.5">{imageChoice?.name || 'No file selected'}</div>
                    <ActionIcon
                      onClick={() => handleRemoveImage(choiceIndex)}
                      size="sm"
                      variant="flat"
                      color="danger"
                      className="ms-auto flex-shrink-0 p-0 dark:bg-red-dark/20"
                    >
                      <PiTrashBold className="w-6" />
                    </ActionIcon>
                  </div>
                )}
              </div>
            </div>

            {/* Is Default */}
            <Controller
              name={`productVariants.${index}.choices.${choiceIndex}.isDefault`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Checkbox
                  value={value}
                  checked={value}
                  onChange={onChange}
                  label={text.isDefault}
                  className="col-span-full"
                />
              )}
            />
          </div>

          {/* Remove Choice */}
          <ActionIcon onClick={() => remove(choiceIndex)} variant="flat">
            <TrashIcon className="h-4 w-4" />
          </ActionIcon>
        </div>
      )})}

      <Button onClick={() => append({ nameAr: '', nameEn: '', price: 0, isDefault: false, image: '' })} variant="outline">
        <PiPlusBold className="me-2 h-4 w-4" /> {text.addVariant}
      </Button>
    </div>
  );
}
