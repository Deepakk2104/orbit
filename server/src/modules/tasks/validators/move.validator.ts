import { z } from "zod";

export const moveTaskSchema = z.object({
  columnId: z.string().min(1, "Column id is required"),
  position: z.number().int().min(0, "Position must be a non-negative integer"),
});

export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
