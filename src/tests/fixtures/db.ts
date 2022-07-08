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
export const user1 = new User({
  _id: user1Id,
  email: "user1@gmail.com",
  password: "@User1123",
  tokens: [jwt.sign({ _id: user1Id }, process.env.JWT_SECRET)],
});

const user2Id = new mongoose.Types.ObjectId();
export const user2 = new User({
  _id: user2Id,
  email: "user2@gmail.com",
  password: "@User2123",
  tokens: [jwt.sign({ _id: user2Id }, process.env.JWT_SECRET)],
});

const user3Id = new mongoose.Types.ObjectId();
export const user3 = new User({
  _id: user3Id,
  email: "user3@gmail.com",
  password: "@User3123",
  tokens: [jwt.sign({ _id: user3Id }, process.env.JWT_SECRET)],
});

const user4Id = new mongoose.Types.ObjectId();
export const user4 = new User({
  _id: user4Id,
  email: "user4@gmail.com",
  password: "@User4123",
  tokens: [jwt.sign({ _id: user4Id }, process.env.JWT_SECRET)],
});

const user5Id = new mongoose.Types.ObjectId();
export const user5 = new User({
  _id: user5Id,
  email: "user5@gmail.com",
  password: "@User5123",
  tokens: [jwt.sign({ _id: user5Id }, process.env.JWT_SECRET)],
});

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
    await user1.save();
    await user2.save();
    await user3.save();
    await user4.save();
    await user5.save();
  } catch (err: any) {
    throw new Error(err);
  }
}
