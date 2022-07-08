import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import {
  connectDatabase,
  fillUserCollection,
  clearDatabase,
  user1,
  user2,
} from "./fixtures/db";

beforeAll(async () => {
  try {
    await connectDatabase();
    await clearDatabase();
    await fillUserCollection();
  } catch (err: any) {
    console.error(err.message);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Registration", () => {
  it("Should success register a user with valid email and password", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "lorem@gmail.com", password: "@Lorem123" });

    const user = await User.findOne({ email: "lorem@gmail.com" });

    expect(response.statusCode).toBe(201);
    expect(user).not.toBeNull();
  });

  it("Should fail register a user with the same email", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "lorem@gmail.com", password: "@Lorem123" });

    const users = await User.find({ email: "user1@gmail.com" });

    expect(response.statusCode).toBe(500);
    expect(users.length).toBe(1);
  });

  it("Should fail register a user with invalid email", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "dolor@gmailcom", password: "@Dolor123" });

    const user = await User.findOne({ email: "dolor@gmailcom" });

    expect(response.statusCode).toBe(400);
    expect(user).toBeNull();
  });

  it("Should fail register a user with weak password", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "dolor@gmail.com", password: "12345678" });

    const user = await User.findOne({ email: "dolor@gmail.com" });

    expect(response.statusCode).toBe(400);
    expect(user).toBeNull();
  });
});

describe("User Login", () => {
  it("Should log user in with correct credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@gmail.com", password: "@User1123" });

    expect(response.statusCode).toBe(200);
    expect(response.body.user._id).toBe(user1.id);
  });

  it("Should not log user in when password credentials is wrong", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "user2@gmail.com", password: "ThisIsInvalidPassword" });

    const user = await User.findOne({ email: "user2@gmail.com" });

    expect(response.statusCode).toBe(401);
    expect(user!.tokens.slice(-1).toString()).toBe(user2.tokens[0]);
  });
});

describe("User Logout", () => {
  it("Should logout user", async () => {
    const response = await request(app)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${user2.tokens[0]}`);

    const user = await User.findOne({ email: "user2@gmail.com" });

    expect(response.statusCode).toBe(200);
    expect(user!.tokens.length).toBe(0);
  });
});

describe("Getting current user information", () => {
  it("Should response with current user information", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${user1.tokens[0]}`);

    expect(response.body._id).toBe(user1.id);
  });
});
