import type { Response } from "express";
import type { OrgRequest } from "../../middlewares/authorize.js";
import {
  acceptInvitation,
  inviteMember,
  listMembers as listOrgMembers,
  removeMember as removeOrgMember,
} from "./invitations.service.js";
import { inviteSchema } from "./validators/invite.validator.js";
import { handleError } from "../../lib/handle-error.js";

export const invite = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId || !req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = inviteSchema.parse(req.body);

    const invitation = await inviteMember(req.orgId, req.userId, data);

    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully.",
      data: invitation,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const accept = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const tokenParam = req.params.token;

    if (typeof tokenParam !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invitation token is required",
      });
    }

    const result = await acceptInvitation(req.userId, tokenParam);

    return res.json({
      success: true,
      message: "You have joined the organization.",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const listMembers = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const members = await listOrgMembers(req.orgId);

    return res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const removeMember = async (req: OrgRequest, res: Response) => {
  try {
    if (!req.orgId || !req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const memberIdParam = req.params.memberId;

    if (typeof memberIdParam !== "string") {
      return res.status(400).json({
        success: false,
        message: "Member id is required",
      });
    }

    await removeOrgMember(req.orgId, memberIdParam, req.userId);

    return res.json({
      success: true,
      message: "Member removed successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};
