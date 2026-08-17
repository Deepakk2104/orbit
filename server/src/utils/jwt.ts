import jwt, { type SignOptions } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (userId: string) => {
  const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
    "15m") as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn });
};

export const generateRefreshToken = (userId: string) => {
  const expiresIn = (process.env.REFRESH_TOKEN_EXPIRES_IN ||
    "7d") as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn });
};

export const verifyRefreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as unknown as {
      userId: string;
    };

    return decoded.userId;
  } catch {
    return null;
  }
};
