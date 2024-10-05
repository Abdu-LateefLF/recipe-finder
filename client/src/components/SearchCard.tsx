import { SlOptions } from "react-icons/sl";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useSearch from "../hooks/useSearch";
import { Search } from "../contexts/SearchProvider";

interface Props {
  search: Search;
}

function SearchCard({ search }: Props) {
  const [open, setOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { searches, setSearches, clearSearch } = useSearch();
  const { searchId } = useParams();

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getShortName = (items: string[]) => {
    if (items.length < 1) return "Unnamed";

    const length = screenWidth >= 660 ? 30 : 20;

    const nameString = items.join(", ");

    if (nameString.length > length) {
      {
        return nameString.substring(0, length - 2).trim() + "..";
      }
    }
    return nameString;
  };

  const getDate = () => {
    if (!search.lastModified) return "";

    const date = new Date(search.lastModified);

    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.toLocaleString("en-US", { day: "numeric" });
    const time = date
      .toLocaleDateString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .split(", ")[1];

    return `Last modified at ${time}, ${month} ${day}`;
  };

  const loadSearch = () => {
    navigate(`/find/${search._id}`);
  };

  // Optimistically delete the search card
  const deleteSearch = () => {
    const originalSearches = [...searches];

    if (searchId === search._id) {
      navigate("/find");
      clearSearch();
    }

    setSearches(searches.filter((item) => item._id !== search._id));

    axiosPrivate.delete(`/searches/${search._id}`).catch((err) => {
      console.log(err);
      setSearches(originalSearches);
    });
  };

  return (
    <div>
      <div
        key={search._id}
        className={
          "h-20 rounded-md mb-2 p-2 text-start drop-shadow-sm " +
          (searchId === search._id ? "bg-gray-200" : "bg-gray-50")
        }
        onClick={loadSearch}
      >
        <div className="flex justify-between h-10 pr-1">
          <span className="text-lg font-semibold mb-1">
            {getShortName(search.ingredients)}
          </span>
          <SlOptions
            className="mt-2 hover:bg-gray-500/40 rounded-full"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(!open);
            }}
          />
        </div>
        <p className="text-sm">{getDate()}</p>
      </div>

      <div
        className={
          "absolute right-0 w-52 h-[40px] mr-5 -mt-[55px] px-5 bg-white drop-shadow-lg rounded-lg " +
          (!open && "hidden")
        }
      >
        <div
          className="block w-full text-left font-semibold pl-2 py-1 text-red-600"
          onClick={deleteSearch}
        >
          Delete
        </div>
      </div>
    </div>
  );
}

export default SearchCard;
