import type { Request, Response } from "express";
import { registerSchema } from "./validators/register.validator.js";
import { registerUser } from "./auth.service.js";
import { loginSchema } from "./validators/login.validator.js";
import { loginUser } from "./auth.service.js";
import type { AuthRequest } from "../../middlewares/auth.middleware.js";
import { prisma } from "../../lib/prisma.js";
import { forgotPasswordSchema } from "./validators/forgot-password.validator.js";
import { forgotPassword as sendResetEmail } from "./auth.service.js";
import { resetPasswordSchema } from "./validators/reset-password.validator.js";
import { resetPassword as resetUserPassword } from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const me = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });

  return res.json({
    success: true,
    data: user,
  });
};
export const logout = (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    await sendResetEmail(data);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  } catch {
    return res.status(400).json({
      success: false,
      message: "Unable to process password reset request.",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    await resetUserPassword(data);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to reset password.",
    });
  }
};