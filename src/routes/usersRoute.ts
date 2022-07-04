import express from "express";
import User from "../models/User";
import expressAsync from "../utils/expressAsync";
import validateSchema from "../middlewares/validateSchema";
import { userRegistrationSchema } from "../validations/usersValidation";

const router = express.Router();

router.post(
  "/",
  validateSchema(userRegistrationSchema),
  expressAsync(async (req, res) => {
    const user = new User(req.body);
    user.generateToken();
    await user.save();
    res.status(201).send({ message: "User Created", user });
  })
);

router.post(
  "/login",
  expressAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByCredentials({ email, password });
    user.generateToken();
    await user.save();
    res.send({ message: "logged in", user });
  })
);

export default router;
