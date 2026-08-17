import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  authorizeMember,
  authorizeProject,
} from "../../middlewares/authorize.js";
import { create, list, remove } from "./comments.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", authorizeMember, authorizeProject, list);
router.post("/", authorizeMember, authorizeProject, create);
router.delete("/:commentId", authorizeMember, authorizeProject, remove);

export default router;
