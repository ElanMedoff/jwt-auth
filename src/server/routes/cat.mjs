import express from "express";
import authenticate from "../middleware/authenticate.mjs";

const router = express.Router();

router.get("/cat", authenticate, (req, res) => {
  return res.json(`Hello, ${res.username}, I am a cat.`);
});

export default router;
