import { Router } from "express";
import { forgotPassword, logout, register, resetPassword, } from "./auth.controller.js";
import { login } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { me } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;