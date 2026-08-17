import type { Response } from "express";
import type { ProjectRequest } from "../../middlewares/authorize.js";
import {
  createTask,
  deleteTask,
  moveTask,
  updateTask,
} from "./tasks.service.js";
import { createTaskSchema } from "./validators/create.validator.js";
import { updateTaskSchema } from "./validators/update.validator.js";
import { moveTaskSchema } from "./validators/move.validator.js";

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
    if (!req.orgId || !req.projectId || !req.userId) {
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

    const data = createTaskSchema.parse(req.body);

    const task = await createTask(
      req.orgId,
      req.projectId,
      columnId,
      req.userId,
      data
    );

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const update = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.orgId || !req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const taskId = req.params.taskId;

    if (typeof taskId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Task id is required",
      });
    }

    const data = updateTaskSchema.parse(req.body);

    const task = await updateTask(req.orgId, req.projectId, taskId, data);

    return res.json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const remove = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.orgId || !req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const taskId = req.params.taskId;

    if (typeof taskId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Task id is required",
      });
    }

    await deleteTask(req.orgId, req.projectId, taskId);

    return res.json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const move = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.orgId || !req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const taskId = req.params.taskId;

    if (typeof taskId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Task id is required",
      });
    }

    const data = moveTaskSchema.parse(req.body);

    await moveTask(req.orgId, req.projectId, taskId, data);

    return res.json({
      success: true,
      message: "Task moved successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};