import type { Response } from "express";
import type { ProjectRequest } from "../../middlewares/authorize.js";
import {
  createComment,
  deleteComment,
  listComments,
} from "./comments.service.js";
import { createCommentSchema } from "./validators/create.validator.js";
import { handleError } from "../../lib/handle-error.js";

const getTaskId = (req: ProjectRequest, res: Response) => {
  const taskId = req.params.taskId;

  if (typeof taskId !== "string") {
    res.status(400).json({
      success: false,
      message: "Task id is required",
    });

    return null;
  }

  return taskId;
};

export const list = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.orgId || !req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const taskId = getTaskId(req, res);

    if (!taskId) {
      return;
    }

    const comments = await listComments(req.orgId, req.projectId, taskId);

    return res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const create = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.orgId || !req.projectId || !req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const taskId = getTaskId(req, res);

    if (!taskId) {
      return;
    }

    const data = createCommentSchema.parse(req.body);

    const comment = await createComment(
      req.orgId,
      req.projectId,
      taskId,
      req.userId,
      data
    );

    return res.status(201).json({
      success: true,
      message: "Comment created successfully.",
      data: comment,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const remove = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.orgId || !req.projectId || !req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const taskId = getTaskId(req, res);

    if (!taskId) {
      return;
    }

    const commentId = req.params.commentId;

    if (typeof commentId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Comment id is required",
      });
    }

    await deleteComment(
      req.orgId,
      req.projectId,
      taskId,
      commentId,
      req.userId
    );

    return res.json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
