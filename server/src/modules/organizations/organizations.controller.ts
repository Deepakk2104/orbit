import type { Response } from "express";
import type { OrgRequest } from "../../middlewares/authorize.js";
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  listOrganizations,
  updateOrganization,
} from "./organizations.service.js";
import { createOrganizationSchema } from "./validators/create.validator.js";
import { updateOrganizationSchema } from "./validators/update.validator.js";

const handleError = (
  res: Response,
  error: unknown,
  fallback = "Internal Server Error"
) => {
  return res.status(400).json({
    success: false,
    message: error instanceof Error ? error.message : fallback,
  });
};

export const create = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = createOrganizationSchema.parse(req.body);

    const organization = await createOrganization(req.userId, data);

    return res.status(201).json({
      success: true,
      message: "Organization created successfully.",
      data: organization,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const list = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const organizations = await listOrganizations(req.userId);

    return res.json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getById = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId || !req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const organization = await getOrganization(req.orgId, req.userId);

    return res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const update = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = updateOrganizationSchema.parse(req.body);

    const organization = await updateOrganization(req.orgId, data);

    return res.json({
      success: true,
      message: "Organization updated successfully.",
      data: organization,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const remove = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await deleteOrganization(req.orgId);

    return res.json({
      success: true,
      message: "Organization deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};