import { useContext } from "react";
import { SearchContext } from "../contexts/SearchProvider";


const useSearch = () => useContext(SearchContext);

export default useSearch;