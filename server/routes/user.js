const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { profileSchema } = require("../Utils");

router.get("/", async (req, res) => {
  // Validate user
  const user = await User.findOne({ _id: req.userId });
  if (!user) return res.sendStatus(401);

  const { firstName, lastName, email } = user;
  res.json({ firstName, lastName, email });
});

router.post("/", async (req, res) => {
  // Ensure that all fields were entered correctly
  const { error } = profileSchema.validate(req.body);
  if (error) return res.sendStatus(406);

  const { firstName, lastName, email } = req.body;

  const result = await User.findOneAndUpdate(
    { _id: req.userId },
    { firstName, lastName, email }
  );

  if (result.acknowledged !== false) res.sendStatus(204);
  else res.sendStatus(500);
});

router.delete("/", async (req, res) => {
  const result = await User.findOneAndDelete({ _id: req.userId });

  if (result.acknowledged !== false) res.sendStatus(204);
  else res.sendStatus(500);
});

module.exports = router;
