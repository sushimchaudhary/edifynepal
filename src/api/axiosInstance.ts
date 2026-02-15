
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = Cookies.get("refreshToken");


      if (!refreshToken) {
        if (window.location.pathname.startsWith("/dashboard")) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const res = await axios.post(`${baseURL}/api/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        Cookies.set("accessToken", newAccessToken, { expires: 1, path: '/' });
        
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove("accessToken", { path: '/' });
        Cookies.remove("refreshToken", { path: '/' });

        if (window.location.pathname.startsWith("/dashboard")) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;