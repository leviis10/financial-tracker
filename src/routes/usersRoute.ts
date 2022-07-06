import express from "express";
import User from "../models/User";
import expressAsync from "../utils/expressAsync";
import validateSchema from "../middlewares/validateSchema";
import {
  userRegistrationSchema,
  userLoginSchema,
} from "../validations/usersValidation";

const router = express.Router();

router.post(
  "/",
  validateSchema(userRegistrationSchema),
  expressAsync(async (req, res) => {
    const user = new User(req.body);
    const token = user.generateToken();
    await user.save();
    res.status(201).send({ user, token });
  })
);

router.post(
  "/login",
  validateSchema(userLoginSchema),
  expressAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByCredentials({ email, password });
    const token = user.generateToken();
    await user.save();
    res.send({ user, token });
  })
);

export default router;
