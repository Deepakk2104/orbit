import type { Response } from "express";
import type { OrgRequest } from "../../middlewares/authorize.js";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "./projects.service.js";
import { createProjectSchema } from "./validators/create.validator.js";
import { updateProjectSchema } from "./validators/update.validator.js";
import { handleError } from "../../lib/handle-error.js";

const getProjectId = (req: OrgRequest, res: Response): string | null => {
  const projectId = req.params.projectId;

  if (typeof projectId !== "string") {
    res.status(400).json({
      success: false,
      message: "Project id is required",
    });

    return null;
  }

  return projectId;
};

export const create = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId || !req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = createProjectSchema.parse(req.body);

    const project = await createProject(req.orgId, req.userId, data);

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const list = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const projects = await listProjects(req.orgId);

    return res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getById = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const projectId = getProjectId(req, res);

    if (!projectId) {
      return;
    }

    const project = await getProject(req.orgId, projectId);

    return res.json({
      success: true,
      data: project,
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

    const projectId = getProjectId(req, res);

    if (!projectId) {
      return;
    }

    const data = updateProjectSchema.parse(req.body);

    const project = await updateProject(req.orgId, projectId, data);

    return res.json({
      success: true,
      message: "Project updated successfully.",
      data: project,
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

    const projectId = getProjectId(req, res);

    if (!projectId) {
      return;
    }

    await deleteProject(req.orgId, projectId);

    return res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
