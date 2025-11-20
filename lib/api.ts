import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear token
      localStorage.removeItem("token");

      // Optional: prevent router crash if used in server components
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(new Error("Session expired, please login again."));
    }

    return Promise.reject(error);
  }
);

export default api;
