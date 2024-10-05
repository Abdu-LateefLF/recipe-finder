import { IoAdd } from "react-icons/io5";
import { MdOutlineHistory } from "react-icons/md";
import { useState, useRef } from "react";
import useSearch from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import SearchCard from "./SearchCard";

function SideBar() {
  const [open, setOpen] = useState(false);
  const { searches, clearSearch, fetchAllSearches } = useSearch();
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openNewSearch = () => {
    clearSearch();
    navigate("/find");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
  };

  const toggleSideBar = () => {
    if (!open) {
      fetchAllSearches();

      setOpen(true);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      setOpen(false);
    }
  };

  return (
    <aside className="fixed top-0 left-0 bg-gray-300 rounded-sm h-full drop-shadow-sm pt-24 w-[49px] text-center z-10">
      <button
        className="block rounded-md mx-auto p-[3px] mb-4 hover:bg-gray-500/40"
        onClick={openNewSearch}
      >
        <IoAdd className="text-gray-600" size={31} />
      </button>
      <button
        className={`block rounded-md mx-auto p-[3px] mb-4 hover:bg-gray-500/40 ${
          open && "bg-gray-400"
        }`}
        ref={buttonRef}
        onClick={toggleSideBar}
      >
        <MdOutlineHistory className="text-gray-600" size={31} />
      </button>

      <div
        ref={popupRef}
        className={`absolute left-0 top-0 ml-16 mt-24 w-[300px] sm:w-[350px] h-[600px] z-[100] rounded-md bg-white drop-shadow-lg px-5 transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <span className="block font-semibold my-3 text-lg text-start">
          Recent History
        </span>
        <div className="max-h-[500px] overflow-auto mt-5 pr-1">
          <div className="h-full">
            {searches?.map((search) => (
              <SearchCard key={search._id} search={search} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
