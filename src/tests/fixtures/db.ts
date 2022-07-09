import path from "path";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../models/User";
import Financial from "../../models/Financial";

dotenv.config({
  path: path.join(__dirname, "..", "..", "..", "env", "test.env"),
});

const user1Id = new mongoose.Types.ObjectId();
export const user1 = {
  _id: user1Id,
  email: "user1@gmail.com",
  password: "@User1123",
  tokens: [jwt.sign({ _id: user1Id }, process.env.JWT_SECRET)],
};

const user2Id = new mongoose.Types.ObjectId();
export const user2 = {
  _id: user2Id,
  email: "user2@gmail.com",
  password: "@User2123",
  tokens: [jwt.sign({ _id: user2Id }, process.env.JWT_SECRET)],
};

const financialRecord1Id = new mongoose.Types.ObjectId();
export const financialRecord1 = {
  _id: financialRecord1Id,
  type: "income",
  value: 10000,
  description: "first financial record for user1",
  user: user1Id,
};

const financialRecord2Id = new mongoose.Types.ObjectId();
export const financialRecord2 = {
  _id: financialRecord2Id,
  type: "income",
  value: 20000,
  description: "second financial record for user1",
  user: user1Id,
};

const financialRecord3Id = new mongoose.Types.ObjectId();
export const financialRecord3 = {
  _id: financialRecord3Id,
  type: "income",
  value: 30000,
  description: "third financial record for user1",
  user: user1Id,
};

const financialRecord4Id = new mongoose.Types.ObjectId();
export const financialRecord4 = {
  _id: financialRecord4Id,
  type: "outcome",
  value: 10000,
  description: "first financial record for user2",
  user: user2Id,
};

const financialRecord5Id = new mongoose.Types.ObjectId();
export const financialRecord5 = {
  _id: financialRecord5Id,
  type: "outcome",
  value: 20000,
  description: "second financial record for user2",
  user: user2Id,
};

const financialRecord6Id = new mongoose.Types.ObjectId();
export const financialRecord6 = {
  _id: financialRecord6Id,
  type: "outcome",
  value: 30000,
  description: "third financial record for user2",
  user: user2Id,
};

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Financial.deleteMany({});
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fillUserCollection() {
  try {
    await new User(user1).save();
    await new User(user2).save();
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function fillFinancialCollection() {
  try {
    await new Financial(financialRecord1).save();
    await new Financial(financialRecord2).save();
    await new Financial(financialRecord3).save();
    await new Financial(financialRecord4).save();
    await new Financial(financialRecord5).save();
    await new Financial(financialRecord6).save();
  } catch (err: any) {
    throw new Error(err);
  }
}
