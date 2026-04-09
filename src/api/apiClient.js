import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL, headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    console.warn("Session expired. Redirecting to login...");
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    window.location.href = "/login";
  }
  return Promise.reject(error);
});

export default apiClient;