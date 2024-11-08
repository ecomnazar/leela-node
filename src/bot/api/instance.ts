import axios from "axios";

export const instance = axios.create({
  baseURL: `${process.env.BACKEND_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = process.env.TOKEN;
    config.headers["x-auth-token"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
