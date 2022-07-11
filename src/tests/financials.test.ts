import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import Financial from "../models/Financial";
import {
  clearDatabase,
  connectDatabase,
  fillFinancialCollection,
  fillUserCollection,
  user1FinancialRecord1,
  user1FinancialRecord2,
  user1FinancialRecord3,
  user1,
  anonymousToken,
  user2,
  anonymousFinancialRecordId,
  user2FinancialRecord1,
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
      .set("Authorization", anonymousToken)
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
      .set("Authorization", anonymousToken);

    expect(res.statusCode).toBe(401);
  });

  test("Should success returning financial for spesific user", async () => {
    const res = await request(app)
      .get("/api/financials")
      .set("Authorization", `Bearer ${user1.tokens[0]}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0]._id).toBe(user1FinancialRecord1._id.toString());
    expect(res.body[1]._id).toBe(user1FinancialRecord2._id.toString());
    expect(res.body[2]._id).toBe(user1FinancialRecord3._id.toString());
    expect(res.body[3]).toBeUndefined();
  });
});

describe("Edit financial records", () => {
  beforeAll(async () => {
    try {
      await clearDatabase();
      await fillUserCollection();
      await fillFinancialCollection();
    } catch (err: any) {
      console.error(err.message);
    }
  });

  test("Should fail because there is no authentication token", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .send({
        type: "outcome",
        value: 99999,
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(401);
    expect(financialRecord!.type).toBe(user1FinancialRecord1.type);
  });

  test("Should fail because auth token not belong to any user", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", anonymousToken)
      .send({
        type: "outcome",
        value: 99999,
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(401);
    expect(financialRecord!.type).toBe(user1FinancialRecord1.type);
  });

  test("Should fail because financial record type edited to neither income/outcome", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "other",
        value: 99999,
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(400);
    expect(financialRecord!.type).toBe(user1FinancialRecord1.type);
  });

  test("Should fail because financial record value edited to array", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: [99999],
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(400);
    expect(financialRecord!.value).toBe(user1FinancialRecord1.value);
  });

  test("Should fail because financial record value edited to object", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: { total: 99999 },
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(400);
    expect(financialRecord!.value).toBe(user1FinancialRecord1.value);
  });

  test("Should fail because financial record value edited to boolean", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: true,
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(400);
    expect(financialRecord!.value).toBe(user1FinancialRecord1.value);
  });

  test("Should fail because financial record value edited to character string", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: "somecharacter",
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(400);
    expect(financialRecord!.value).toBe(user1FinancialRecord1.value);
  });

  test("Should fail because financial record user is edited", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 99999,
        description: "user 1 financial record 1 edited",
        user: user2._id,
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(400);
    expect(financialRecord!.user!.toString()).toBe(user1._id.toString());
  });

  test("Should fail because trying to edit other user financial record", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "outcome",
        value: 99999,
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(404);
    expect(financialRecord!.type).toBe(user1FinancialRecord1.type);
  });

  test("Should fail because there is no financial record", async () => {
    const res = await request(app)
      .patch(`/api/financials/${anonymousFinancialRecordId}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 99999,
        description: "anonymous financial record edited",
      });

    const financialRecord = await Financial.findById(
      anonymousFinancialRecordId
    );

    expect(res.statusCode).toBe(404);
    expect(financialRecord).toBeNull();
  });

  test("Should success edit financial record type to outcome", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 99999,
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(200);
    expect(financialRecord!.type).toBe("outcome");
  });

  test("Should success edit financial record type to income", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user2FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user2.tokens[0]}`)
      .send({
        type: "income",
        value: 99999,
        description: "user 2 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user2FinancialRecord1._id);

    expect(res.statusCode).toBe(200);
    expect(financialRecord!.type).toBe("income");
  });

  test("Should success edit financial record value with numeric string", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: "11111",
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(200);
    expect(financialRecord!.value).toBe(11111);
  });

  test("Should success edit financial record value with floating point number string", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: "99.99",
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(200);
    expect(financialRecord!.value).toBe(99.99);
  });

  test("Should success edit financial record value with floating point number", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 11.11,
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(200);
    expect(financialRecord!.value).toBe(11.11);
  });

  test("Should success edit financial record value with number", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 99999,
        description: "user 1 financial record 1 edited",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(200);
    expect(financialRecord!.value).toBe(99999);
  });

  test("Should success edit and escaped financial record description", async () => {
    const res = await request(app)
      .patch(`/api/financials/${user1FinancialRecord1._id}`)
      .set("Authorization", `Bearer ${user1.tokens[0]}`)
      .send({
        type: "outcome",
        value: 99999,
        description: "<>",
      });

    const financialRecord = await Financial.findById(user1FinancialRecord1._id);

    expect(res.statusCode).toBe(200);
    expect(financialRecord!.description).not.toBe("<>");
  });
});
