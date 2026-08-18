import type { Response } from "express";
import type { OrgRequest } from "../../middlewares/authorize.js";
import { getDashboard } from "./dashboard.service.js";
import { handleError } from "../../lib/handle-error.js";

export const getByOrg = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const dashboard = await getDashboard(req.orgId);

    return res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
