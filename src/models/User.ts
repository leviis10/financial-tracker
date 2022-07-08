import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError";

import type { Model, HydratedDocument } from "mongoose";

const { Schema } = mongoose;

interface UserCredentials {
  email: string;
  password: string;
}

export interface IUser {
  email: string;
  password: string;
  tokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMethods {
  generateToken(): string;
}

interface UserModel extends Model<IUser, {}, UserMethods> {
  findByCredentials(
    userCredentials: UserCredentials
  ): Promise<HydratedDocument<IUser, UserMethods>>;
}

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.statics.findByCredentials = async function (
  userCredentials: UserCredentials
) {
  const { email, password } = userCredentials;
  const user = await this.findOne({ email });
  if (user === null) {
    throw new ExpressError("Invalid email or password", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new ExpressError("Invalid email or password", 401);
  }

  return user;
};

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRET);
  this.tokens.push(token);
  return token;
};

userSchema.methods.toJSON = function () {
  const userObj = this.toObject();

  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
