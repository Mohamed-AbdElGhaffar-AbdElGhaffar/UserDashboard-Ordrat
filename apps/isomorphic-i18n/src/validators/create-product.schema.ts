import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';
export enum ButtonType {
  Radio = 0,
  Dropdown = 1,
  Checkbox = 2,
  Input = 3,
  PhoneNumber = 4,
  Email = 5,
  Date = 6,
  Image = 7,
}

export const productFormSchema = z.object({
  titleEn: z.string({ required_error: messages.productNameEnIsRequired}).min(1, { message: messages.productNameEnIsRequired }),
  titleAr: z.string({ required_error: messages.productNameArIsRequired}).min(1, { message: messages.productNameArIsRequired }),
  // sku: z.string().optional(),
  // type: z
  //   .string({ required_error: messages.productTypeIsRequired })
  //   .min(1, { message: messages.productTypeIsRequired }),
  categories: z.string({ required_error: messages.productCategoriesIsRequired }),
  descriptionEn: z.string().min(1, { message: messages.productDescriptionEnIsRequired }),
  descriptionAr: z.string().min(1, { message: messages.productDescriptionArIsRequired }),
  // Barcode: z.string().min(1, { message: messages.productBarcodeIsRequired }),
  IsBarcode: z.boolean(),
  Barcode: z.any().optional(),
  HasStock: z.boolean(),
  StockNumber: z.any().optional(),
  FrequentlyOrderedWith: z.array(z.string().optional()).optional(),
  // productImages: z.array(z.instanceof(File), { required_error: messages.atLeastOneImageRequired}),
  productImages: z.array(
    z.custom((val) => val instanceof File || typeof val === 'string', {
      message: messages.atLeastOneImageRequired,
    }),
    { required_error: messages.atLeastOneImageRequired}
  ),  
  price: z.coerce.number().min(0, { message: messages.priceIsRequired }),
  BuyingPrice: z.coerce.number().min(0, { message: messages.buyingPriceIsRequired }),
  // oldPrice: z.coerce
  //   .number()
  //   .min(0, { message: messages.oldPriceIsRequired }),
  // inventoryTracking: z.string().optional(),
  // currentStock: z.number().or(z.string()).optional(),
  // lowStock: z.number().or(z.string()).optional(),
  // productAvailability: z.string().optional(),
  // tradeNumber: z.number().or(z.string()).optional(),
  // manufacturerNumber: z.number().or(z.string()).optional(),
  // brand: z.string().optional(),
  // upcEan: z.number().or(z.string()).optional(),
  // customFields: z
  //   .array(
  //     z.object({
  //       label: z.string().optional(),
  //       value: z.string().optional(),
  //     })
  //   )
  //   .optional(),

  // freeShipping: z.boolean().optional(),
  // shippingPrice: z.coerce
  //   .number()
  //   .min(1, { message: messages.shippingPriceIsRequired }),
  // locationBasedShipping: z.boolean().optional(),
  // locationShipping: z
  //   .array(
  //     z.object({
  //       name: z.string().optional(),
  //       shippingCharge: z.number().or(z.string()).optional(),
  //     })
  //   )
  //   .optional(),
  pageTitleEn: z.string().min(1, { message: messages.productPageTitleEnIsRequired }),
  pageTitleAr: z.string().min(1, { message: messages.productPageTitleArIsRequired }),
  metaDescriptionEn: z.string().min(1, { message: messages.productMetaDescriptionEnIsRequired }),
  metaDescriptionAr: z.string().min(1, { message: messages.productMetaDescriptionArIsRequired }),
  IsDiscountActive: z.boolean(),
  Discount: z.any().optional(),
  DiscountType: z.string().optional(),
  // VAT: z.string().optional(),
  // VATType: z.string().optional(),
  // metaKeywords: z.string().optional(),
  // productUrl: z.string().optional(),
  // isPurchaseSpecifyDate: z.boolean().optional(),
  // isLimitDate: z.boolean().optional(),
  // dateFieldName: z.string().optional(),
  // availableDate: z.date().min(new Date('1900-01-01')).optional(),
  // endDate: z.date().min(new Date('1900-01-02')).optional(),
  // productVariants: z
  //   .array(
  //     z.object({
  //       name: z.string().optional(),
  //       value: z.string().optional(),
  //     })
  //   )
  //   .optional(),
  // productVariants: z.array(
  //   z.object({
  //     nameAr: z.string().min(1, { message: messages.variantNameArIsRequired }),
  //     nameEn: z.string().min(1, { message: messages.variantNameEnIsRequired }),
  //     buttonType: z
  //       .union([
  //         z.nativeEnum(ButtonType),
  //         z.object({ value: z.nativeEnum(ButtonType) }).transform((obj) => obj.value),
  //       ])
  //       .refine((val) => Object.values(ButtonType).includes(val), {
  //         message: messages.variantButtonTypeIsRequired,
  //       }), // ✅ Fix applied here
  //     priority: z.number().min(0, { message: messages.variantPriorityIsRequired }),
  //     isRequired: z.boolean(),

  //     // Choices validation (Only required when buttonType is 0, 1, or 2)
  //     choices: z.array(
  //       z.object({
  //         nameAr: z.string().min(1, { message: messages.choiceNameArIsRequired }),
  //         nameEn: z.string().min(1, { message: messages.choiceNameEnIsRequired }),
  //         price: z.coerce.number().min(0, { message: messages.choicePriceIsRequired }),
  //         isDefault: z.boolean(),
  //         image: z.string().url({ message: messages.choiceImageIsInvalid }).optional(),
  //       })
  //     ).optional(),
  //   })
  //   .refine((variant) => {
  //     if ([ButtonType.Radio, ButtonType.Dropdown, ButtonType.Checkbox].includes(variant.buttonType) &&
  //       (!variant.choices || variant.choices.length === 0)) {
  //       return false;
  //     }
  //     return true;
  //   }, { message: messages.choicesAreRequiredForSelectedButtonType })
  // ).optional(),
  productVariants: z
    .array(
      z
        .object({
          id: z.string().optional(),
          nameAr: z.string().optional(),
          nameEn: z.string().optional(),
          buttonType: z
            .union([
              z.nativeEnum(ButtonType),
              z.object({ value: z.nativeEnum(ButtonType) }).transform((obj) => obj.value),
            ])
            .refine((val) => Object.values(ButtonType).includes(val), {
              message: messages.variantButtonTypeIsRequired,
            })
            .optional(),

          priority: z.coerce.number().min(0, { message: messages.variantPriorityIsRequired }).optional(),
          isRequired: z.boolean().optional(),
          isActive: z.boolean().optional(),

          choices: z
            .array(
              z.object({
                id: z.string().optional(),
                nameAr: z.string().min(1, { message: messages.choiceNameArIsRequired }),
                nameEn: z.string().min(1, { message: messages.choiceNameEnIsRequired }),
                price: z.coerce.number().min(0, { message: messages.choicePriceIsRequired }),
                isDefault: z.boolean(),
                isActive: z.boolean(),
                image: z.any(),
                // image: z.instanceof(File).optional(),
              })
            )
            .optional(),
        })
        .optional()
    )
    .optional(),
  // tags: z.array(z.string()).optional(),
})

export type CreateProductInput = z.infer<typeof productFormSchema>;
