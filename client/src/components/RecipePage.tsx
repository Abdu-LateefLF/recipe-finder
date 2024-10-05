import { Recipe } from "../pages/FindRecipes";

interface Props {
  recipe: Recipe | undefined;
  shouldShow: boolean;
  hide: () => void;
}

function RecipePage({ recipe, shouldShow, hide }: Props) {
  if (!shouldShow || recipe === undefined) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-black/20 z-20">
      <div className="w-[90%] h-[90%] max-w-[1400px] bg-white rounded-md mx-auto mt-7">
        <div className="sticky top-0 bg-white font-sans h-30 drop-shadow-sm rounded-md">
          <div className="flex justify-between align-center p-5">
            <nav className="text-lg md:text-3xl text-gray-600 font-bold text-center">
              {recipe.name}
            </nav>
            <nav>
              <button
                className="bg-gray-800 hover:bg-gray-900 px-3 py-1 mx-2 rounded-md font-medium text-white drop-shadow-md"
                onClick={hide}
              >
                Close
              </button>
            </nav>
          </div>
        </div>

        <div className="h-[500px] px-7 overflow-y-auto text-grey-600 text-lg semi-bold">
          <p className="my-3 text-green-700 font-bold">
            {"Cook Time: " + recipe.cookTime}
          </p>
          <p className="my-3">{recipe.summary}</p>

          <span className="block text-cyan-700 text-2xl font-bold my-4">
            Ingredients
          </span>
          <ul className="list-disc list-inside pl-3">
            {recipe.available.concat(recipe.other).map((ingredient, index) => (
              <li className="mb-3" key={index}>
                {ingredient}
              </li>
            ))}
          </ul>

          <span className="block text-cyan-700 text-2xl font-bold my-4">
            Instructions
          </span>
          <ol className="list-decimal list-inside pl-3">
            {recipe.steps.map((step, index) => (
              <li className="mb-3" key={index}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
