import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { changePassword, updateProfile } from "./users.service.js";
import { updateProfileSchema } from "./validators/update-profile.validator.js";
import { changePasswordSchema } from "./validators/change-password.validator.js";

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

export const update = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = updateProfileSchema.parse(req.body);

    const user = await updateProfile(req.userId, data);

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const change = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = changePasswordSchema.parse(req.body);

    await changePassword(req.userId, data);

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
