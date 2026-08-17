import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Task description must be less than 1000 characters")
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.coerce.date().nullable().optional(),
  assigneeId: z.string().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
