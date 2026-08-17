import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { sendPasswordResetEmail } from "../../utils/mail.js";
import type { RegisterInput } from "./validators/register.validator.js";
import type { LoginInput } from "./validators/login.validator.js";
import type { ForgotPasswordInput } from "./validators/forgot-password.validator.js";
import type { ResetPasswordInput } from "./validators/reset-password.validator.js";
import {
  badRequestError,
  conflictError,
  unauthorizedError,
} from "../../lib/errors.js";

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw conflictError("Email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw unauthorizedError("Invalid email or password");
  }

  const isPasswordCorrect = await comparePassword(data.password, user.password);

  if (!isPasswordCorrect) {
    throw unauthorizedError("Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

export const refreshUserSession = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  if (!user) {
    throw unauthorizedError("Invalid refresh token");
  }

  return {
    accessToken: generateAccessToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    user,
  };
};

export const forgotPassword = async (data: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  // Don't reveal whether an account exists.
  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    },
  });

  await sendPasswordResetEmail(user.email, token);
};

export const resetPassword = async (data: ResetPasswordInput) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: data.token,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw badRequestError("Invalid or expired reset token");
  }

  const hashedPassword = await hashPassword(data.password);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });
};
