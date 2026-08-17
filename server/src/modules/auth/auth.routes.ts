import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  forgotPassword,
  logout,
  refresh,
  register,
  resetPassword,
} from "./auth.controller.js";
import { login } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { me } from "./auth.controller.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT || 20),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again later.",
  },
});

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refresh);
router.get("/me", authenticate, me);
router.post("/logout", logout);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;
