import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import organizationRoutes from "../modules/organizations/organizations.routes.js";
import invitationRoutes from "../modules/invitations/invitations.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/invitations", invitationRoutes);

export default router;