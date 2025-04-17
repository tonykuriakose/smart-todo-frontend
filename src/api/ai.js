import axios from './axiosInstance';

export const suggestTasks = (input) =>
  axios.post('/api/ai/suggest-tasks', { input });

export const weeklySummary = (completedTasks) =>
  axios.post('/api/ai/weekly-summary', { completedTasks });
