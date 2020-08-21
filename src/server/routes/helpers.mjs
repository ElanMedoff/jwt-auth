import express from "express";
import User from "../models/userModel.mjs";
import RefreshToken from "../models/refreshTokenModel.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/refreshTokens", async (req, res) => {
  try {
    const refreshTokens = await RefreshToken.find();
    return res.json(refreshTokens);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/removeAll", async (req, res) => {
  try {
    await User.remove({});
    await RefreshToken.remove({});

    const refreshTokens = await RefreshToken.find();
    const users = await User.find();

    return res.json({ users, refreshTokens });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
