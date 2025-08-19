import axios from "axios";
import { parseCookies } from "nookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: true,
  },
});

api.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies["@IMAC:T"];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


let onUnauthorizedCallback: (() => void) | null = null;

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export { api };
