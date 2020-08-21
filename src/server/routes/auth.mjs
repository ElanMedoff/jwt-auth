import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.mjs";
import RefreshToken from "../models/refreshTokenModel.mjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utilities/generateTokens.mjs";

const router = express.Router();
const saltRounds = 10;

// Helper routes
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/refreshTokens", async (req, res) => {
  try {
    const refreshTokens = await RefreshToken.find();
    res.json(refreshTokens);
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
    res.json({ users, refreshTokens });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Actual routes
router.post("/signup", async (req, res) => {
  let user;
  try {
    user = await User.findOne({ username: req.body.username });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  if (user) {
    return res.status(406).json({
      message: `The username: ${req.body.username} is already taken!`,
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return res
      .status(201)
      .json(`The username: ${req.body.username} has been created.`);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  // Verify that the user is actually a user
  let user;
  try {
    user = await User.findOne({ username: req.body.username });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  if (!user) {
    return res.status(401).json({
      message: `The username: ${req.body.username} is not in the db!`,
    });
  }

  // Validate the password
  try {
    await bcrypt.compare(req.body.password, user.password);
  } catch (err) {
    return res.status(401).json({
      message: "User's password and the passed-in password don't match!",
    });
  }

  // TODO if the password is wrong, get rid of the refresh token?

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const savedRefreshToken = new RefreshToken({
    refreshToken,
  });

  try {
    await savedRefreshToken.save();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.cookie("refreshToken", refreshToken, {
    maxAge: 60 * 60 * 12000, // 12 hour
    httpOnly: true,
    // secure: true,
    sameSite: true,
  });

  return res.status(202).json({ accessToken });
});

router.post("/logout", async (req, res) => {
  try {
    if (res.cookies.refreshToken) {
      // Delete the refresh token from the saved list
      const savedRefreshToken = await RefreshToken.findOne({
        refreshToken: res.cookies.refreshToken,
      });
      await savedRefreshToken.remove();
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/accessToken", async (req, res) => {
  if (req.cookies && req.cookies.refreshToken) {
    // Check that the refresh token is still saved
    let savedRefreshToken;
    try {
      savedRefreshToken = await RefreshToken.findOne({
        refreshToken: req.cookies.refreshToken,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "await RefreshToken.findOne" });
    }

    if (!savedRefreshToken) {
      return res.status(401).json("The refresh token is not saved in the db!");
    }

    // If saved, json back a new access token
    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.verify(
        req.cookies.refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "jwt.verify" });
    }

    if (!decodedRefreshToken) {
      return res.status(401).json("The refresh token cannot be read!");
    }

    try {
      const user = await User.findOne({
        username: decodedRefreshToken.username,
      });
      const accessToken = generateAccessToken(user);

      return res.status(202).json({ accessToken });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "await User.findOne" });
    }
  }

  return res.status(401).json("No refresh token in the cookies");
});

export default router;
