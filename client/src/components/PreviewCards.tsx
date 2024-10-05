import InfoCard from "./InfoCard";
import { ingredients, recipes } from "../data/previewData";
import { MdRemoveCircle } from "react-icons/md";
import RecipeCard from "./RecipeCard";

function PreviewCards() {
  return (
    <div className="grid grid-cols-1  md:grid-cols-5 md:gap-4 py-5">
      <div className="col-span-2 mb-2 md:mb-0">
        <InfoCard title="Available Ingredients">
          <ul className="list-inside pl-4 mb-4 max-h-[250px] overflow-y-auto">
            {ingredients.map((ingredient, index) => (
              <li className="flex mb-1 align-center" key={index}>
                <MdRemoveCircle className="text-red-600 mt-1 min-w-[16.67px] min-h-[16.61px]" />
                <span className="ml-2 text-start text-lg font-semibold">
                  {ingredient}
                </span>
              </li>
            ))}
          </ul>
          <button className="bg-sky-400 text-white py-2 px-3 rounded-md drop-shadow-md font-semibold ">
            Find Recipe
          </button>
        </InfoCard>
      </div>
      <div className="col-span-3">
        <InfoCard title="Recipe Suggestions">
          <div className="max-h-[290px] overflow-y-auto text-start">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                showPage={() => {}}
              />
            ))}
          </div>
        </InfoCard>
      </div>
    </div>
  );
}

export default PreviewCards;
