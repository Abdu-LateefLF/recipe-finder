const bcrypt = require("bcrypt");
const Joi = require("joi");

// Encrypt the user's password
module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hash = bcrypt.hash(password, salt);

  return hash;
};

module.exports.checkPassword = async (password, hashPassword) => {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
};

module.exports.userSchema = Joi.object({
  firstName: Joi.string().required().max(30).min(1),
  lastName: Joi.string().required().max(30).min(1),
  email: Joi.string().required().max(60).min(1),
  password: Joi.string().max(60),
});

module.exports.loginSchema = Joi.object({
  email: Joi.string().required().max(60).min(1),
  password: Joi.string().required().max(60),
});

module.exports.profileSchema = Joi.object({
  firstName: Joi.string().required().max(30).min(1),
  lastName: Joi.string().required().max(30).min(1),
  email: Joi.string().required().max(60).min(1),
});

module.exports.searchSchema = Joi.object({
  voiceInput: Joi.string().max(500).min(0),
  ingredients: Joi.array().items(Joi.string().max(50)).min(1),
  recipes: Joi.array().items(
    Joi.object({
      _id: Joi.string(),
      name: Joi.string().required(),
      summary: Joi.string().required(),
      cookTime: Joi.string().required(),
      available: Joi.array().items(Joi.string()).required(),
      other: Joi.array().items(Joi.string()).required(),
      steps: Joi.array().items(Joi.string()).required(),
    }).unknown(true)
  ),
  hasChanged: Joi.boolean(),
});
