import type { OrganizationRole } from "@prisma/client";

export interface OrganizationView {
  id: string;
  name: string;
  slug: string;
  role: OrganizationRole;
  createdAt: Date;
  updatedAt: Date;
}