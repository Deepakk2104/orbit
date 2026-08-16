import { z } from "zod";

export const inviteSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase(),
});

export type InviteInput = z.infer<typeof inviteSchema>;