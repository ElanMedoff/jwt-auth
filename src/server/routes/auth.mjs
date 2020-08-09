import express from "express";
import User from "../models/userModel.mjs";
import RefreshToken from "../models/refreshTokenModel.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const saltRounds = 10;

//Helper routes

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

//Actual routes

router.post("/signup", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) {
    return res
      .status(406)
      .json({ message: `${req.body.username} is already taken!` });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    //? Should a signup return stuff? probably not, save that for login
    // const accessToken = generateAccessToken(newUser);
    // const refreshToken = generateRefreshToken(newUser);

    // const savedRefreshToken = new RefreshToken({
    //   refreshToken,
    // });
    // savedRefreshToken.save();

    // response.cookie("refreshToken", refreshToken, {
    //   maxAge: 60 * 60 * 1000, // 1 hour
    //   httpOnly: true,
    //   // secure: true,
    //   // sameSite: true,
    // });

    return res.status(201).json({ accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(403)
        .json({ message: `${req.body.username} is not registered!` });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const savedRefreshToken = new RefreshToken({
      refreshToken,
    });
    savedRefreshToken.save();

    response.cookie("refreshToken", refreshToken, {
      maxAge: 60 * 60 * 1000, // 1 hour
      httpOnly: true,
      // secure: true,
      // sameSite: true,
    });

    return res.status(202).json({ accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    if (res.cookies.refreshToken) {
      //Delete the refresh token from the saved list
      const savedRefreshToken = await RefreshToken.findOne({refreshToken: res.cookies.refreshToken})
      await savedRefreshToken.remove();
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// TODO make into middleware
router.post("/auth", (req, res) => {
  let decodedRefreshToken;
  let decodedAccessToken;

  //Check that the refresh token is saved
  if (res.cookies.refreshToken) {
    try {
      const savedRefreshToken = await RefreshToken.findOne({refreshToken: res.cookies.refreshToken})
      if (!savedRefreshToken) return res.status(401).send("invalid refresh token");
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  //Check that the refresh token is valid
  try {
    decodedRefreshToken = jwt.verify(
      res.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    return res.status(500).send({message: err.message});
  }

  //Check that the access token is valid
  if (req.headers && req.headers.authorization) {
    try {
      decodedAccessToken = jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.ACCESS_TOKEN_SECRET
      );
    } catch (err) {
      return res.status(500).send({message: err.message});
    }
  }

  //Compare the two profiles
  try {
    const refreshTokenUser = await User.findOne({ username: decodedRefreshToken.username });
    const accessTokenUser = await User.findOne({ username: decodedAccessToken.username });
  
    if (refreshTokenUser === accessTokenUser) {
      return res.status(200)
    }
    res.status(401).send("invalid refresh token");
  } catch (err) {
    return res.status(500).send({message: err.message});
  }
});

router.post("/refresh", (req, res) => {
  // TODO make into middleware
  if (res.cookies.refreshToken) {
    //Check that the refresh token is still saved
    try {
      const savedRefreshToken = await RefreshToken.findOne({refreshToken: res.cookies.refreshToken})
      if (!savedRefreshToken) return res.status(401).send("invalid refresh token");
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }

    //If saved, send back a new access token
    try {
      const decoded = jwt.verify(
        res.cookies.refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findOne({ username: decoded.username });
      const accessToken = generateAccessToken(user);
      return res.status(202).json({ accessToken });
    } catch (err) {
      return res.status(500).send({message: err.message});
    }
  }

});

function generateAccessToken(user) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1m",
  });
}

export default router;
