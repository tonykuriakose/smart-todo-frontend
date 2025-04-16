import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api'
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log(token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
