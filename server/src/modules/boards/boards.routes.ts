import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  authorizeMember,
  authorizeProject,
} from "../../middlewares/authorize.js";
import { create, getById } from "./boards.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/", authorizeMember, authorizeProject, create);
router.get("/", authorizeMember, authorizeProject, getById);

export default router;