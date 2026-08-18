import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeMember } from "../../middlewares/authorize.js";
import { getByOrg } from "./dashboard.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", authorizeMember, getByOrg);

export default router;
