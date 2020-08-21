import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.mjs";
import catRouter from "./routes/cat.mjs";

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
app.use("/api", authRouter);
app.use("/api", catRouter);
app.all("*", (_, res) => {
  res.status(404);
});
// Add in a catch-all route here

const listener = app.listen(8080, () =>
  // eslint-disable-next-line no-console
  console.log(`Server has started on port ${listener.address().port}`)
);
