import type { NextFunction, Request, Response } from "express";
import type { OrganizationRole } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { AuthRequest } from "./auth.middleware.js";

export interface OrgRequest extends AuthRequest {
  orgId?: string;
  membershipRole?: OrganizationRole;
}

export interface ProjectRequest extends OrgRequest {
  projectId?: string;
}

export const authorizeProject = async (
  req: ProjectRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const projectIdParam = req.params.projectId;

    if (typeof projectIdParam !== "string") {
      return res.status(400).json({
        success: false,
        message: "Project id is required",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectIdParam,
        organizationId: req.orgId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project",
      });
    }

    req.projectId = projectIdParam;

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const authorizeMember = async (
  req: OrgRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orgIdParam = req.params.orgId;

    if (typeof orgIdParam !== "string") {
      return res.status(400).json({
        success: false,
        message: "Organization id is required",
      });
    }

    const orgId = orgIdParam;

    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: req.userId,
        },
      },
      select: {
        role: true,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organization",
      });
    }

    req.orgId = orgId;
    req.membershipRole = membership.role;

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const requireOwner = (
  req: OrgRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.membershipRole !== "OWNER") {
    return res.status(403).json({
      success: false,
      message: "Only organization owners can perform this action",
    });
  }

  next();
};