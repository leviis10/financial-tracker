import jwt from "jsonwebtoken";
import User from "../models/User";
import ExpressError from "../utils/ExpressError";
import expressAsync from "../utils/expressAsync";

import type { Request, Response, NextFunction } from "express";

interface DecodedToken extends jwt.JwtPayload {
  _id: string;
}

const isAuthenticated = expressAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.header("Authorization");
  if (authorizationHeader === undefined) {
    throw new ExpressError("Please authenticate", 401);
  }

  const token = authorizationHeader.replace("Bearer ", "");
  const decoded = jwt.decode(token) as DecodedToken;

  const user = await User.findOne({ _id: decoded._id, tokens: token });
  if (user === null) {
    throw new ExpressError("Please authenticate", 401);
  }

  req.user = user;
  next();
});

export default isAuthenticated;
