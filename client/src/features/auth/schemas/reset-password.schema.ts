import { z } from "zod";

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
