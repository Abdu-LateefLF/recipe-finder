import { Outlet } from "react-router-dom";

function AuthPage() {
  return (
    <div className="flex flex-col justify-center w-screen h-screen">
      <span className="block text-2xl text-gray-600 font-extrabold my-5 text-center">
        Recipe Finder
      </span>
      <div className="bg-white drop-shadow-2xl rounded w-[80%] h-[600px] max-w-[540px] mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthPage;
