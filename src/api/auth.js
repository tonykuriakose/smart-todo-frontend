import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL

export const signup = (data) => axios.post(`${baseURL}/api/auth/signup`, data);
export const login = (data) => axios.post(`${baseURL}/api/auth/login`, data);
