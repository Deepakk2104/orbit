import { Router } from "express";
import { logout, register } from "./auth.controller.js";
import { login } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { me } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, me);
router.post("/logout", logout);

export default router;