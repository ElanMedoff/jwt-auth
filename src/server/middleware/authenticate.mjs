import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshTokenModel.mjs";
import User from "../models/userModel.mjs";

export default async function authenticate(req, res, next) {
  let decodedRefreshToken;
  let decodedAccessToken;

  // Check that the refresh token is saved
  if (req.cookies && req.cookies.refreshToken) {
    try {
      const savedRefreshToken = await RefreshToken.findOne({
        refreshToken: req.cookies.refreshToken,
      });
      if (!savedRefreshToken) {
        return res
          .status(401)
          .json("The refresh token is not saved in the db!");
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "RefreshToken.findOne" });
    }
  } else {
    return res.status(401).json("No refresh token in the cookies!");
  }

  // Check that the refresh token is valid
  try {
    decodedRefreshToken = jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message, location: "jwt.verify refresh token" });
  }

  // Check that the access token is valid
  if (req.headers && req.headers.authorization) {
    try {
      decodedAccessToken = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.ACCESS_TOKEN_SECRET
      );
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message, location: "jwt.verify access token" });
    }
  } else {
    return res.status(401).json("No access token in the headers!");
  }

  if (!decodedAccessToken) {
    return res.status(401).json("The access token cannot be read!");
  }

  // Compare the two profiles
  let refreshTokenUser;
  try {
    refreshTokenUser = await User.findOne({
      username: decodedRefreshToken.user.username,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      location: "User.findOne refresh token user",
    });
  }

  if (!refreshTokenUser) {
    return res
      .status(401)
      .json(
        "The user read from the refresh token cannot be found in the database!"
      );
  }

  let accessTokenUser;
  try {
    accessTokenUser = await User.findOne({
      username: decodedAccessToken.user.username,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      location: "User.findOne access token user",
    });
  }

  if (!accessTokenUser) {
    return res
      .status(401)
      .json(
        "The user read from the access token cannot be found in the database!"
      );
  }

  if (
    refreshTokenUser.username === accessTokenUser.username &&
    refreshTokenUser.password === accessTokenUser.password
  ) {
    res.status(200);
    res.username = accessTokenUser.username;
    return next();
  }

  return res
    .status(401)
    .json("The access token user and the refresh token user don't match!");
}
