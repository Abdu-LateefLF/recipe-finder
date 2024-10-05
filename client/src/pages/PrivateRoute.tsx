import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function PrivateRoute() {
  const [valid, setValid] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    axiosPrivate.get("/user").catch(() => setValid(false));
  }, [axiosPrivate]);

  if (!valid) return <Navigate to="/" />;

  return <Outlet />;
}

export default PrivateRoute;
