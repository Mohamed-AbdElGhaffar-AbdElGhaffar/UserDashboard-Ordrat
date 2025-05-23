import { z } from 'zod';
import { validateEmail } from './common-rules';
import { messages } from '@/config/messages';

// Define schema for different types
const phoneNumberSchema = z.string({ required_error: messages.variantInputIsRequired }).min(1, messages.variantInputIsRequired);
const emailSchema = z.string({ required_error: messages.variantInputIsRequired }).email("Invalid email address").min(1, "Email is required");
const dateSchema = z.string({ required_error: messages.variantInputIsRequired }).min(1, "Date is required");
// const imageSchema = z.instanceof(File).refine(
//   (file) => file.size <= 5 * 1024 * 1024,
//   { message: 'File size should be less than 5MB' }
// ).refine(
//   (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
//   { message: 'Only JPEG, PNG, or GIF files are allowed' }
// );

// Helper function to map buttonType to schema
const getSchemaByButtonType = (buttonType: number, isOptional: boolean) => {
  const schema = (() => {
    switch (buttonType) {
      case 0: // Radio
        return z.string({ required_error: messages.variantRadioIsRequired }).nonempty(messages.variantRadioIsRequired);
      case 1: // Dropdown
        return z.string({ required_error: messages.variantRadioIsRequired }).min(1, messages.variantRadioIsRequired);
      case 2: // Checkbox
        return z.string({ required_error: messages.variantRadioIsRequired }).min(1, messages.variantRadioIsRequired);
      case 3: // Input
        return z.string({ required_error: messages.variantInputIsRequired }).min(1, messages.variantInputIsRequired);
      case 4: // PhoneNumber
        return phoneNumberSchema;
      case 5: // Email
        return emailSchema;
      case 6: // Date
        return dateSchema;
      default:
        return z.string().optional();
    }
  })();

  return isOptional ? schema.optional() : schema;
};

// Main schema builder
export const buildProductDetailsSchema = (variations: { id: string; name: string; buttonType: number; isActive: boolean; isRequired: boolean; }[]) => {
  const schema = variations.reduce((acc, variation) => {
    // If isActive or isRequired is false, make the field optional
    const isOptional = !variation.isActive || !variation.isRequired;
    const fieldSchema = getSchemaByButtonType(variation.buttonType, isOptional);
    acc[variation.id] = fieldSchema;
    return acc;
  }, {} as Record<string, any>);

  return z.object(schema);
};
export type ProductDetailsInput = z.infer<ReturnType<typeof buildProductDetailsSchema>>;


// the code that all variations is required
// import { z } from 'zod';
// import { validateEmail } from './common-rules';
// import { messages } from '@/config/messages';

// // Define schema for different types
// const phoneNumberSchema = z.string().min(1, "Phone Number is required");
// const emailSchema = z.string().email("Invalid email address").min(1, "Email is required");
// const dateSchema = z.string().min(1, "Date is required");
// // const imageSchema = z.instanceof(File).refine(
// //   (file) => file.size <= 5 * 1024 * 1024,
// //   { message: 'File size should be less than 5MB' }
// // ).refine(
// //   (file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
// //   { message: 'Only JPEG, PNG, or GIF files are allowed' }
// // );

// // Helper function to map buttonType to schema
// const getSchemaByButtonType = (buttonType: number) => {
//   switch (buttonType) {
//     case 0: // Radio
//       return z.string().nonempty("Radio is required");
//     case 1: // Dropdown
//       return z.string().min(1, "Radio is required");
//     case 2: // Checkbox
//       return z.string().min(1, "Selection is required");
//     case 3: // Input
//       return z.string().min(1, "Input is required");
//     case 4: // PhoneNumber
//       return phoneNumberSchema;
//     case 5: // Email
//       return emailSchema;
//     case 6: // Date
//       return dateSchema;
//     case 7: // ImageUploade
//       // return imageSchema;
//     default:
//       return z.string().optional();
//   }
// };

// // Main schema builder
// export const buildProductDetailsSchema = (variations: { id: string, name: string, buttonType: number }[]) => {
//   const schema = variations.reduce((acc, variation) => {
//     const fieldSchema = getSchemaByButtonType(variation.buttonType);
//     acc[variation.id] = fieldSchema;
//     return acc;
//   }, {} as Record<string, any>);

//   return z.object(schema);
// };
// export type ProductDetailsInput = z.infer<ReturnType<typeof buildProductDetailsSchema>>;