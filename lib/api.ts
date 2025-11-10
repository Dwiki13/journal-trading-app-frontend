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

export default api;
