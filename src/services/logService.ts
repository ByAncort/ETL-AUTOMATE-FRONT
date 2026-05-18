import axios from 'axios';
import type { LogEntry } from '../types';

const logApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

logApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchLogs(): Promise<LogEntry[]> {
  const res = await logApi.get('/api/integrations/logs');
  return res.data;
}
