import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Recipe } from "../pages/FindRecipes";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useParams } from "react-router-dom";
import { CanceledError } from "axios";

export interface Search {
  _id: string;
  name?: string;
  lastModified?: Date;
  voiceInput: string;
  ingredients: string[];
  recipes?: Recipe[];
}

export interface SearchContextType {
  searches: Search[];
  recipes: Recipe[];
  ingredients: string[];
  voiceInput: string;
  loadingIngredients: boolean;
  loadingRecipes: boolean;
  fetchAllSearches: () => void;
  setRecipes: (recipes: Recipe[]) => void;
  setSearches: (searches: Search[]) => void;
  setIngredients: (ingredients: string[]) => void;
  setVoiceInput: (input: string) => void;
  setLoadingIngredients: (loading: boolean) => void;
  setLoadingRecipes: (loading: boolean) => void;
  clearSearch: () => void;
}

export const SearchContext = React.createContext<SearchContextType>(
  {} as SearchContextType
);

interface Props {
  children: ReactNode;
}

function SearchProvider({ children }: Props) {
  const [searches, setSearches] = useState<Search[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState([] as string[]);
  const [voiceInput, setVoiceInput] = useState("");
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { searchId } = useParams();

  const searchIdRef = useRef(searchId);
  const voiceInputRef = useRef("");

  const clearSearch = () => {
    setRecipes([]);
    setIngredients([]);
    setVoiceInput("");
  };

  const fetchAllSearches = useCallback(() => {
    axiosPrivate
      .get("/searches")
      .then(({ data }) => {
        setSearches(data.searches || []);
      })
      .catch((err) => console.log(err));
  }, [axiosPrivate]);

  useEffect(() => {
    voiceInputRef.current = voiceInput;
    searchIdRef.current = searchId || "";
  }, [voiceInput, searchId]);

  // Save previous search information to server
  useEffect(() => {
    const controller = new AbortController();

    if (recipes.length > 0 || ingredients.length > 0) {
      if (searchIdRef.current === "") {
        axiosPrivate
          .post(
            "/searches",
            {
              voiceInput: voiceInputRef.current,
              ingredients: ingredients,
              recipes: recipes,
            },
            { signal: controller.signal }
          )
          .then(({ data }) => {
            navigate(`/find/${data.searchId}`);
          });
      } else {
        axiosPrivate
          .post(`/searches/${searchIdRef.current}`, {
            voiceInput: voiceInputRef.current,
            ingredients: ingredients,
            recipes: recipes,
          })
          .catch((err) => {
            if (err instanceof CanceledError) return;
            console.log(err);
          });
      }
    }

    return () => controller.abort();
  }, [ingredients, recipes, axiosPrivate, navigate]);

  // Get current search info
  useEffect(() => {
    if (searchIdRef.current !== "") {
      axiosPrivate
        .get(`/searches/${searchIdRef.current}`)
        .then(({ data }) => {
          setVoiceInput(data.voiceInput || "");
          setIngredients(data.ingredients || []);
          setRecipes(data.recipes || []);
        })
        .catch(() => {
          navigate("/find");
        });
    }
  }, [searchId, axiosPrivate, navigate]);

  return (
    <SearchContext.Provider
      value={{
        searches,
        recipes,
        ingredients,
        voiceInput,
        loadingIngredients,
        loadingRecipes,
        fetchAllSearches,
        setRecipes,
        setSearches,
        setIngredients,
        setVoiceInput,
        setLoadingIngredients,
        setLoadingRecipes,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
