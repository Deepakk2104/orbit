import type { OrganizationRole } from "@prisma/client";

export interface InvitationView {
  id: string;
  email: string;
  organizationId: string;
  createdAt: Date;
}

export interface MemberView {
  id: string;
  role: OrganizationRole;
  joinedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}