import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export interface ApiConnection {
  id: number;
  method: string;
  url: string;
  description: string;
  pathParams: string | null;
  queryParams: string | null;
  body: string | null;
  createdAt: string;
  authType: string;
  authHeader: string;
  authHeaderValue: string | null;
  authApiId: number | null;
  authApiUrl: string | null;
  authValue: string | null;
}

export interface ApiAuthConfig {
  method: string;
  url: string;
  pathParams: string;
  description: string;
  authType: string;
  authHeader: string;
  authValue: string;
}

export interface CreateConnectionPayload {
  method: string;
  url: string;
  pathParams: string;
  description: string;
  authType: string;
  authHeader: string;
  body?: string;
  authValue?: string;
  apiAuth?: ApiAuthConfig;
}

export function useApiConnections() {
  const [connections, setConnections] = useState<ApiConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiConnection[]>('/api-registry/list');
      setConnections(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching connections:', err);
      setError(err.response?.data?.message || 'No se pudieron cargar las conexiones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const deleteConnection = async (id: number) => {
    try {
      await api.delete(`/api-registry/${id}`);
      setConnections(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting connection:', err);
      return { success: false, error: err.response?.data?.message || 'Error al eliminar' };
    }
  };

  const createConnection = async (payload: CreateConnectionPayload) => {
    try {
      const response = await api.post<ApiConnection>('/api-registry', payload);
      setConnections(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('Error creating connection:', err);
      return { success: false, error: err.response?.data?.message || 'Error al crear conexión' };
    }
  };

const testConnection = async (connection: ApiConnection) => {
    try {
      const response = await api.post(`/api-registry/${connection.id}/test`, {}, {
        validateStatus: () => true,
      });

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
      };
    }
  };

  return { connections, loading, error, refetch: fetchConnections, deleteConnection, createConnection, testConnection };
}