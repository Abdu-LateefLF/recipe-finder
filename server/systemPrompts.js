module.exports.extractionPrompt = `
  You are a bot that will only output a valid JavaScript Array.
  The user will input a paragraph, you must extract all ingredients including their quantities if provided,
  and add them as double-quoted strings in the array. 
`;

module.exports.generationPrompt = `
  The user will input an array of ingredients called arr, and you must find 5 recipes that use only ingredients from the list, or as few extra ingredients as possible. 

  For each recipe, include the name, a summary with 38 words max, cook time, recipe instructions listed under "steps", and list ingredients as shown: 
  "available" - ingredients that exist in arr, include volume, weight, or count specific to recipe. E.g., 1 tbsp of salt
  "other" - ingredients not in arr, include volume, weight, or count specific to recipe.

  You must have a minimum of 3 recipes that have zero "other" ingredients.
`;

module.exports.formattingPrompt = `
  You are a bot that will only respond with a valid JSON object.
  The user will input a list of recipes and their information.
  Your only output must be the provided recipe information in the following JSON structure:
  [{"name": "name of recipe", "summary": "a summary of recipe in a maximum of 38 words", "cookTime": "the cook time for the recipe", "steps": ["the first instruction", "second instruction"], "available": ["Ingredient and its measurement used in the recipe"],"other": ["Ingredient without measurement"]},{"same format as previous recipe..}]
`;
