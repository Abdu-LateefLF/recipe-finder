const express = require("express");
const router = express.Router();

const User = require("../models/user");
const {
  userSchema,
  loginSchema,
  hashPassword,
  checkPassword,
} = require("../Utils");

const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // Ensure that all fields were entered correctly
  const { error } = userSchema.validate(req.body);
  if (error) return res.sendStatus(406);

  const { firstName, lastName, email, password } = req.body;

  // ensure that the email is unused
  const previousUser = await User.findOne({ email: email });
  if (previousUser !== null) {
    return res.sendStatus(409);
  }

  // Create user with encrypted password
  const securePassword = await hashPassword(password);
  const user = new User({
    firstName,
    lastName,
    email,
    password: securePassword,
  });
  await user.save();

  res.sendStatus(204);
});

router.post("/login", async (req, res) => {
  // Ensure that all fields were entered correctly
  const { error } = loginSchema.validate(req.body);
  if (error) return res.sendStatus(406);

  const { email, password } = req.body;

  // Validate user credentials

  const user = await User.findOne({ email: email });
  if (user === null) return res.sendStatus(401);

  const passwordMatch = await checkPassword(password, user.password);
  if (!passwordMatch) return res.sendStatus(401);

  // Create user tokens
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });
  user.refreshToken = refreshToken;
  await user.save();

  // Send user information
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    token: accessToken,
  });
});

router.get("/refresh", async (req, res) => {
  // Get refresh token
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  // Check for user
  const foundUser = await User.findOne({ refreshToken: refreshToken });
  if (foundUser === null) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.JWT_KEY, (err, user) => {
    if (err !== null || foundUser._id.toString() !== user.id)
      return res.sendStatus(401);

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: "5m",
    });
    res.json({ token: accessToken });
  });
});

router.get("/logout", async (req, res) => {
  // Check for refresh token
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  // Remove user token

  const foundUser = await User.findOne({ refreshToken: refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = "";
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true });
  res.sendStatus(204);
});

module.exports = router;
