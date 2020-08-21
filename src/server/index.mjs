/* eslint-disable no-console */
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.mjs";
import catRouter from "./routes/cat.mjs";
import helpersRouter from "./routes/helpers.mjs";

dotenv.config();
const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to the database"));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/helpers", helpersRouter);
app.use("/api", catRouter);
app.all("*", (_, res) => {
  res.status(404);
});

const listener = app.listen(8080, () =>
  console.log(`Server has started on port ${listener.address().port}`)
);
