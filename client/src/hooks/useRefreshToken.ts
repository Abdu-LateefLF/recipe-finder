import apiClient from "../services/apiClient";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await apiClient.get('/auth/refresh');
    
    setAuth({...auth, token: response.data.token});

    return response.data.token;
  };

  return refresh;
}

export default useRefreshToken;