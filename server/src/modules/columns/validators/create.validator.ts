import { z } from "zod";

export const createColumnSchema = z.object({
  name: z
    .string()
    .min(1, "Column name is required")
    .max(50, "Column name must be less than 50 characters"),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
