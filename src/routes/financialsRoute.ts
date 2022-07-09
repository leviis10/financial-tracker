import express from "express";
import {
  createNewFinancial,
  getUserFinancialRecords,
} from "../controllers/financialController";
import isAuthenticated from "../middlewares/isAuthenticated";
import validateSchema from "../middlewares/validateSchema";
import { newFinancialSchema } from "../validations/financialsValidation";
import Financial from "../models/Financial";
import expressAsync from "../utils/expressAsync";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  validateSchema(newFinancialSchema),
  createNewFinancial
);

router.get("/", isAuthenticated, getUserFinancialRecords);

export default router;
