import { z } from 'zod';
import { StaminaLevel, DayOfWeek } from '../../src/models';

export const StaminaLevelSchema = z.enum(['low', 'medium', 'high']);
export const DayOfWeekSchema = z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);

export const CreateUserSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  abilities: z.array(z.string()).min(1, '少なくとも1つのスキルが必要です'),
  staminaLevel: StaminaLevelSchema,
  availableDays: z.array(DayOfWeekSchema).min(1, '少なくとも1つの利用可能曜日が必要です'),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  abilities: z.array(z.string()).min(1).optional(),
  staminaLevel: StaminaLevelSchema.optional(),
  availableDays: z.array(DayOfWeekSchema).min(1).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
