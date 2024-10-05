import useSearch from "../hooks/useSearch";
import { Recipe } from "../pages/FindRecipes";
import LoadIndicator from "./LoadIndicator";
import RecipeCard from "./RecipeCard";

interface Props {
  setShowRecipePage: (show: boolean) => void;
  setRecipe: (recipe: Recipe) => void;
}

function RecipeList({ setShowRecipePage, setRecipe }: Props) {
  const { recipes, loadingRecipes } = useSearch();
  const empty = recipes.length === 0;

  if (loadingRecipes) return <LoadIndicator />;

  return (
    <>
      {empty && <span>Your recipe suggestions will appear here..</span>}
      <div className="max-h-[290px] overflow-y-auto">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            showPage={() => {
              setRecipe(recipe);
              setShowRecipePage(true);
            }}
          />
        ))}
      </div>
    </>
  );
}

export default RecipeList;
