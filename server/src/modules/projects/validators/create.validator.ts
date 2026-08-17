import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Project description must be less than 500 characters")
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
