import axios from 'axios';


const baseURL="https://smart-todo-backend-8hxj.onrender.com"

export const signup = (data) => axios.post(`${baseURL}/api/auth/signup`, data);
export const login = (data) => axios.post(`${baseURL}/api/auth/login`, data);
