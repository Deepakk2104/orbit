import { describe, it, expect } from "vitest";
import request from "supertest";
import {
  appInstance,
  createUser,
  createOrganization,
  createProject,
  createTask,
  registerUser,
} from "./helpers.js";

const setupTask = async () => {
  const user = await createUser();
  const org = await createOrganization(user.accessToken);
  const project = await createProject(user.accessToken, org.id);

  const boardRes = await request(appInstance)
    .post(`/api/organizations/${org.id}/projects/${project.id}/board`)
    .set("Authorization", `Bearer ${user.accessToken}`)
    .send({});

  const column = boardRes.body.data.columns[0];
  const task = await createTask(
    user.accessToken,
    org.id,
    project.id,
    column.id,
    "Task with comments"
  );

  return { user, org, project, task };
};

describe("Comments", () => {
  it("creates a comment on a task", async () => {
    const { user, org, project, task } = await setupTask();

    const res = await request(appInstance)
      .post(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/comments`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ content: "First comment" });

    expect(res.status).toBe(201);
    expect(res.body.data.content).toBe("First comment");
    expect(res.body.data.user.id).toBe(user.id);
  });

  it("lists comments on a task", async () => {
    const { user, org, project, task } = await setupTask();

    await request(appInstance)
      .post(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/comments`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ content: "One" });

    await request(appInstance)
      .post(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/comments`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ content: "Two" });

    const res = await request(appInstance)
      .get(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/comments`
      )
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("lets the author delete their own comment", async () => {
    const { user, org, project, task } = await setupTask();

    const createRes = await request(appInstance)
      .post(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/comments`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ content: "Delete me" });

    const commentId = createRes.body.data.id;

    const res = await request(appInstance)
      .delete(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/comments/${commentId}`
      )
      .set("Authorization", `Bearer ${user.accessToken}`);

    expect(res.status).toBe(200);
  });

  it("forbids deleting someone else's comment", async () => {
    const { user, org, project, task } = await setupTask();

    const createRes = await request(appInstance)
      .post(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/comments`
      )
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ content: "Mine" });

    const commentId = createRes.body.data.id;

    const otherUser = await registerUser("Other", "other@example.com");

    const res = await request(appInstance)
      .delete(
        `/api/organizations/${org.id}/projects/${project.id}/tasks/${task.id}/comments/${commentId}`
      )
      .set("Authorization", `Bearer ${otherUser.accessToken}`);

    expect(res.status).toBe(403);
  });
});
