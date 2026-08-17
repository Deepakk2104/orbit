import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { change, update } from "./users.controller.js";

const router = Router();

router.use(authenticate);

router.patch("/profile", update);
router.patch("/password", change);

export default router;
