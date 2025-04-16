import axios from './axiosInstance';

export const suggestTasks = (input) =>
  axios.post('/api/ai/suggest-tasks', { input });

export const weeklySummary = (completedTasks) =>
  axios.post('/api/ai/weekly-summary', { completedTasks });

export const taskChat = (question, context) =>
  axios.post('/api/ai/chat', { question, context });
