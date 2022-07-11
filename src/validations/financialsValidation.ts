import { checkSchema } from "express-validator";

export const newFinancialSchema = checkSchema({
  type: {
    in: ["body"],
    isIn: { options: [["income", "outcome"]] },
    errorMessage: "type option must be income/outcome",
  },
  value: {
    in: ["body"],
    isArray: { negated: true },
    toFloat: true,
    isFloat: { options: { min: 0 } },
    errorMessage: "value must be greater than or equal to 0",
  },
  description: {
    in: ["body"],
    escape: true,
  },
});

export const updateFinancialSchema = checkSchema({
  type: {
    in: ["body"],
    isIn: { options: [["income", "outcome"]] },
    errorMessage: "type option must be income/outcome",
  },
  value: {
    in: ["body"],
    isArray: { negated: true },
    toFloat: true,
    isFloat: { options: { min: 0 } },
    errorMessage: "value must be greater than or equal to 0",
  },
  description: {
    in: ["body"],
    escape: true,
  },
  user: {
    in: ["body"],
    isEmpty: true,
    errorMessage: "Can't update the user id",
  },
});
