import axios from "axios";
import { useAuthStore } from "../stores";

export const client = axios.create({
  baseURL: "/api",
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
