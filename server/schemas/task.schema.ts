import { z } from 'zod';
import { DayOfWeekSchema } from './user.schema';

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  requiredAbilities: z.array(z.string()),
  difficulty: DifficultySchema,
  preferredDays: z.array(DayOfWeekSchema),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  requiredAbilities: z.array(z.string()).optional(),
  difficulty: DifficultySchema.optional(),
  preferredDays: z.array(DayOfWeekSchema).optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
