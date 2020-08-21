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
          .send("The refresh token is not saved in the db!");
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).send("No refresh token in the cookies!");
  }

  // Check that the refresh token is valid
  try {
    decodedRefreshToken = jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }

  if (!decodedRefreshToken) {
    return res.status(401).send("The refresh token cannot be read!");
  }

  // Check that the access token is valid
  if (req.headers && req.headers.authorization) {
    try {
      decodedAccessToken = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.ACCESS_TOKEN_SECRET
      );
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  } else {
    return res.status(401).send("No access token in the headers!");
  }

  if (!decodedAccessToken) {
    return res.status(401).send("The access token cannot be read!");
  }

  // Compare the two profiles
  try {
    const refreshTokenUser = await User.findOne({
      username: decodedRefreshToken.username,
    });
    const accessTokenUser = await User.findOne({
      username: decodedAccessToken.username,
    });

    if (
      refreshTokenUser.username === accessTokenUser.username &&
      refreshTokenUser.password === accessTokenUser.password
    ) {
      // TODO does this make sense for where to put the return?
      res.status(200);
      return next();
    }

    return res
      .status(401)
      .send("The access token user and the refresh token user don't match!");
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}
