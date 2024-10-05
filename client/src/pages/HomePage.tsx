import { Link } from "react-router-dom";
import PreviewCards from "../components/PreviewCards";

function HomePage() {
  return (
    <div>
      <header className="sticky top-0 bg-white font-sans h-30 z-[9]">
        <div className="flex justify-between align-middle px-5 py-10">
          <nav className="text-2xl text-gray-600 font-bold text-center">
            Recipe Finder
          </nav>
          <nav>
            <Link
              className="bg-transparent hover:bg-gray-100/75 text-cyan-500 px-3 py-1 mx- rounded-md font-semibold"
              to="../auth/login"
            >
              Log In
            </Link>
            <Link
              className="bg-indigo-500 hover:bg-indigo-700 px-3 py-1 mx-2 rounded-md font-medium text-white drop-shadow-md"
              to="../auth/register"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <div className="h-[200px] text-lg text-center font-semibold px-5">
        <div className="mb-6">
          <span className="block text-xl mb-8">
            Look in the fridge but don't know what to make?
          </span>
          <p>
            Find recipes to make by just listing some ingredients you have at
            home.
          </p>
        </div>

        <Link
          className="inline-block bg-gray-800 hover:bg-gray-900 text-white py-2 px-20 rounded-md mx-4 mt-5 mb-10 drop-shadow-md"
          to="../auth/register"
        >
          Use Now
        </Link>

        <PreviewCards />
      </div>
    </div>
  );
}

export default HomePage;
