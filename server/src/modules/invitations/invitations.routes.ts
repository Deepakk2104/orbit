import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { accept } from "./invitations.controller.js";

const router = Router();

router.use(authenticate);

router.post("/:token/accept", accept);

export default router;