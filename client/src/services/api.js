import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const baseURL = configuredBaseURL.replace(/\/+$/, "");

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 20000
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
