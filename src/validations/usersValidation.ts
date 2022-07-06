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
    errorMessage:
      "Password must at least 8 characters length and contain lowercase, uppercase, number, symbols",
  },
});

export const userLoginSchema = checkSchema({
  email: {
    in: ["body"],
    notEmpty: true,
    errorMessage: "Please provide an email",
  },
  password: {
    in: ["body"],
    notEmpty: true,
    errorMessage: "Please provide a password",
  },
});
