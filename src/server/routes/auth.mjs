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

router.post("/signup", async (req, res) => {
  if (!req.body.password) {
    return res.status(406).json({
      message: "No password supplied!",
    });
  }

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
  let isPasswordCorrect;
  try {
    isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  if (!isPasswordCorrect) {
    try {
      if (req.cookies && req.cookies.refreshToken) {
        // Delete the refresh token from the saved list
        const savedRefreshToken = await RefreshToken.findOne({
          refreshToken: req.cookies.refreshToken,
        });
        if (savedRefreshToken) await savedRefreshToken.remove();
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    return res.status(401).json({
      message: "User's password and the passed-in password don't match!",
    });
  }

  // Remove any other refresh tokens tied to that user that may be in the db
  let alreadySavedRefreshToken;
  try {
    alreadySavedRefreshToken = await RefreshToken.findOne({
      username: req.body.username,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message, location: "RefreshToken.findOne" });
  }

  if (alreadySavedRefreshToken) {
    try {
      await alreadySavedRefreshToken.remove();
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        location: "alreadySavedRefreshToken.remove",
      });
    }
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const savedRefreshToken = new RefreshToken({
    refreshToken,
    username: req.body.username,
  });

  try {
    await savedRefreshToken.save();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.cookie("refreshToken", refreshToken, {
    maxAge: process.env.REFRESH_TOKEN_DURATION,
    httpOnly: true,
    sameSite: true,
  });

  return res.status(202).json({ accessToken });
});

router.get("/logout", async (req, res) => {
  if (req.cookies && req.cookies.refreshToken) {
    // Delete the refresh token from the saved list
    let savedRefreshToken;
    try {
      savedRefreshToken = await RefreshToken.findOne({
        refreshToken: req.cookies.refreshToken,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "RefreshToken.findOne" });
    }

    if (!savedRefreshToken) {
      return res
        .status(200)
        .json("No Refresh token saved in the db to delete!");
    }

    try {
      await savedRefreshToken.remove();
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "savedRefreshToken.remove" });
    }

    return res.status(200).json("Refresh token deleted from db");
  }
  return res.status(500).json("No refresh token in the cookies");
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

    // If saved, send back a new access token
    let verifiedRefreshToken;
    try {
      verifiedRefreshToken = jwt.verify(
        req.cookies.refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "jwt.verify" });
    }

    try {
      const user = await User.findOne({
        username: verifiedRefreshToken.user.username,
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

router.get("/isLoggedIn", async (req, res) => {
  if (req.cookies && req.cookies.refreshToken) {
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

    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.decode(req.cookies.refreshToken);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "jwt.verify" });
    }

    if (savedRefreshToken && decodedRefreshToken) {
      return res.status(200).json({
        message: "The refresh token is valid, i.e. the user is logged in.",
        isLoggedIn: true,
      });
    }

    return res.status(401).json({
      message: "The refresh token is not saved in the db!",
      isLoggedIn: false,
    });
  }
  return res.status(401).json({
    message: "No refresh token in the cookies",
    isLoggedIn: false,
  });
});

router.get("/refreshTokenRemainingTime", async (req, res) => {
  if (req.cookies && req.cookies.refreshToken) {
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

    let decodedRefreshToken;
    try {
      decodedRefreshToken = jwt.decode(req.cookies.refreshToken);
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "jwt.verify" });
    }

    if (savedRefreshToken && decodedRefreshToken) {
      return res.status(200).json({
        message: "The refresh token is valid, i.e. the user is logged in.",
        remainingTime: decodedRefreshToken.exp * 1000,
      });
    }

    return res.status(401).json({
      message: "The refresh token is not saved in the db!",
      remainingTime: 0,
    });
  }
  return res.status(401).json({
    message: "No refresh token in the cookies",
    remainingTime: 0,
  });
});

export default router;
