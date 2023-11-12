import request from "supertest";
import { app } from "../../app";

it("returns a 201 after on successful signup", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "testtest.com",
      password: "password123",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "q",
    })
    .expect(400);
});

it("returns a 400 when missing email", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      password: "password123",
    })
    .expect(400);
});

it("returns a 400 when missing password", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(201);

  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(400);
});

it("returs a cookie after succesfull sign up", async () => {
  const response = await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password123",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
