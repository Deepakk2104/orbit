import request from "supertest";
import app from "../src/app.js";

export interface TestUser {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface TestOrg {
  id: string;
  name: string;
  slug: string;
}

export interface TestProject {
  id: string;
  name: string;
}

export interface TestBoard {
  id: string;
  projectId: string;
}

export interface TestColumn {
  id: string;
  name: string;
  position: number;
  boardId: string;
}

export interface TestTask {
  id: string;
  title: string;
  columnId: string;
  position: number;
}

export const appInstance = app;

const EMAIL_SEQ = (() => {
  let counter = 0;
  return () => `user${++counter}@example.com`;
})();

const unique = (base: string) =>
  `${base} ${Date.now()}${Math.floor(Math.random() * 10000)}`;

export const registerUser = async (
  name = "Test User",
  email = EMAIL_SEQ()
): Promise<TestUser> => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name, email, password: "password123" });

  if (res.status !== 201) {
    throw new Error(
      `register failed: ${res.status} ${JSON.stringify(res.body)}`
    );
  }

  return login(email, "password123");
};

export const login = async (
  email: string,
  password = "password123"
): Promise<TestUser> => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  if (res.status !== 200) {
    throw new Error(`login failed: ${res.status} ${JSON.stringify(res.body)}`);
  }

  return {
    id: res.body.data.user.id,
    name: res.body.data.user.name,
    email: res.body.data.user.email,
    accessToken: res.body.data.accessToken,
  };
};

export const createUser = async (name = "Test User"): Promise<TestUser> => {
  const user = await registerUser(name);
  return login(user.email);
};

export const createOrganization = async (
  token: string,
  name?: string
): Promise<TestOrg> => {
  const res = await request(app)
    .post("/api/organizations")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: name ?? unique("Org") });

  if (res.status !== 201) {
    throw new Error(
      `createOrganization failed: ${res.status} ${JSON.stringify(res.body)}`
    );
  }

  return res.body.data;
};

export const createProject = async (
  token: string,
  orgId: string,
  name?: string
): Promise<TestProject> => {
  const res = await request(app)
    .post(`/api/organizations/${orgId}/projects`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name: name ?? unique("Project") });

  if (res.status !== 201) {
    throw new Error(
      `createProject failed: ${res.status} ${JSON.stringify(res.body)}`
    );
  }

  return res.body.data;
};

export const createBoard = async (
  token: string,
  orgId: string,
  projectId: string
): Promise<TestBoard> => {
  const res = await request(app)
    .post(`/api/organizations/${orgId}/projects/${projectId}/board`)
    .set("Authorization", `Bearer ${token}`)
    .send({});

  if (res.status !== 201) {
    throw new Error(
      `createBoard failed: ${res.status} ${JSON.stringify(res.body)}`
    );
  }

  return res.body.data;
};

export const createColumn = async (
  token: string,
  orgId: string,
  projectId: string,
  name: string
): Promise<TestColumn> => {
  const res = await request(app)
    .post(`/api/organizations/${orgId}/projects/${projectId}/board/columns`)
    .set("Authorization", `Bearer ${token}`)
    .send({ name });

  if (res.status !== 201) {
    throw new Error(
      `createColumn failed: ${res.status} ${JSON.stringify(res.body)}`
    );
  }

  return res.body.data;
};

export const createTask = async (
  token: string,
  orgId: string,
  projectId: string,
  columnId: string,
  title: string
): Promise<TestTask> => {
  const res = await request(app)
    .post(
      `/api/organizations/${orgId}/projects/${projectId}/board/columns/${columnId}/tasks`
    )
    .set("Authorization", `Bearer ${token}`)
    .send({ title });

  if (res.status !== 201) {
    throw new Error(
      `createTask failed: ${res.status} ${JSON.stringify(res.body)}`
    );
  }

  return res.body.data;
};
