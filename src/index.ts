import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import usersRoute from "./routes/usersRoute";

import type { Request, Response, NextFunction } from "express";
import type ExpressError from "./utils/ExpressError";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

(async function () {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the database");
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
})();

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

app.listen(process.env.PORT, () => console.log("Server is up"));
