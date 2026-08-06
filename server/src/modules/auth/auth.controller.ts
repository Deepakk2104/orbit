import type { Request, Response } from "express";
import { registerSchema } from "./validators/register.validator.js";
import { registerUser } from "./auth.service.js";

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