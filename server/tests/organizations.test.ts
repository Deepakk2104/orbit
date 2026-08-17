import { describe, it, expect } from "vitest";
import request from "supertest";
import {
  appInstance,
  createUser,
  createOrganization,
  registerUser,
  login,
} from "./helpers.js";

describe("Organizations", () => {
  describe("POST /api/organizations", () => {
    it("creates an organization and assigns the creator as OWNER", async () => {
      const user = await createUser("Owner");

      const res = await request(appInstance)
        .post("/api/organizations")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({ name: "Acme Corp" });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Acme Corp");
      expect(res.body.data.role).toBe("OWNER");
      expect(res.body.data.slug).toBe("acme-corp");
    });

    it("generates a slug from the name", async () => {
      const user = await createUser();
      const res = await request(appInstance)
        .post("/api/organizations")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({ name: "My Great Company!" });

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe("my-great-company");
    });

    it("requires authentication", async () => {
      const res = await request(appInstance)
        .post("/api/organizations")
        .send({ name: "No Auth" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/organizations", () => {
    it("lists only the user's organizations", async () => {
      const user = await createUser("Lister");

      await createOrganization(user.accessToken, "First Org");
      await createOrganization(user.accessToken, "Second Org");

      const res = await request(appInstance)
        .get("/api/organizations")
        .set("Authorization", `Bearer ${user.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe("GET /api/organizations/:orgId", () => {
    it("returns the organization with its members", async () => {
      const owner = await createUser("Org Owner");
      const org = await createOrganization(owner.accessToken, "Detail Org");

      const res = await request(appInstance)
        .get(`/api/organizations/${org.id}`)
        .set("Authorization", `Bearer ${owner.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(org.id);
      expect(res.body.data.role).toBe("OWNER");
      expect(res.body.data.members).toHaveLength(1);
      expect(res.body.data.members[0].user.email).toBe(owner.email);
    });

    it("forbids access for a non-member", async () => {
      const owner = await createUser();
      const stranger = await createUser();
      const org = await createOrganization(owner.accessToken);

      const res = await request(appInstance)
        .get(`/api/organizations/${org.id}`)
        .set("Authorization", `Bearer ${stranger.accessToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("PATCH /api/organizations/:orgId", () => {
    it("allows an owner to update the organization", async () => {
      const owner = await createUser();
      const org = await createOrganization(owner.accessToken, "Before");

      const res = await request(appInstance)
        .patch(`/api/organizations/${org.id}`)
        .set("Authorization", `Bearer ${owner.accessToken}`)
        .send({ name: "After" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("After");
      expect(res.body.data.slug).toBe("after");
    });

    it("forbids a member from updating", async () => {
      const owner = await createUser();
      const member = await createUser();
      const org = await createOrganization(owner.accessToken);

      await request(appInstance)
        .post(`/api/organizations/${org.id}/invitations`)
        .set("Authorization", `Bearer ${owner.accessToken}`)
        .send({ email: member.email });

      const res = await request(appInstance)
        .patch(`/api/organizations/${org.id}`)
        .set("Authorization", `Bearer ${member.accessToken}`)
        .send({ name: "Hacked" });

      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /api/organizations/:orgId", () => {
    it("allows an owner to delete the organization", async () => {
      const owner = await createUser();
      const org = await createOrganization(owner.accessToken);

      const res = await request(appInstance)
        .delete(`/api/organizations/${org.id}`)
        .set("Authorization", `Bearer ${owner.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe("Invitations & members", () => {
  it("invites a new user by email", async () => {
    const owner = await createUser();
    const org = await createOrganization(owner.accessToken);

    const res = await request(appInstance)
      .post(`/api/organizations/${org.id}/invitations`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ email: "invitee@example.com" });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("invitee@example.com");
  });

  it("prevents inviting someone who is already a member", async () => {
    const owner = await createUser();
    const member = await createUser();
    const org = await createOrganization(owner.accessToken);

    const inviteRes = await request(appInstance)
      .post(`/api/organizations/${org.id}/invitations`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ email: member.email });

    const token = inviteRes.body.data.token;

    await request(appInstance)
      .post(`/api/invitations/${token}/accept`)
      .set("Authorization", `Bearer ${member.accessToken}`);

    const res = await request(appInstance)
      .post(`/api/organizations/${org.id}/invitations`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ email: member.email });

    expect(res.status).toBe(409);
  });

  it("accepts an invitation and joins the organization", async () => {
    const owner = await createUser();
    const org = await createOrganization(owner.accessToken);
    const invitee = await registerUser("Invitee", "join@example.com");

    const inviteRes = await request(appInstance)
      .post(`/api/organizations/${org.id}/invitations`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ email: "join@example.com" });

    const token = inviteRes.body.data.token;

    const acceptRes = await request(appInstance)
      .post(`/api/invitations/${token}/accept`)
      .set("Authorization", `Bearer ${invitee.accessToken}`);

    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.data.role).toBe("MEMBER");
    expect(acceptRes.body.data.organization.name).toBe(org.name);

    const membersRes = await request(appInstance)
      .get(`/api/organizations/${org.id}/members`)
      .set("Authorization", `Bearer ${owner.accessToken}`);

    expect(membersRes.body.data).toHaveLength(2);
  });

  it("rejects an already-used invitation", async () => {
    const owner = await createUser();
    const org = await createOrganization(owner.accessToken);
    await registerUser("Invitee", "used@example.com");

    const inviteRes = await request(appInstance)
      .post(`/api/organizations/${org.id}/invitations`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ email: "used@example.com" });

    const token = inviteRes.body.data.token;

    const invitee = await login("used@example.com");

    await request(appInstance)
      .post(`/api/invitations/${token}/accept`)
      .set("Authorization", `Bearer ${invitee.accessToken}`);

    const res = await request(appInstance)
      .post(`/api/invitations/${token}/accept`)
      .set("Authorization", `Bearer ${invitee.accessToken}`);

    expect(res.status).toBe(409);
  });

  it("lists organization members", async () => {
    const owner = await createUser();
    const org = await createOrganization(owner.accessToken);

    const res = await request(appInstance)
      .get(`/api/organizations/${org.id}/members`)
      .set("Authorization", `Bearer ${owner.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("lets the owner remove a member", async () => {
    const owner = await createUser();
    const member = await createUser();
    const org = await createOrganization(owner.accessToken);

    const inviteRes = await request(appInstance)
      .post(`/api/organizations/${org.id}/invitations`)
      .set("Authorization", `Bearer ${owner.accessToken}`)
      .send({ email: member.email });

    const token = inviteRes.body.data.token;

    await request(appInstance)
      .post(`/api/invitations/${token}/accept`)
      .set("Authorization", `Bearer ${member.accessToken}`);

    const membersRes = await request(appInstance)
      .get(`/api/organizations/${org.id}/members`)
      .set("Authorization", `Bearer ${owner.accessToken}`);

    const memberMembership = membersRes.body.data.find(
      (m: { user: { id: string } }) => m.user.id === member.id
    );

    const removeRes = await request(appInstance)
      .delete(`/api/organizations/${org.id}/members/${memberMembership.id}`)
      .set("Authorization", `Bearer ${owner.accessToken}`);

    expect(removeRes.status).toBe(200);

    const membersAfter = await request(appInstance)
      .get(`/api/organizations/${org.id}/members`)
      .set("Authorization", `Bearer ${owner.accessToken}`);

    expect(membersAfter.body.data).toHaveLength(1);
  });
});
