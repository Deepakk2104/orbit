import type { Response } from "express";
import type { ProjectRequest } from "../../middlewares/authorize.js";
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from "./columns.service.js";
import { createColumnSchema } from "./validators/create.validator.js";
import { updateColumnSchema } from "./validators/update.validator.js";

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

export const create = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = createColumnSchema.parse(req.body);

    const column = await createColumn(req.projectId, data);

    return res.status(201).json({
      success: true,
      message: "Column created successfully.",
      data: column,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const update = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const columnId = req.params.columnId;

    if (typeof columnId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Column id is required",
      });
    }

    const data = updateColumnSchema.parse(req.body);

    const column = await updateColumn(req.projectId, columnId, data);

    return res.json({
      success: true,
      message: "Column updated successfully.",
      data: column,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const remove = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const columnId = req.params.columnId;

    if (typeof columnId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Column id is required",
      });
    }

    await deleteColumn(req.projectId, columnId);

    return res.json({
      success: true,
      message: "Column deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};