import { validationResult } from "express-validator";
import ExpressError from "../utils/ExpressError";

import type { Request, Response, NextFunction } from "express";

function validateSchema(validationSchema: any) {
  return [
    validationSchema,
    (req: Request, res: Response, next: NextFunction) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new ExpressError(
          result.array({ onlyFirstError: true })[0].msg,
          400
        );
      }

      next();
    },
  ];
}

export default validateSchema;
