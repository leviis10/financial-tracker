import type { Request, Response, NextFunction } from "express";

type PromiseRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

function expressAsync(fn: PromiseRequestHandler) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((err) => next(err));
  };
}

export default expressAsync;
