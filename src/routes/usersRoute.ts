import express from "express";
import User from "../models/User";
import expressAsync from "../utils/expressAsync";
import validateSchema from "../middlewares/validateSchema";
import isAuthenticated from "../middlewares/isAuthenticated";
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

router.post(
  "/logout",
  isAuthenticated,
  expressAsync(async (req, res) => {
    const currentToken = req.header("Authorization")!.replace("Bearer ", "");
    req.user!.tokens = req.user!.tokens.filter(
      (token) => token !== currentToken
    );
    await req.user!.save();
    res.send({ message: "Logout success" });
  })
);

export default router;
