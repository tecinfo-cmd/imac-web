import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    indexes: true,
  },
});

const cookies = parseCookies();
const token = cookies["@IMAC:T"];

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      destroyCookie(null, "@IMAC:T");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export { api };
