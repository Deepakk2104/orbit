import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
