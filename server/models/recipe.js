const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
  },
  cookTime: {
    type: String,
    required: true
  },
  available: [
    {
      type: String,
      required: true
    }
  ],
  other: [
    {
      type: String,
      required: true
    }
  ],
  steps: [
    {
      type: String,
      required: true
    }
  ]
});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;