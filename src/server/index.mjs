import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// import userRouter from "./routes/user";
import authRouter from "./routes/auth.mjs";

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
app.use("/api", authRouter);
// Add in a catch-all route here

// Two databases, one for a list of access tokens, the other for users

/*
Routes
login -> returns jwt
logout -> deletes refresh token
refresh

get name -> returns name if authenticated

*/

app.listen(3000, () => console.log("Server has started"));
