import type { Response } from "express";
import type { ProjectRequest } from "../../middlewares/authorize.js";
import { createBoard, getBoard } from "./boards.service.js";
import { handleError } from "../../lib/handle-error.js";

export const create = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.orgId || !req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const board = await createBoard(req.orgId, req.projectId);

    return res.status(201).json({
      success: true,
      message: "Board created successfully.",
      data: board,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getById = async (req: ProjectRequest, res: Response) => {
  try {
    if (!req.orgId || !req.projectId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const board = await getBoard(req.orgId, req.projectId);

    return res.json({
      success: true,
      data: board,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
