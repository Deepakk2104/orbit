import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import organizationRoutes from "../modules/organizations/organizations.routes.js";
import invitationRoutes from "../modules/invitations/invitations.routes.js";
import projectRoutes from "../modules/projects/projects.routes.js";
import boardRoutes from "../modules/boards/boards.routes.js";
import columnRoutes from "../modules/columns/columns.routes.js";
import taskRoutes from "../modules/tasks/tasks.routes.js";
import userRoutes from "../modules/users/users.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/organizations/:orgId/projects", projectRoutes);
router.use("/organizations/:orgId/projects/:projectId/board", boardRoutes);
router.use(
  "/organizations/:orgId/projects/:projectId/board/columns",
  columnRoutes
);
router.use("/organizations/:orgId/projects/:projectId", taskRoutes);
router.use("/invitations", invitationRoutes);
router.use("/users", userRoutes);

export default router;
