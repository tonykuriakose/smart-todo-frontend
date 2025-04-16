import axios from './axiosInstance';

export const getTodos = () => axios.get('/api/todos');                            
export const createTodo = (data) => axios.post('/api/todos', data);              
export const updateTodo = (id, data) => axios.put(`/api/todos/${id}`, data);     
export const deleteTodo = (id) => axios.delete(`/api/todos/${id}`);             
