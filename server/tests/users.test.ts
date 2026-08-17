import { describe, it, expect } from "vitest";
import request from "supertest";
import { appInstance, createUser, registerUser } from "./helpers.js";

describe("Users / Profile", () => {
  it("updates the user's name and avatar", async () => {
    const user = await createUser("Before");

    const res = await request(appInstance)
      .patch("/api/users/profile")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ name: "After", avatar: "https://example.com/avatar.png" });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("After");
    expect(res.body.data.avatar).toBe("https://example.com/avatar.png");
  });

  it("changes the user's password with a valid current password", async () => {
    const user = await createUser();

    const res = await request(appInstance)
      .patch("/api/users/password")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ currentPassword: "password123", newPassword: "newpassword123" });

    expect(res.status).toBe(200);

    const loginRes = await request(appInstance)
      .post("/api/auth/login")
      .send({ email: user.email, password: "newpassword123" });

    expect(loginRes.status).toBe(200);
  });

  it("rejects a password change with the wrong current password", async () => {
    const user = await createUser();

    const res = await request(appInstance)
      .patch("/api/users/password")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ currentPassword: "wrong", newPassword: "newpassword123" });

    expect(res.status).toBe(400);
  });
});
