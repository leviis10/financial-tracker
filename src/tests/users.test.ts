import path from "path";
import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../app";
import User from "../models/User";

beforeAll(async () => {
  try {
    // Set environment variable
    dotenv.config({
      path: path.join(__dirname, "..", "..", "env", "test.env"),
    });

    // Connect to the database
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to the database");

    // Fill database with user
    const user1 = new User({
      email: "lorem@gmail.com",
      password: "@Lorem123",
    });
    user1.generateToken();
    await user1.save();
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
});

afterAll(async () => {
  await User.deleteMany({});
  mongoose.connection.close();
});

describe("User Registration", () => {
  it("Should success register a user with valid email and password", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "ipsum@gmail.com", password: "@Ipsum123" });

    const ipsum = await User.findOne({ email: "ipsum@gmail.com" });

    expect(response.statusCode).toBe(201);
    expect(ipsum).not.toBeNull();
  });

  it("Should fail register a user with the same email", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "ipsum@gmail.com", password: "@Ipsum123" });

    const ipsums = await User.find({ email: "ipsum@gmail.com" });

    expect(response.statusCode).toBe(500);
    expect(ipsums.length).toBe(1);
  });

  it("Should fail register a user with invalid email", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "dolor@gmailcom", password: "@Dolor123" });

    const dolor = await User.findOne({ email: "dolor@gmail.com" });

    expect(response.statusCode).toBe(400);
    expect(dolor).toBeNull();
  });

  it("Should fail register a user with weak password", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ email: "dolor@gmail.com", password: "123456789" });

    const dolor = await User.findOne({ email: "dolor@gmail.com" });

    expect(response.statusCode).toBe(400);
    expect(dolor).toBeNull();
  });
});

describe("User Login", () => {
  it("Should log user in with correct credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "lorem@gmail.com", password: "@Lorem123" });

    const user = await User.findOne({ email: "lorem@gmail.com" });

    expect(response.statusCode).toBe(200);
    expect(user!.tokens.slice(-1).toString()).toBe(response.body.token);
  });

  it("Should not log user in when password credentials is wrong", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "lorem@gmail.com", password: "ThisIsInvalidPassword" });

    const lorem = await User.findOne({ email: "lorem@gmail.com" });

    expect(response.statusCode).toBe(401);
    expect(lorem!.tokens.length).toBe(2);
  });
});

describe("User Logout", () => {
  it("Should logout user", async () => {
    const user = await User.findOne({ email: "lorem@gmail.com" });

    const response = await request(app)
      .post("/api/users/logout")
      .set("Authorization", `Bearer ${user!.tokens[0]}`);

    const userAfterResponse = await User.findOne({
      email: "lorem@gmail.com",
      tokens: user!.tokens[0],
    });

    expect(response.statusCode).toBe(200);
    expect(userAfterResponse).toBeNull();
  });
});

describe("Getting current user information", () => {
  it("Should response with current user information", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.body._id).not.toBeNull();
  });
});
