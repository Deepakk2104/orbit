import { prisma } from "../../lib/prisma.js";
import { slugify } from "../../utils/slug.js";
import type { CreateOrganizationInput } from "./validators/create.validator.js";
import type { UpdateOrganizationInput } from "./validators/update.validator.js";
import type { OrganizationView } from "./organizations.types.js";

const createUniqueSlug = async (baseSlug: string): Promise<string> => {
  const existing = await prisma.organization.findUnique({
    where: {
      slug: baseSlug,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return baseSlug;
  }

  const suffix = Math.random().toString(36).slice(2, 6);

  return `${baseSlug}-${suffix}`;
};

export const createOrganization = async (
  userId: string,
  data: CreateOrganizationInput
): Promise<OrganizationView> => {
  const slug = await createUniqueSlug(slugify(data.name));

  const organization = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: data.name,
        slug,
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await tx.organizationMember.create({
      data: {
        organizationId: org.id,
        userId,
        role: "OWNER",
      },
    });

    return org;
  });

  return {
    ...organization,
    role: "OWNER",
  };
};

export const listOrganizations = async (
  userId: string
): Promise<OrganizationView[]> => {
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: {
      joinedAt: "desc",
    },
  });

  return memberships.map((membership) => ({
    ...membership.organization,
    role: membership.role,
  }));
};

export const getOrganization = async (orgId: string, userId: string) => {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: orgId,
        userId,
      },
    },
    include: {
      organization: {
        include: {
          members: {
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
          },
        },
      },
    },
  });

  if (!membership) {
    throw new Error("Organization not found or access denied");
  }

  const { organization } = membership;

  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    role: membership.role,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
    members: organization.members,
  };
};

export const updateOrganization = async (
  orgId: string,
  data: UpdateOrganizationInput
) => {
  const current = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    select: {
      name: true,
      slug: true,
    },
  });

  if (!current) {
    throw new Error("Organization not found");
  }

  const baseSlug = slugify(data.name);
  const slug =
    baseSlug === current.slug
      ? current.slug
      : await createUniqueSlug(baseSlug);

  return prisma.organization.update({
    where: {
      id: orgId,
    },
    data: {
      name: data.name,
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const deleteOrganization = async (orgId: string) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    select: {
      id: true,
    },
  });

  if (!organization) {
    throw new Error("Organization not found");
  }

  await prisma.organization.delete({
    where: {
      id: orgId,
    },
  });
};