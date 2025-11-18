import { z } from 'zod';

export const MatchingRequestSchema = z.object({
  userIds: z.array(z.string()).optional(),
  taskIds: z.array(z.string()).optional(),
  minScore: z.number().min(0).max(100).optional().default(0),
  maxMatchesPerUser: z.number().positive().optional(),
  sortByScore: z.boolean().optional().default(true),
});

export type MatchingRequestInput = z.infer<typeof MatchingRequestSchema>;
