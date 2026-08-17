import type { Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError } from "./errors.js";

export const handleError = (
  res: Response,
  error: unknown,
  fallback = "Internal Server Error"
) => {
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    return res.status(400).json({
      success: false,
      message: firstIssue?.message ?? "Invalid input",
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: fallback,
  });
};
