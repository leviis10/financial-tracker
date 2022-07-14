import express from "express";
import {
  createNewFinancial,
  deleteFinancialRecord,
  getUserFinancialRecords,
  updateFinancialRecord,
} from "../controllers/financialController";
import isAuthenticated from "../middlewares/isAuthenticated";
import validateSchema from "../middlewares/validateSchema";
import {
  financialRecordId,
  newFinancialSchema,
  updateFinancialSchema,
} from "../validations/financialsValidation";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, validateSchema(newFinancialSchema), createNewFinancial)
  .get(isAuthenticated, getUserFinancialRecords);

router
  .route("/:id")
  .patch(
    validateSchema(financialRecordId),
    isAuthenticated,
    validateSchema(updateFinancialSchema),
    updateFinancialRecord
  )
  .delete(
    validateSchema(financialRecordId),
    isAuthenticated,
    deleteFinancialRecord
  );

export default router;
