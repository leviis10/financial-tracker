import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "..", "env", "dev.env") });
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

app.listen(process.env.PORT, () => console.log("Server is up"));
