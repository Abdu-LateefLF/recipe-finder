import { useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Auth } from "../contexts/AuthProvider";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function SettingsButton() {
  const [open, setOpen] = useState(false);
  const { setAuth } = useAuth();
  const [firstName, setFirstName] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);

  const logoutUser = () => {
    apiClient.get("/auth/logout").catch((err) => {
      console.log(err);
    });

    setAuth({} as Auth);
    navigate("/");
  };

  // Get the user's name
  useEffect(() => {
    const controller = new AbortController();
    axiosPrivate
      .get("/user", { signal: controller.signal })
      .then(({ data }) => {
        setFirstName(data.firstName);
      });
    return () => controller.abort();
  }, [axiosPrivate]);

  // Close the dropdown when user clicks off
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <div
        className="relative flex align-center rounded-md hover:bg-gray-200/50 pl-3 pr-1 py-1"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold mr-1">{firstName}</span>
        <RiArrowDropDownLine className="pb-1" size={30} />

        <div
          ref={popupRef}
          className={`absolute right-0 w-52 h-[120px] mt-10 mr-5 px-5 bg-white drop-shadow-lg transition-opacity duration-300 ease-in-out ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <button
            className="block w-full text-left font-semibold pl-1 pt-3 mb-3"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <hr />
          <button
            className="block w-full text-left font-semibold pl-1 pt-3 text-red-600"
            onClick={logoutUser}
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

export default SettingsButton;
