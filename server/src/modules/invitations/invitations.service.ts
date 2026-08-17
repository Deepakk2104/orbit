import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
import { sendInvitationEmail } from "../../utils/mail.js";
import type { InviteInput } from "./validators/invite.validator.js";
import type { MemberView } from "./invitations.types.js";

const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const inviteMember = async (
  orgId: string,
  invitedById: string,
  data: InviteInput
) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    select: {
      name: true,
    },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    const alreadyMember = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: existingUser.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (alreadyMember) {
      throw new Error("This user is already a member");
    }
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invitation = await prisma.invitation.create({
    data: {
      email: data.email,
      token,
      organizationId: orgId,
      invitedById,
      expiresAt: new Date(Date.now() + INVITATION_TTL_MS),
    },
    select: {
      id: true,
      email: true,
      organizationId: true,
      createdAt: true,
    },
  });

  await sendInvitationEmail(data.email, organization.name, token);

  const devToken = process.env.NODE_ENV !== "production" ? { token } : {};

  return {
    ...invitation,
    ...devToken,
  };
};

export const acceptInvitation = async (userId: string, token: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: {
      token,
    },
  });

  if (!invitation) {
    throw new Error("Invalid invitation");
  }

  if (invitation.acceptedAt) {
    throw new Error("This invitation has already been used");
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error("This invitation has expired");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.email !== invitation.email) {
    throw new Error("This invitation was sent to a different email");
  }

  const alreadyMember = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: invitation.organizationId,
        userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (alreadyMember) {
    throw new Error("You are already a member of this organization");
  }

  const membership = await prisma.$transaction(async (tx) => {
    const member = await tx.organizationMember.create({
      data: {
        organizationId: invitation.organizationId,
        userId,
        role: "MEMBER",
      },
      select: {
        role: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    await tx.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        acceptedAt: new Date(),
      },
    });

    return member;
  });

  return membership;
};

export const listMembers = async (orgId: string): Promise<MemberView[]> => {
  const members = await prisma.organizationMember.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  return members;
};

export const removeMember = async (
  orgId: string,
  memberId: string,
  requesterId: string
) => {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      id: memberId,
    },
    select: {
      organizationId: true,
      role: true,
      userId: true,
    },
  });

  if (!membership || membership.organizationId !== orgId) {
    throw new Error("Member not found in this organization");
  }

  if (membership.role === "OWNER") {
    throw new Error("You cannot remove the organization owner");
  }

  if (membership.userId === requesterId) {
    throw new Error("You cannot remove yourself");
  }

  await prisma.organizationMember.delete({
    where: {
      id: memberId,
    },
  });
};
