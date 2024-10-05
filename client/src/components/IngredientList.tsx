import { MdRemoveCircle } from "react-icons/md";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useSearch from "../hooks/useSearch";
import LoadIndicator from "./LoadIndicator";

interface Props {
  focusRecipes: () => void;
}

function IngredientList({ focusRecipes }: Props) {
  const {
    ingredients,
    setIngredients,
    loadingIngredients,
    setRecipes,
    loadingRecipes,
    setLoadingRecipes,
  } = useSearch();
  const axiosPrivate = useAxiosPrivate();
  const empty = ingredients.length === 0;

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  const convertToArrayString = (items: string[]): string => {
    // Remove any characters that might cause issues
    items.map((item) => item.replace(/"/, ""));

    return `arr = ["` + items.join('", "') + `"]`;
  };

  const findRecipes = () => {
    const controller = new AbortController();

    focusRecipes();
    setLoadingRecipes(true);

    axiosPrivate
      .post(
        "/recipes",
        {
          queryString: convertToArrayString(ingredients),
        },
        { signal: controller.signal }
      )
      .then((res) => {
        setRecipes(res.data);
        setLoadingRecipes(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingRecipes(false);
      });

    return () => controller.abort();
  };

  if (loadingIngredients) return <LoadIndicator />;

  return (
    <form
      className="text-center"
      onSubmit={(event) => {
        event.preventDefault();
        findRecipes();
      }}
    >
      {empty && <span>Your available ingredients will appear here..</span>}

      <ul className="list-inside pl-4 mb-4 max-h-[250px] overflow-y-auto">
        {ingredients.map((ingredient, index) => (
          <li
            className="flex mb-1 align-center"
            key={index}
            onClick={() => removeIngredient(ingredient)}
          >
            <MdRemoveCircle className="text-red-600 mt-1 min-w-[16.67px] min-h-[16.61px]" />
            <span className="ml-2 text-start text-lg font-semibold">
              {ingredient}
            </span>
          </li>
        ))}
      </ul>

      <button
        className={
          "bg-sky-400 text-white py-2 px-3 rounded-md drop-shadow-md font-semibold " +
          ((empty || loadingRecipes) && "opacity-50")
        }
        disabled={empty || loadingRecipes}
        type="submit"
      >
        Find Recipe
      </button>
    </form>
  );
}

export default IngredientList;
