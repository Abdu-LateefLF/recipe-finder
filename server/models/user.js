const mongoose = require("mongoose");
const Search = require("./search");
const Recipe = require("./recipe");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    maxLength: 30,
    required: true,
  },
  lastName: {
    type: String,
    maxLength: 30,
    required: true,
  },
  email: {
    type: String,
    maxLength: 60,
    required: true,
  },
  password: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  searches: [{ type: mongoose.SchemaTypes.ObjectId, ref: "search" }],
  savedRecipes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "recipe" }],
});

// Clear all of the user's searches on deletion
userSchema.post("findOneAndDelete", async (user) => {
  const searches = [...user.searches];

  await user.populate("searches");

  for (let search of user.searches) {
    await Recipe.deleteMany({ _id: { $in: search.recipes } });
  }

  await Search.deleteMany({ _id: { $in: user.searches } });
});

const User = mongoose.model("user", userSchema);

module.exports = User;
