import express from "express";
import validateSchema from "../middlewares/validateSchema";
import isAuthenticated from "../middlewares/isAuthenticated";
import {
  userRegister,
  userLogin,
  userLogout,
  getUserProfile,
} from "../controllers/userController";
import {
  userRegistrationSchema,
  userLoginSchema,
} from "../validations/usersValidation";
import expressAsync from "../utils/expressAsync";
import User from "../models/User";

const router = express.Router();

router.post("/", validateSchema(userRegistrationSchema), userRegister);

router.post("/login", validateSchema(userLoginSchema), userLogin);

router.post("/logout", isAuthenticated, userLogout);

router.get("/me", isAuthenticated, getUserProfile);

export default router;
