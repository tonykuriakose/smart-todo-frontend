import axios from './axiosInstance';

export const getTodos = () => axios.get('/todos');
export const createTodo = (data) => axios.post('/todos', data);
export const updateTodo = (id, data) => axios.put(`/todos/${id}`, data);
export const deleteTodo = (id) => axios.delete(`/todos/${id}`);
