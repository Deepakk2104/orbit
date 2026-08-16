import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, "Organization name must be at least 3 characters")
    .max(50, "Organization name must be less than 50 characters"),
});

export type UpdateOrganizationInput = z.infer<
  typeof updateOrganizationSchema
>;