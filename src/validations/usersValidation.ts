import { checkSchema } from "express-validator";

export const userRegistrationSchema = checkSchema({
  email: {
    in: ["body"],
    isEmail: true,
    normalizeEmail: true,
    errorMessage: "Please provide a valid email address",
  },
  password: {
    in: ["body"],
    isStrongPassword: true,
    errorMessage: "Please provide a stronger password",
  },
});
