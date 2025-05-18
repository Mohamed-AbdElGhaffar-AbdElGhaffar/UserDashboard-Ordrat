import { z } from 'zod';
import { messages } from '@/config/messages';

// form zod validation schema
export const createRoleSchema = z.object({
  groupNameEn: z
    .string()
    .min(1, { message: messages.groupNameEnIsRequired })
    .min(3, { message: messages.groupNameLengthMin }),
  groupNameAr: z
    .string()
    .min(1, { message: messages.groupNameArIsRequired })
    .min(3, { message: messages.groupNameLengthMin }),
  groupColor: z
    .object({
      r: z.number(),
      g: z.number(),
      b: z.number(),
      a: z.number(),
    })
    .optional(),
});

// generate form types from zod validation schema
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
