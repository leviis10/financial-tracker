import User from "../models/User";
import expressAsync from "../utils/expressAsync";

import type { RequestHandler } from "express";

export const userRegister = expressAsync(async (req, res) => {
  const user = new User(req.body);
  const token = user.generateToken();
  await user.save();
  res.status(201).send({ user, token });
});

export const userLogin = expressAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByCredentials({ email, password });
  const token = user.generateToken();
  await user.save();
  res.send({ user, token });
});

export const userLogout = expressAsync(async (req, res) => {
  const currentToken = req.header("Authorization")!.replace("Bearer ", "");
  req.user!.tokens = req.user!.tokens.filter((token) => token !== currentToken);
  await req.user!.save();
  res.send({ message: "Logout success" });
});

export const getUserProfile: RequestHandler = (req, res) => {
  res.send(req.user);
};
