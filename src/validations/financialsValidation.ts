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
    isFloat: true,
    errorMessage: "value must be a number",
  },
  description: {
    in: ["body"],
    escape: true,
  },
});
