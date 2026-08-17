import { describe, it, expect } from "vitest";
import request from "supertest";
import {
  appInstance,
  createUser,
  createOrganization,
  createProject,
} from "./helpers.js";

describe("Projects", () => {
  it("creates a project under an organization", async () => {
    const user = await createUser();
    const org = await createOrganization(user.accessToken);

    const res = await request(appInstance)
      .post(`/api/organizations/${org.id}/projects`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ name: "Website Redesign" });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Website Redesign");
  });

  it("lists projects for an organization", async () => {
    const user = await createUser();
    const org = await createOrganization(user.accessToken);

    await createProject(user.accessToken, org.id, "Proj A");
    await createProject(user.accessToken, org.id, "Proj B");

    const res = await request(appInstance)
      .get(`/api/organizations/${org.id}/projects`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("gets a single project", async () => {
    const user = await createUser();
    const org = await createOrganization(user.accessToken);
    const project = await createProject(
      user.accessToken,
      org.id,
      "Detail Proj"
    );

    const res = await request(appInstance)
      .get(`/api/organizations/${org.id}/projects/${project.id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Detail Proj");
  });

  it("updates a project", async () => {
    const user = await createUser();
    const org = await createOrganization(user.accessToken);
    const project = await createProject(user.accessToken, org.id, "Before");

    const res = await request(appInstance)
      .patch(`/api/organizations/${org.id}/projects/${project.id}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ name: "After", description: "Updated description" });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("After");
    expect(res.body.data.description).toBe("Updated description");
  });

  it("deletes a project", async () => {
    const user = await createUser();
    const org = await createOrganization(user.accessToken);
    const project = await createProject(user.accessToken, org.id, "Doomed");

    const res = await request(appInstance)
      .delete(`/api/organizations/${org.id}/projects/${project.id}`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(res.status).toBe(200);
  });

  it("forbids a non-member from accessing a project", async () => {
    const owner = await createUser();
    const stranger = await createUser();
    const org = await createOrganization(owner.accessToken);
    const project = await createProject(owner.accessToken, org.id, "Private");

    const res = await request(appInstance)
      .get(`/api/organizations/${org.id}/projects/${project.id}`)
      .set("Authorization", `Bearer ${stranger.accessToken}`);

    expect(res.status).toBe(403);
  });

  it("returns 404 for a project that does not exist", async () => {
    const user = await createUser();
    const org = await createOrganization(user.accessToken);

    const res = await request(appInstance)
      .get(`/api/organizations/${org.id}/projects/nonexistent`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(res.status).toBe(404);
  });
});
