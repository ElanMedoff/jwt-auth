import express from "express";
import authenticate from "../middleware/authenticate.mjs";

const router = express.Router();

router.get("/account", authenticate, (req, res) => {
  return res.json({ username: res.username });
});

export default router;
