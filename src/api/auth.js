import axios from 'axios';

const baseURL = 'http://localhost:3001/api';

export const signup = (data) => axios.post(`${baseURL}/auth/signup`, data);
export const login = (data) => axios.post(`${baseURL}/auth/login`, data);
