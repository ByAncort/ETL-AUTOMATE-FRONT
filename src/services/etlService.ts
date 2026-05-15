import axios from 'axios';
import type { EtlRequest, EtlResponse } from '../types';

const etlApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

etlApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function runEtl(data: EtlRequest): Promise<EtlResponse> {
  const res = await etlApi.post('/api/etl/run', data);
  return res.data;
}

export async function runEtlById(integrationId: number): Promise<EtlResponse> {
  const res = await etlApi.post(`/api/etl/run/${integrationId}`);
  return res.data;
}
