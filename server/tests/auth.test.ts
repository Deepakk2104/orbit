import { describe, it, expect } from "vitest";
import request from "supertest";
import { appInstance, createUser, registerUser, login } from "./helpers.js";

describe("Auth", () => {
  describe("POST /api/auth/register", () => {
    it("registers a new user and returns 201", async () => {
      const res = await request(appInstance).post("/api/auth/register").send({
        name: "Alice",
        email: "alice@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        name: "Alice",
        email: "alice@example.com",
      });
      expect(res.body.data).not.toHaveProperty("password");
    });

    it("rejects an invalid email", async () => {
      const res = await request(appInstance).post("/api/auth/register").send({
        name: "Bob",
        email: "not-an-email",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("rejects a short password", async () => {
      const res = await request(appInstance).post("/api/auth/register").send({
        name: "Bob",
        email: "bob@example.com",
        password: "short",
      });

      expect(res.status).toBe(400);
    });

    it("rejects a duplicate email", async () => {
      await request(appInstance).post("/api/auth/register").send({
        name: "Alice",
        email: "dup@example.com",
        password: "password123",
      });

      const res = await request(appInstance).post("/api/auth/register").send({
        name: "Alice2",
        email: "dup@example.com",
        password: "password123",
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain("already");
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in with valid credentials", async () => {
      await registerUser("Carol", "carol@example.com");

      const res = await request(appInstance)
        .post("/api/auth/login")
        .send({ email: "carol@example.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeTruthy();
      expect(res.body.data.user.email).toBe("carol@example.com");
    });

    it("sets a refresh token cookie", async () => {
      await registerUser("Dan", "dan@example.com");

      const res = await request(appInstance)
        .post("/api/auth/login")
        .send({ email: "dan@example.com", password: "password123" });

      const cookies = res.headers["set-cookie"] ?? [];
      expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
    });

    it("rejects wrong password", async () => {
      await registerUser("Eve", "eve@example.com");

      const res = await request(appInstance)
        .post("/api/auth/login")
        .send({ email: "eve@example.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("rejects unknown email", async () => {
      const res = await request(appInstance)
        .post("/api/auth/login")
        .send({ email: "nobody@example.com", password: "password123" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns the current user when authenticated", async () => {
      const user = await createUser("Mallory");

      const res = await request(appInstance)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${user.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(user.id);
      expect(res.body.data.email).toBe(user.email);
    });

    it("returns 401 when no token is provided", async () => {
      const res = await request(appInstance).get("/api/auth/me");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("returns a new access token using the refresh cookie", async () => {
      await registerUser("Frank", "frank@example.com");

      const loginRes = await request(appInstance)
        .post("/api/auth/login")
        .send({ email: "frank@example.com", password: "password123" });

      const cookie = loginRes.headers["set-cookie"][0].split(";")[0];

      const res = await request(appInstance)
        .post("/api/auth/refresh")
        .set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeTruthy();
    });

    it("returns 401 when the refresh cookie is missing", async () => {
      const res = await request(appInstance).post("/api/auth/refresh");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("clears the refresh cookie", async () => {
      const res = await request(appInstance).post("/api/auth/logout");

      expect(res.status).toBe(200);
      const cookies = res.headers["set-cookie"] ?? [];
      expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);
    });
  });

  describe("POST /api/auth/forgot-password & reset-password", () => {
    it("returns a generic message for an unknown email", async () => {
      const res = await request(appInstance)
        .post("/api/auth/forgot-password")
        .send({ email: "ghost@example.com" });

      expect(res.status).toBe(200);
    });

    it("rejects an invalid reset token", async () => {
      const res = await request(appInstance)
        .post("/api/auth/reset-password")
        .send({ token: "not-a-real-token", password: "newpassword123" });

      expect(res.status).toBe(400);
    });
  });

  describe("JWT protection", () => {
    it("rejects an invalid access token", async () => {
      const res = await request(appInstance)
        .get("/api/auth/me")
        .set("Authorization", "Bearer not-a-valid-token");

      expect(res.status).toBe(401);
    });
  });
});
