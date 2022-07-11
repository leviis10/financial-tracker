import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import {
  connectDatabase,
  fillUserCollection,
  clearDatabase,
  user1,
  anonymousToken,
} from "./fixtures/db";

beforeAll(async () => {
  try {
    await connectDatabase();
  } catch (err: any) {
    console.error(err.message);
  }
});

afterAll(() => {
  mongoose.connection.close();
});

describe("User Registration", () => {
  beforeAll(async () => {
    try {
      await clearDatabase();
      await fillUserCollection();
    } catch (err: any) {
      console.error(err.message);
    }
  });

  test("Should fail because there is no body", async () => {
    const res = await request(app).post("/api/users");

    expect(res.statusCode).toBe(400);
  });

  test("Should fail because there is no password", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "lorem@gmail.com" });

    const user = await User.findOne({ email: "lorem@gmail.com" });

    expect(res.statusCode).toBe(400);
    expect(user).toBeNull();
  });

  test("Should fail because password in not strong enought", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "lorem@gmail.com", password: "12345678" });

    const user = await User.findOne({ email: "lorem@gmail.com" });

    expect(res.statusCode).toBe(400);
    expect(user).toBeNull();
  });

  test("Should fail because there is no email", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ password: "@Lorem123" });

    expect(res.statusCode).toBe(400);
  });

  test("Should fail because email is invalid", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "lorem@gmailcom", password: "@Lorem123" });

    const user = await User.findOne({ email: "lorem@gmailcom" });

    expect(res.statusCode).toBe(400);
    expect(user).toBeNull();
  });

  test("Should fail because user is already exists", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "user1@gmail.com", password: "@User112345678" });

    const users = await User.find({ email: "user1@gmail.com" });

    expect(res.statusCode).toBe(500);
    expect(users!.length).toBe(1);
  });

  test("Should success because valid email and strong password", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "lorem@gmail.com", password: "@Lorem123" });

    const user = await User.findOne({ email: "lorem@gmail.com" });

    expect(res.statusCode).toBe(201);
    expect(user).not.toBeNull();
    expect(user!.password).not.toBe("@Lorem123");
    expect(user!.tokens.length).toBe(1);
  });
});

describe("User Login", () => {
  beforeAll(async () => {
    try {
      await clearDatabase();
      await fillUserCollection();
    } catch (err: any) {
      console.error(err.message);
    }
  });

  test("Should fail because there is no body", async () => {
    const res = await request(app).post("/api/users/login");

    expect(res.statusCode).toBe(400);
  });

  test("Should fail because there is no email", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ password: "@User1123" });

    expect(res.statusCode).toBe(400);
  });

  test("Should fail because there is no password", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com" });

    const user = await User.findOne({ email: "user1@gmail.com" });

    expect(res.statusCode).toBe(400);
    expect(user!.tokens.length).toBe(1);
  });

  test("Should fail because email is wrong", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.comm", password: "@User1123" });

    expect(res.statusCode).toBe(401);
  });

  test("Should fail because password is wrong", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "@User11233" });

    const user = await User.findOne({ email: "user1@gmail.com" });

    expect(res.statusCode).toBe(401);
    expect(user!.tokens.length).toBe(1);
  });

  test("Should success because valid email and password", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "@User1123" });

    const user = await User.findOne({ email: "user1@gmail.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user._id).toBe(user!.id);
    expect(user!.tokens.length).toBe(2);
  });
});

describe("User Logout", () => {
  beforeAll(async () => {
    try {
      await clearDatabase();
      await fillUserCollection();
    } catch (err: any) {
      console.error(err.message);
    }
  });

  test("Should fail because token authorization in not set", async () => {
    const res = await request(app).post("/api/users/logout");

    expect(res.statusCode).toBe(401);
  });

  test("Should fail because token authorization is not belong to any user", async () => {
    const res = await request(app)
      .post("/api/users/logout")
      .set("Authorization", anonymousToken);

    const user = await User.findOne({ email: "user1@gmail.com" });

    expect(res.statusCode).toBe(401);
    expect(user!.tokens.length).toBe(1);
  });

  test("Should success because token authorization is valid", async () => {
    const res = await request(app)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${user1.tokens[0]}`);

    const user = await User.findOne({ email: "user1@gmail.com" });

    expect(res.statusCode).toBe(200);
    expect(user!.tokens.length).toBe(0);
  });
});

describe("Get User Information", () => {
  beforeAll(async () => {
    try {
      await clearDatabase();
      await fillUserCollection();
    } catch (err: any) {
      console.error(err.message);
    }
  });

  test("Should fail because there is no autorization token", async () => {
    const res = await request(app).get("/api/users/me");

    expect(res.statusCode).toBe(401);
  });

  test("Should fail because authorization token not belong to any user", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", anonymousToken);

    expect(res.statusCode).toBe(401);
  });

  test("Should success because authorization token is valid", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${user1.tokens[0]}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(user1._id.toString());
  });
});
