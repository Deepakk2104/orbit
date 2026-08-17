import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
