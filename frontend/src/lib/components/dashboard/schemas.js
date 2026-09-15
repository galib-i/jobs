import { z } from "zod";

export const schema = z.object({
  id: z.number(),
  company: z.string(),
  role: z.string(),
  location: z.string(),
  lastStage: z.string().optional(),
  formattedDate: z.string().optional(),
  createdAt: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  link: z.string().optional(),
});
