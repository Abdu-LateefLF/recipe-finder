const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe");
const Search = require("../models/search");
const User = require("../models/user");

const { searchSchema } = require("../Utils");

router.get("/", async (req, res) => {
  const user = await User.findOne({ _id: req.userId });
  if (!user) return res.sendStatus(401);

  await user.populate("searches");

  user.searches.sort((search1, search2) => {
    const date1 = new Date(search1.lastModified);
    const date2 = new Date(search2.lastModified);

    return date2.getTime() - date1.getTime();
  });

  res.json({ searches: user.searches });
});

router.get("/:searchId", async (req, res) => {
  const { searchId } = req.params;
  if (!searchId) return res.sendStatus(406);

  const user = await User.findOne({ _id: req.userId });
  const foundSearch = await Search.findOne({ _id: searchId });

  // Ensure that request is valid
  if (!foundSearch || !user) return res.sendStatus(401);
  if (!user.searches.some((id) => id.toString() === foundSearch._id.toString()))
    return res.sendStatus(401);

  await foundSearch.populate("recipes");

  res.json(foundSearch);
});

router.post("/", async (req, res) => {
  // Ensure that all fields were entered correctly
  const { error } = searchSchema.validate(req.body);
  if (error) return res.sendStatus(406);

  const { voiceInput, ingredients, recipes } = req.body;
  const lastModified = new Date();

  const user = await User.findOne({ _id: req.userId });
  if (!user) return res.sendStatus(401);

  const newSearch = new Search({ voiceInput, ingredients, lastModified });

  // Store new recipes in database
  for (let recipe of recipes) {
    const newRecipe = new Recipe(recipe);
    await newRecipe.save();

    newSearch.recipes.push(newRecipe);
  }
  await newSearch.save();

  user.searches.push(newSearch);
  await user.save();

  res.json({ searchId: newSearch.id });
});

router.post("/:searchId", async (req, res) => {
  // Ensure that all fields were entered correctly
  const { error } = searchSchema.validate(req.body);
  if (error) return res.sendStatus(406);

  const { searchId } = req.params;
  if (!searchId) return res.sendStatus(406);

  const { voiceInput, ingredients, recipes } = req.body;

  const user = await User.findOne({ _id: req.userId });
  const foundSearch = await Search.findOne({ _id: searchId });

  // Ensure request is valid
  if (!foundSearch || !user) return res.sendStatus(401);
  if (!user.searches.some((id) => id.toString() === foundSearch._id.toString()))
    return res.sendStatus(401);

  // Update the search information
  foundSearch.voiceInput = voiceInput;
  foundSearch.ingredients = ingredients;
  foundSearch.lastModified = new Date();

  // Update recipes in database
  for (let i = 0; i < recipes.length; i++) {
    delete recipes[i]._id;

    if (i < foundSearch.recipes.length) {
      await Recipe.findOneAndUpdate(
        { _id: foundSearch.recipes[i] },
        { ...recipes[i] }
      );
    } else {
      const newRecipe = new Recipe(recipes[i]);
      await newRecipe.save();

      foundSearch.recipes.push(newRecipe);
    }
  }
  await foundSearch.save();

  res.sendStatus(204);
});

router.delete("/:searchId", async (req, res) => {
  const { searchId } = req.params;
  if (!searchId) return res.sendStatus(406);

  const result = await Search.findOneAndDelete({ _id: searchId });

  if (result.acknowledged !== false) res.sendStatus(204);
  else res.sendStatus(500);
});

module.exports = router;
