import express from "express";
import authenticate from "../middleware/authenticate.mjs";

const router = express.Router();

router.get("/cat", authenticate, (req, res) => {
  res.json("I am a cat.");
});

export default router;
