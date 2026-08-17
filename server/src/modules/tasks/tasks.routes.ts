import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  authorizeMember,
  authorizeProject,
} from "../../middlewares/authorize.js";
import commentRoutes from "../comments/comments.routes.js";
import { create, move, remove, update } from "./tasks.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post(
  "/board/columns/:columnId/tasks",
  authorizeMember,
  authorizeProject,
  create
);
router.patch("/tasks/:taskId", authorizeMember, authorizeProject, update);
router.delete("/tasks/:taskId", authorizeMember, authorizeProject, remove);
router.patch("/tasks/:taskId/move", authorizeMember, authorizeProject, move);
router.use("/tasks/:taskId/comments", commentRoutes);

export default router;
