import * as z from "zod";

export const createProjectFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  color: z.string().optional(),
  billable: z.boolean().default(false),
  billableAmount: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  isUseAI: z.boolean().default(false),
  members: z.array(z.string()).default([]),
  dueDate: z.date().optional(),
});
