import express from "express";
import {
  createNewFinancial,
  getUserFinancialRecords,
  updateFinancialRecord,
} from "../controllers/financialController";
import isAuthenticated from "../middlewares/isAuthenticated";
import validateSchema from "../middlewares/validateSchema";
import {
  newFinancialSchema,
  updateFinancialSchema,
} from "../validations/financialsValidation";
import Financial from "../models/Financial";
import expressAsync from "../utils/expressAsync";
import ExpressError from "../utils/ExpressError";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  validateSchema(newFinancialSchema),
  createNewFinancial
);

router.get("/", isAuthenticated, getUserFinancialRecords);

router.patch(
  "/:id",
  isAuthenticated,
  validateSchema(updateFinancialSchema),
  updateFinancialRecord
);

export default router;
