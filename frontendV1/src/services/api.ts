import axios from "axios";
import { storage } from "./storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = storage.getAccess();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAuth();

      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    if (error.response?.status === 403 && window.location.pathname !== "/403") {
      window.location.replace("/403");
    }

    return Promise.reject(error);
  }
);

export default api;