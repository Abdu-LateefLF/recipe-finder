const express = require("express");
const openai = require("openai");

const router = express.Router();
const {
  generationPrompt,
  formattingPrompt,
  extractionPrompt,
} = require("../systemPrompts");

// Set up open ai model
const model = new openai({
  organization: process.env.ORG_ID,
  project: process.env.PROJECT_ID,
  apiKey: process.env.API_KEY,
});

router.post("/ingredients", async (req, res) => {
  const { input } = req.body;

  try {
    // Extract the ingredients
    const genCompletion = await model.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: extractionPrompt },
        { role: "user", content: input },
      ],
    });

    const ingredients = JSON.parse(genCompletion.choices[0].message.content);

    // Ensure that a valid array was provided
    if (typeof ingredients !== typeof []) return res.sendStatus(500);

    res.json(ingredients);
  } catch {
    return res.sendStatus(500);
  }
});

router.post("/", async (req, res) => {
  const { queryString } = req.body;
  if (queryString === undefined) return res.sendStatus(406);

  try {
    // Generate recipe information
    const genCompletion = await model.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: generationPrompt },
        { role: "user", content: queryString },
      ],
    });

    const genResponse = genCompletion.choices[0].message.content;

    // Extract recipe data into usable format
    const formatCompletion = await model.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: formattingPrompt },
        { role: "user", content: genResponse },
      ],
    });

    // Convert text to js array
    const formatResponse = formatCompletion.choices[0].message.content;
    const recipes = JSON.parse(formatResponse);

    // Add a temporary id to each recipe
    for (let i = 0; i < recipes.length; i++) {
      recipes[i]._id = i.toString();
    }

    if (recipes === null) return res.sendStatus(500);

    res.json(recipes);
  } catch {
    res.sendStatus(500);
  }
});

module.exports = router;
