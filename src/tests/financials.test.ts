import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Financial from "../models/Financial";
import {
  clearDatabase,
  connectDatabase,
  fillFinancialCollection,
  fillUserCollection,
  financialRecord1,
  financialRecord2,
  financialRecord3,
  user1,
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

describe("Create New Financial Records", () => {
  beforeAll(async () => {
    try {
      await clearDatabase();
      await fillUserCollection();
    } catch (err: any) {
      console.error(err.message);
    }
  });

  test("Should fail because there is no authorization token", async () => {
    const res = await request(app)
      .post("/api/financials")
      .send({ type: "income", value: 10000, description: "FAILED" });

    const financialRecords = await Financial.find({});

    expect(res.statusCode).toBe(401);
    expect(financialRecords.length).toBe(0);
  });

  test("Should fail because authorization token not belong to any user", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmM5MzYyZjVmMjBiZjQ2YmZiYzg3NmYiLCJpYXQiOjE2NTczNTM3NzV9.5IW8s4d8XhusI_4hEn7Pix01rL-VpVfbX54OBdxFrgc"
      )
      .send({ type: "income", value: 10000, description: "FAILED" });

    const financialRecords = await Financial.find({});

    expect(res.statusCode).toBe(401);
    expect(financialRecords.length).toBe(0);
  });

  test("Should fail because the record type is not income/outcome", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "anotherType", value: 10000, description: "FAILED" });

    const financialRecords = await Financial.find({});

    expect(res.statusCode).toBe(400);
    expect(financialRecords.length).toBe(0);
  });

  test("Should fail because the value type is array", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: [10000], description: "FAILED" });

    const financialRecords = await Financial.find({});

    expect(res.statusCode).toBe(400);
    expect(financialRecords.length).toBe(0);
  });

  test("Should fail because the value type is object", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "income",
        value: { total: 10000 },
        description: "FAILED",
      });

    const financialRecords = await Financial.find({});

    expect(res.statusCode).toBe(400);
    expect(financialRecords.length).toBe(0);
  });

  test("Should fail because value type is boolean", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: true, description: "FAILED" });

    const financialRecords = await Financial.find({});

    expect(res.statusCode).toBe(400);
    expect(financialRecords.length).toBe(0);
  });

  test("Should fail because value is negative number", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: -10000, description: "FAILED" });

    const financialRecords = await Financial.find({});

    expect(res.statusCode).toBe(400);
    expect(financialRecords.length).toBe(0);
  });

  test("Should success with record type as income", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: 10000, description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with record type as outcome", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "outcome", value: 10000, description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with value type as a numeric string and record type as income", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: "10000", description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with value type as a numeric string and record type as outcome", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "outcome", value: "10000", description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with value type as a floating point number string and record type as income", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: "3.1415", description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with value type as a floating point number string and record type as outcome", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "outcome", value: "3.1415", description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with value type as floating point number and record type as income", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: 3.1415, description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with value type as floating point number and record type as outcome", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "outcome", value: 3.1415, description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with value type as a number and record type as income", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: 10000, description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with value type as a number and record type as outcome", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "outcome", value: 10000, description: "SUCCESS" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success without description", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: 10000 });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
  });

  test("Should success with valid body and the description is escaped", async () => {
    const res = await request(app)
      .post("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({ type: "income", value: 10000, description: "<>" });

    const financialRecord = await Financial.findById(res.body._id);

    expect(res.statusCode).toBe(201);
    expect(financialRecord).not.toBeNull();
    expect(financialRecord!.description).not.toBe("<>");
  });
});

describe("Get User Financial Records", () => {
  beforeAll(async () => {
    try {
      await clearDatabase();
      await fillUserCollection();
      await fillFinancialCollection();
    } catch (err: any) {
      console.error(err.message);
    }
  });

  test("Should fail because there is no authorization token", async () => {
    const res = await request(app).get("/api/financials");

    expect(res.statusCode).toBe(401);
  });

  test("Should fail because authorization token is not belong to any user", async () => {
    const res = await request(app)
      .get("/api/financials")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmM5MzYyZjVmMjBiZjQ2YmZiYzg3NmYiLCJpYXQiOjE2NTczNTM3NzV9.5IW8s4d8XhusI_4hEn7Pix01rL-VpVfbX54OBdxFrgc"
      );

    expect(res.statusCode).toBe(401);
  });

  test("Should success returning financial for spesific user", async () => {
    const res = await request(app)
      .get("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]._id).toBe(financialRecord1._id.toString());
    expect(res.body[1]._id).toBe(financialRecord2._id.toString());
    expect(res.body[2]._id).toBe(financialRecord3._id.toString());
    expect(res.body[3]).toBeUndefined();
  });
});
