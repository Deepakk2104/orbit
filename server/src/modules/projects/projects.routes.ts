import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  authorizeMember,
  requireOwner,
} from "../../middlewares/authorize.js";
import {
  create,
  getById,
  list,
  remove,
  update,
} from "./projects.controller.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post("/", authorizeMember, create);
router.get("/", authorizeMember, list);

router.get("/:projectId", authorizeMember, getById);
router.patch("/:projectId", authorizeMember, update);
router.delete("/:projectId", authorizeMember, requireOwner, remove);

export default router;