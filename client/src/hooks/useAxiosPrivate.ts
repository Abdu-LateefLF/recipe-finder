import { useEffect } from "react";
import { AxiosError, InternalAxiosRequestConfig } from "axios"; 
import { axiosPrivate } from "../services/apiClient";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {

    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (!config.headers['authorization']) {
          if (!auth?.token) {
            try {
              const newAccessToken = await refresh();
              config.headers['authorization'] = `Bearer ${newAccessToken}`;
            } 
            catch (error) {
              return Promise.reject(error);
            }
          } 
          else {
            config.headers['authorization'] = `Bearer ${auth.token}`;
          }
        }
        return config;
      }, 
      (error: AxiosError) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const prevRequest = error?.config as InternalAxiosRequestConfig & { sent?: boolean };

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            const newAccessToken = await refresh();
            prevRequest.headers = prevRequest.headers || {};
            prevRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
            
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }

  }, [auth, refresh]);

  return axiosPrivate;
}

export default useAxiosPrivate;
