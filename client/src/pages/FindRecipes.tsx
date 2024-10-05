import { useRef, useState } from "react";
import NavBar from "../components/NavBar";
import RecipeList from "../components/RecipeList";
import SideBar from "../components/SideBar";
import IngredientInput from "../components/IngredientInput";
import IngredientList from "../components/IngredientList";
import InfoCard from "../components/InfoCard";
import RecipePage from "../components/RecipePage";
import SettingsButton from "../components/SettingsButton";
import SearchProvider from "../contexts/SearchProvider";

export interface Recipe {
  _id?: number;
  name: string;
  summary: string;
  cookTime: string;
  steps: string[];
  available: string[];
  other: string[];
}

function FindRecipes() {
  const [showRecipePage, setShowRecipePage] = useState(true);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>();

  const recipesRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);

  const focusOnRecipes = () => {
    recipesRef?.current?.focus();
  };

  const focusOnIngredients = () => {
    ingredientsRef?.current?.focus();
  };

  return (
    <>
      <NavBar>
        <SettingsButton />
      </NavBar>

      <div className="h-screen">
        <SearchProvider>
          <SideBar />
          <div className="pl-[60px] px-5 max-w-[1400px] mx-auto">
            <span className="block text-center mt-16 mb-10 text-lg text-gray-500 font-bold">
              Speak or type your ingredients to get personalized recipe
              recommendations
            </span>
            <IngredientInput focusIngredients={focusOnIngredients} />

            <div className="grid grid-cols-1 md:grid-cols-5 md:gap-4 py-5">
              <div
                className="col-span-2 mb-2 md:mb-0"
                ref={ingredientsRef}
                tabIndex={-1}
              >
                <InfoCard title="Available Ingredients">
                  <IngredientList focusRecipes={focusOnRecipes} />
                </InfoCard>
              </div>
              <div className="col-span-3" ref={recipesRef} tabIndex={-1}>
                <InfoCard title="Recipe Suggestions">
                  <RecipeList
                    setRecipe={setCurrentRecipe}
                    setShowRecipePage={setShowRecipePage}
                  />
                </InfoCard>
              </div>
            </div>
          </div>
        </SearchProvider>

        <RecipePage
          recipe={currentRecipe}
          shouldShow={showRecipePage}
          hide={() => setShowRecipePage(false)}
        />
      </div>
    </>
  );
}

export default FindRecipes;
