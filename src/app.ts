import express from "express";
import helmet from "helmet";
import usersRoute from "./routes/usersRoute";

import type { Request, Response, NextFunction } from "express";
import type ExpressError from "./utils/ExpressError";

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/api/users", usersRoute);

app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send({ message });
  }
);

export default app;
