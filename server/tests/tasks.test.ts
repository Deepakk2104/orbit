import { describe, it, expect } from "vitest";
import request from "supertest";
import {
  appInstance,
  createUser,
  createOrganization,
  createProject,
  createTask,
} from "./helpers.js";

const setupBoard = async () => {
  const user = await createUser();
  const org = await createOrganization(user.accessToken);
  const project = await createProject(user.accessToken, org.id);

  const boardRes = await request(appInstance)
    .post(`/api/organizations/${org.id}/projects/${project.id}/board`)
    .set("Authorization", `Bearer ${user.accessToken}`)
    .send({});

  const columns = boardRes.body.data.columns;

  return { user, org, project, columns };
};

describe("Tasks", () => {
  it("creates a task in a column", async () => {
    const { user, org, project, columns } = await setupBoard();

    const res = await request(appInstance)
      .post(
        `/api/organizations/${org.id}/projects/${project.id}/board/columns/${columns[0].id}/tasks`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ title: "First task", priority: "HIGH" });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("First task");
    expect(res.body.data.priority).toBe("HIGH");
    expect(res.body.data.position).toBe(0);
  });

  it("assigns sequential positions within a column", async () => {
    const { user, org, project, columns } = await setupBoard();

    await createTask(user.accessToken, org.id, project.id, columns[0].id, "A");
    const second = await createTask(
      user.accessToken,
      org.id,
      project.id,
      columns[0].id,
      "B"
    );

    expect(second.position).toBe(1);
  });

  it("updates a task", async () => {
    const { user, org, project, columns } = await setupBoard();
    const task = await createTask(
      user.accessToken,
      org.id,
      project.id,
      columns[0].id,
      "Original"
    );

    const res = await request(appInstance)
      .patch(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ title: "Updated", priority: "LOW" });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated");
    expect(res.body.data.priority).toBe("LOW");
  });

  it("deletes a task", async () => {
    const { user, org, project, columns } = await setupBoard();
    const task = await createTask(
      user.accessToken,
      org.id,
      project.id,
      columns[0].id,
      "Doomed"
    );

    const res = await request(appInstance)
      .delete(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}`
      )
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(res.status).toBe(200);
  });

  it("moves a task within the same column", async () => {
    const { user, org, project, columns } = await setupBoard();

    const a = await createTask(
      user.accessToken,
      org.id,
      project.id,
      columns[0].id,
      "A"
    );
    const b = await createTask(
      user.accessToken,
      org.id,
      project.id,
      columns[0].id,
      "B"
    );

    const res = await request(appInstance)
      .patch(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${a.id}/move`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ columnId: columns[0].id, position: 1 });

    expect(res.status).toBe(200);

    const board = await request(appInstance)
      .get(`/api/organizations/${org.id}/projects/${project.id}/board`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    const tasks = board.body.data.columns[0].tasks;
    expect(tasks.find((t: { id: string }) => t.id === a.id).position).toBe(1);
    expect(tasks.find((t: { id: string }) => t.id === b.id).position).toBe(0);
  });

  it("moves a task across columns", async () => {
    const { user, org, project, columns } = await setupBoard();

    const task = await createTask(
      user.accessToken,
      org.id,
      project.id,
      columns[0].id,
      "Moving"
    );

    const res = await request(appInstance)
      .patch(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/move`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ columnId: columns[1].id, position: 0 });

    expect(res.status).toBe(200);

    const board = await request(appInstance)
      .get(`/api/organizations/${org.id}/projects/${project.id}/board`)
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(board.body.data.columns[0].tasks).toHaveLength(0);
    expect(board.body.data.columns[1].tasks).toHaveLength(1);
    expect(board.body.data.columns[1].tasks[0].id).toBe(task.id);
  });

  it("rejects a task in a column from another project", async () => {
    const { user, org, project } = await setupBoard();
    const otherProject = await createProject(user.accessToken, org.id, "Other");

    const otherBoard = await request(appInstance)
      .post(`/api/organizations/${org.id}/projects/${otherProject.id}/board`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({});

    const otherColumnId = otherBoard.body.data.columns[0].id;

    const res = await request(appInstance)
      .post(
        `/api/organizations/${org.id}/projects/${project.id}/board/columns/${otherColumnId}/tasks`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ title: "Bad" });

    expect(res.status).toBe(404);
  });
});
