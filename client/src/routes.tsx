import { createBrowserRouter } from "react-router-dom";
import FindRecipes from "./pages/FindRecipes";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./pages/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <AuthPage />,
    children: [
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/register", element: <Register /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/find/:searchId?",
        element: <FindRecipes />,
      },
    ],
  },
]);

export default router;
