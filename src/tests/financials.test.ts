import mongoose from "mongoose";
import request from "supertest";
import Financial from "../models/Financial";
import User from "../models/User";
import app from "../app";
import { connectDatabase, user1, user2 } from "./fixtures/db";

beforeAll(async () => {
  try {
    // Connect to the Database
    await connectDatabase();

    // Reset Database Collections
    await User.deleteMany({});
    await Financial.deleteMany({});

    // Fill Database Collections
    await user1.save();
    await user2.save();
  } catch (err: any) {
    console.error(err.message);
  }
});

afterAll(() => {
  mongoose.connection.close();
});

describe("Create new income", () => {
  // Test Success Case
  it("Should success create new income with type, value, and description", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "income",
        value: 10000,
        description: "this is the description",
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  it("Should success create new income without description", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "income",
        value: 10000,
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  it("Should success create new income and success escaped the description", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "income",
        value: 10000,
        description: "<",
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial!.description).not.toBe("<");
  });

  it("Should success create new income with floating point number value", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "income",
        value: 3.1415,
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  it("Should success create new income with number value as a string", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "income",
        value: "10000",
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  it("Should success create new income with floating point number value as a string", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "income",
        value: "3.1415",
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  // Test Fail Case
  it("Should fail create new income because value is non-numeric string", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "income",
        value: "hello",
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });

  it("Should fail create new income because value is boolean", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "income",
        value: true,
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });

  it("Should fail create new income because value is array", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "income",
        value: [10000],
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });

  it("Should fail create new income because value is object", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "income",
        value: { key: 10000 },
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });

  it("Should fail create new income because there is no value", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "income",
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });
});

describe("Create new outcome", () => {
  // Test Success Case
  it("Should success create new outcome with type, value, and description", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 10000,
        description: "this is the description",
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  it("Should success create new outcome without description", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 10000,
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  it("Should success create new outcome and success escaped the description", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 10000,
        description: "<",
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial!.description).not.toBe("<");
  });

  it("Should success create new outcome with floating point number value", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 3.1415,
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  it("Should success create new outcome with number value as a string", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: "10000",
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  it("Should success create new outcome with floating point number value as a string", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: "3.1415",
      });

    const financial = await Financial.findById(response.body._id);

    expect(response.statusCode).toBe(201);
    expect(financial).not.toBeNull();
  });

  // Test Fail Case
  it("Should fail create new outcome because value is non-numeric string", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "outcome",
        value: "hello",
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });

  it("Should fail create new outcome because value is boolean", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "outcome",
        value: true,
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });

  it("Should fail create new outcome because value is array", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "outcome",
        value: [10000],
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });

  it("Should fail create new outcome because value is object", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "outcome",
        value: { key: 10000 },
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });

  it("Should fail create new outcome because there is no value", async () => {
    const response = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "outcome",
      });

    const financial = await Financial.findOne({ user: user2.id });

    expect(response.statusCode).toBe(400);
    expect(financial).toBeNull();
  });
});
