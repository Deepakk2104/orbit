import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { CreateProjectInput } from "./validators/create.validator.js";
import type { UpdateProjectInput } from "./validators/update.validator.js";
import type { ProjectView } from "./projects.types.js";
import { notFoundError } from "../../lib/errors.js";

const projectSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect;

export const listProjects = async (orgId: string): Promise<ProjectView[]> => {
  return prisma.project.findMany({
    where: {
      organizationId: orgId,
    },
    select: projectSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createProject = async (
  orgId: string,
  userId: string,
  data: CreateProjectInput
): Promise<ProjectView> => {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      organizationId: orgId,
      createdById: userId,
    },
    select: projectSelect,
  });
};

export const getProject = async (
  orgId: string,
  projectId: string
): Promise<ProjectView> => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
    },
    select: projectSelect,
  });

  if (!project) {
    throw notFoundError("Project not found or access denied");
  }

  return project;
};

export const updateProject = async (
  orgId: string,
  projectId: string,
  data: UpdateProjectInput
): Promise<ProjectView> => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw notFoundError("Project not found or access denied");
  }

  return prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
    },
    select: projectSelect,
  });
};

export const deleteProject = async (orgId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: orgId,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    throw notFoundError("Project not found or access denied");
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
};
