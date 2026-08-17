import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment must be less than 1000 characters"),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
