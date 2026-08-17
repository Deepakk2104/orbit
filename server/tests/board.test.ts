import { describe, it, expect } from "vitest";
import request from "supertest";
import {
  appInstance,
  createUser,
  createOrganization,
  createProject,
} from "./helpers.js";

describe("Kanban board & columns", () => {
  describe("Board", () => {
    it("creates a board with default columns", async () => {
      const user = await createUser();
      const org = await createOrganization(user.accessToken);
      const project = await createProject(user.accessToken, org.id);

      const res = await request(appInstance)
        .post(`/api/organizations/${org.id}/projects/${project.id}/board`)
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({});

      expect(res.status).toBe(201);
      expect(
        res.body.data.columns.map((c: { name: string }) => c.name)
      ).toEqual(["To Do", "In Progress", "Done"]);
    });

    it("gets the board with columns", async () => {
      const user = await createUser();
      const org = await createOrganization(user.accessToken);
      const project = await createProject(user.accessToken, org.id);

      await request(appInstance)
        .post(`/api/organizations/${org.id}/projects/${project.id}/board`)
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({});

      const res = await request(appInstance)
        .get(`/api/organizations/${org.id}/projects/${project.id}/board`)
        .set("Authorization", `Bearer ${user.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.columns).toHaveLength(3);
    });
  });

  describe("Columns", () => {
    it("creates a custom column", async () => {
      const user = await createUser();
      const org = await createOrganization(user.accessToken);
      const project = await createProject(user.accessToken, org.id);

      await request(appInstance)
        .post(`/api/organizations/${org.id}/projects/${project.id}/board`)
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({});

      const res = await request(appInstance)
        .post(
          `/api/organizations/${org.id}/projects/${project.id}/board/columns`
        )
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({ name: "Backlog" });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Backlog");
      expect(res.body.data.position).toBe(3);
    });

    it("renames a column", async () => {
      const user = await createUser();
      const org = await createOrganization(user.accessToken);
      const project = await createProject(user.accessToken, org.id);

      const boardRes = await request(appInstance)
        .post(`/api/organizations/${org.id}/projects/${project.id}/board`)
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({});

      const columnId = boardRes.body.data.columns[0].id;

      const res = await request(appInstance)
        .patch(
          `/api/organizations/${org.id}/projects/${project.id}/board/columns/${columnId}`
        )
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({ name: "Renamed" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Renamed");
    });

    it("deletes a column and compacts positions", async () => {
      const user = await createUser();
      const org = await createOrganization(user.accessToken);
      const project = await createProject(user.accessToken, org.id);

      const boardRes = await request(appInstance)
        .post(`/api/organizations/${org.id}/projects/${project.id}/board`)
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send({});

      const firstId = boardRes.body.data.columns[0].id;

      const res = await request(appInstance)
        .delete(
          `/api/organizations/${org.id}/projects/${project.id}/board/columns/${firstId}`
        )
        .set("Authorization", `Bearer ${user.accessToken}`);

      expect(res.status).toBe(200);

      const board = await request(appInstance)
        .get(`/api/organizations/${org.id}/projects/${project.id}/board`)
        .set("Authorization", `Bearer ${user.accessToken}`);

      expect(board.body.data.columns).toHaveLength(2);
      expect(board.body.data.columns[0].position).toBe(0);
    });
  });
});
