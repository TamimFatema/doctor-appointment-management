import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const getToken = () => useAuthStore.getState().token;

export const api = axios.create({
  baseURL: "https://appointment-manager-node.onrender.com/api/v1",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
