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
import ButtonTypeSelector from '@/app/components/ui/buttonTypeSelector/ButtonTypeSelector';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'
const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => <SelectLoader />,
});

export default function ProductVariants({ className, lang = 'en', languages,currencyAbbreviation }: { className?: string; currencyAbbreviation?: string; lang?: string; languages?: number; }) {
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
    addChoice: lang === 'ar' ? "إضافة اختيار" : "Add Choice",
    choiceNameAr: lang === 'ar' ? "اسم الخيار (بالعربية)" : "Choice Name (Arabic)",
    choiceNameEn: lang === 'ar' ? "اسم الخيار (بالإنجليزية)" : "Choice Name (English)",
    choicePrice: lang === 'ar' ? "السعر" : "Price",
    choiceImage: lang === 'ar' ? "رابط الصورة" : "Image URL",
    isDefault: lang === 'ar' ? "يتم اختيارة تلقائيا ؟" : "Selected Automatically?",
    isActive: lang === 'ar' ? "مفعل؟" : "Active?",

    radio: lang === 'ar' ? 'زر اختيارات' : 'Radio',
    dropdown: lang === 'ar' ? 'قائمة منسدلة' : 'Dropdown',
    input: lang === 'ar' ? 'حقل إدخال' : 'Input',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    email: lang === 'ar' ? 'البريد الإلكتروني' : 'Email',
    checkbox: lang === 'ar' ? 'اختيار متعدد' : 'Checkbox',
    date: lang === 'ar' ? 'التاريخ' : 'Date',
    image: lang === 'ar' ? 'صورة' : 'Image',
  };
  // Button type options
  const buttonTypeOptions = [
    { label: text.radio, value: 0 },
    { label: text.dropdown, value: 1 },
    // { label: text.checkbox, value: 2 },
    { label: text.input, value: 3 },
    { label: text.phone, value: 4 },
    { label: text.email, value: 5 },
    // { label: text.date, value: 6 },
    // { label: text.image, value: 7 },
  ];
  const { control, register, getValues, setValue, watch, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productVariants',
  });
  console.log("productVariants: ",getValues('productVariants'));
  if (languages === 0) {
    setValue('titleEn', 'no data');
    setValue('descriptionEn', 'no data');
  } else if (languages === 1) {
    setValue('titleAr', 'no data');
    setValue('descriptionAr', 'no data');
  }
  const addVariant = useCallback(() => {
    append({
      id: '',
      nameAr: languages === 1 ? 'no data' : '',
      nameEn: languages === 0 ? 'no data' : '',
      buttonType: {
        "label": "Radio",
        "value": 0
      },
      priority: 0,
      isRequired: true,
      isActive: true,
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
        // console.log("buttonType: ",buttonType);
        // console.log("item: ",item);
        
        return (
          <div key={item.id} className="col-span-full flex flex-col gap-4 xl:gap-7 border p-4 rounded-md">
            {/* Arabic Name */}
            {languages!=1 &&(
              <Input
                label={text.nameAr}
                placeholder="مثال: المشروبات الغاذية"
                {...register(`productVariants.${index}.nameAr`)}
              />
            )}
            {/* English Name */}
            {languages!=0 &&(
              <Input
                label={text.nameEn}
                placeholder="Example: Soft Drinks"
                {...register(`productVariants.${index}.nameEn`)}
              />
            )}
            {/* Button Type Selection - Using TypeScript ButtonTypeSelector */}
            <Controller
              name={`productVariants.${index}.buttonType`}
              control={control}
              render={({ field }) => (
                <ButtonTypeSelector
                  label={text.buttonType}
                  options={buttonTypeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  lang={lang}
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
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                {/* Is Required */}
                <Controller
                  name={`productVariants.${index}.isRequired`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      label={text.isRequired}
                      // className="col-span-full"
                      value={value}
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <div>
                {/* Is Active */}
                <Controller
                  name={`productVariants.${index}.isActive`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      label={text.isActive}
                      // className="col-span-full"
                      value={value}
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Choices (Only for Radio, Dropdown, Checkbox) */}
            {(buttonType?.value === 0 || buttonType?.value === 1 || buttonType?.value === 2) && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-medium">{text.choicesLabel}</h3>
                <ChoicesField currencyAbbreviation={currencyAbbreviation} control={control} index={index} text={text} register={register} getValues={getValues} setValue={setValue} languages={languages} />
              </div>
            )}

            {/* Remove Variant Button */}
            {fields.length > 0 && (
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
      <Button onClick={addVariant} variant="outline" className="col-span-full me-auto w-auto">
        <PiPlusBold className="me-2 h-4 w-4" /> {text.addVariant}
      </Button>
    </FormGroup>
  );
}

// Component for Managing Choices
function ChoicesField({ control, index, text, register, getValues, setValue, languages, currencyAbbreviation }: any) {
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
      // console.log("images[choiceIndex]: ",fields,"choiceIndex: ",choiceIndex); // ✅ Now correctly placed inside {}
      const imageChoice = getValues(`productVariants.${index}.choices.${choiceIndex}.image`);
      // console.log("imageChoice: ", imageChoice);
      
      return (
        <div key={choice.id} className="flex items-center gap-4 border p-2 rounded-md">
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Arabic Name */}
            {languages!=1 &&(
              <Input
                label={text.choiceNameAr}
                placeholder="مثال: مياه"
                {...register(`productVariants.${index}.choices.${choiceIndex}.nameAr`)}
              />
            )}
            {/* English Name */}
            {languages!=0 &&(
              <Input
                label={text.choiceNameEn}
                placeholder="Example: Water"
                {...register(`productVariants.${index}.choices.${choiceIndex}.nameEn`)}
              />
            )}
            {/* Price */}
            <Input
              type="number"
              label={text.choicePrice}
              placeholder="0"
               prefix={currencyAbbreviation === 'ر.س' ? (
                <Image src={sarIcon} alt="SAR" width={10} height={10} />
              ) : (
                currencyAbbreviation
              )}
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
                    className="flex min-h-[58px] w-full items-center rounded-md border border-muted px-3 dark:border-gray-300"
                  >
                    <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-muted bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
                      {imageChoice && (imageChoice instanceof File || typeof imageChoice === 'string') && (
                        <>
                          {typeof imageChoice === 'string' ?
                            <Image
                              src={imageChoice}
                              fill
                              className="object-contain"
                              priority
                              alt={`choice ${choiceIndex}`}
                              sizes="(max-width: 768px) 100vw"
                            />
                            :
                            <Image
                              src={URL.createObjectURL(imageChoice)}
                              fill
                              className="object-contain"
                              priority
                              alt={imageChoice.name}
                              sizes="(max-width: 768px) 100vw"
                            />
                          }
                        </>
                      )}
                    </div>
                    <div className="truncate px-2.5">{imageChoice?.name || `Choice ${choiceIndex}`}</div>
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
            {(languages==1 || languages==0) &&(
              <div></div>
            )}
            <div>
              {/* Is Default */}
              <Controller
                name={`productVariants.${index}.choices.${choiceIndex}.isDefault`}
                control={control}
                render={({ field: { value } }) => (
                  <Checkbox
                    checked={value}
                    onChange={() => {
                      // Reset all others to false
                      fields.forEach((_, i) => {
                        setValue(`productVariants.${index}.choices.${i}.isDefault`, i === choiceIndex);
                      });
                    }}
                    label={text.isDefault}
                    className="col-span-full"
                  />
                )}
              />

            </div>
            <div>
              {/* Is Active */}
              <Controller
                name={`productVariants.${index}.choices.${choiceIndex}.isActive`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    value={value}
                    checked={value}
                    onChange={onChange}
                    label={text.isActive}
                    // className="col-span-full"
                  />
                )}
              />
            </div>
          </div>

          {/* Remove Choice */}
          <ActionIcon onClick={() => remove(choiceIndex)} variant="flat">
            <TrashIcon className="h-4 w-4" />
          </ActionIcon>
        </div>
      )})}

      <Button onClick={() => append({ nameAr: languages === 1 ? 'no data' : '', nameEn: languages === 0 ? 'no data' : '', price: null, isDefault: false, isActive: true, image: '' })} variant="outline">
        <PiPlusBold className="me-2 h-4 w-4" /> {text.addChoice}
      </Button>
    </div>
  );
}
