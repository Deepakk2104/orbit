import { z } from "zod";

export const updateColumnSchema = z.object({
  name: z
    .string()
    .min(1, "Column name is required")
    .max(50, "Column name must be less than 50 characters"),
});

export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;