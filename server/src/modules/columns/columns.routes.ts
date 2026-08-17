import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  authorizeMember,
  authorizeProject,
} from "../../middlewares/authorize.js";
import { create, remove, update } from "./columns.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/", authorizeMember, authorizeProject, create);
router.patch("/:columnId", authorizeMember, authorizeProject, update);
router.delete("/:columnId", authorizeMember, authorizeProject, remove);

export default router;
