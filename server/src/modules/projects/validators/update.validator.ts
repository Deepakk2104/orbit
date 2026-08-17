import { z } from "zod";

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Project description must be less than 500 characters")
    .nullable()
    .optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
