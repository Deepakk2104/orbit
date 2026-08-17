import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),

  avatar: z
    .string()
    .trim()
    .url("Enter a valid image URL")
    .max(500, "Avatar URL is too long")
    .or(z.literal(""))
    .optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
