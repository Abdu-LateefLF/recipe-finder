import { Recipe } from "../pages/FindRecipes";
import { LuChefHat } from "react-icons/lu";
import IngredientBagde from "./IngredientBagde";

interface Props {
  recipe: Recipe;
  showPage: () => void;
}

function RecipeCard({ recipe, showPage }: Props) {
  return (
    <div className="mb-2">
      <div className="flex">
        <LuChefHat className="mr-1 pt-1" size={20} />
        <span className="font-bold ">{recipe.name}</span>
      </div>
      <p className="text-gray-500 text-sm">{recipe.summary}</p>

      <div>
        <span className="text-sm font-semibold">Ingredients You Have:</span>
        <div className="pr-3">
          {recipe.available.map((ingredient, index) => (
            <IngredientBagde key={index} available={true}>
              {ingredient}
            </IngredientBagde>
          ))}
        </div>
      </div>
      {recipe.other.length > 0 && (
        <div>
          <span className="text-sm font-semibold">
            Ingredients You Need To Get:
          </span>
          <div>
            {recipe.other.map((ingredient, index) => (
              <IngredientBagde key={index} available={false}>
                {ingredient}
              </IngredientBagde>
            ))}
          </div>
        </div>
      )}
      <div className="text-end">
        <button
          className="bg-gray-800 hover:bg-gray-900 text-white py-1 px-2 rounded-md my-1 mr-5 drop-shadow-md"
          onClick={() => showPage()}
        >
          View Recipe
        </button>
      </div>
      <hr className="mt-2" />
    </div>
  );
}

export default RecipeCard;
