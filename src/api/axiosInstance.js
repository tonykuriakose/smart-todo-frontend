import axios from 'axios';

const API_BASE_URL="https://smart-todo-backend-8hxj.onrender.com"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
