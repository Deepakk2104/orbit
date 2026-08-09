import jwt, { type SignOptions } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

export const generateAccessToken = (userId: string) => {
  const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ||
    "15m") as NonNullable<SignOptions["expiresIn"]>;

  const options: SignOptions = { expiresIn };

  return jwt.sign({ userId }, ACCESS_SECRET, options);
};