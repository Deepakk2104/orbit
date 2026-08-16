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
} from "./organizations.controller.js";
import {
  invite,
  listMembers,
  removeMember,
} from "../invitations/invitations.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", create);
router.get("/", list);

router.get("/:orgId", authorizeMember, getById);
router.patch("/:orgId", authorizeMember, requireOwner, update);
router.delete("/:orgId", authorizeMember, requireOwner, remove);

router.post("/:orgId/invitations", authorizeMember, requireOwner, invite);
router.get("/:orgId/members", authorizeMember, listMembers);
router.delete(
  "/:orgId/members/:memberId",
  authorizeMember,
  requireOwner,
  removeMember
);

export default router;