import axios from './axiosInstance';

export const suggestTasks = (input) =>
  axios.post('/ai/suggest-tasks', { input });

export const weeklySummary = (completedTasks) =>
  axios.post('/ai/weekly-summary', { completedTasks });

export const taskChat = (question, context) =>
  axios.post('/ai/chat', { question, context });
