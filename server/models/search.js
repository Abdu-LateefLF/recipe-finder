const mongoose = require("mongoose");
const Recipe = require("./recipe");

const searchSchema = mongoose.Schema({
  voiceInput: {
    type: String,
    maxLength: 500,
  },
  ingredients: [
    {
      type: String,
      maxLength: 50,
      required: true,
    },
  ],
  lastModified: {
    type: Date,
  },
  recipes: [{ type: mongoose.SchemaTypes.ObjectId, ref: "recipe" }],
});

// Clear all of the user's searches on deletion
searchSchema.post("findOneAndDelete", async (search) => {
  const result = await Recipe.deleteMany({ _id: { $in: search.recipes } });
});

const Search = mongoose.model("search", searchSchema);

module.exports = Search;
