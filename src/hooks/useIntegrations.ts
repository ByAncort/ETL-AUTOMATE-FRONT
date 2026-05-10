import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { IntegrationResponse } from '../types';

export interface Integration {
  id: number;
  apiA: number;
  apiB: number;
  description: string;
  status: 'pending' | 'active' | 'inactive' | 'error';
  createdAt: string;
}

export interface CreateIntegrationPayload {
  apiA: number;
  apiB: number;
  description: string;
}

export interface UpdateIntegrationPayload {
  description?: string;
  status?: 'pending' | 'active' | 'inactive' | 'error';
}

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<IntegrationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<IntegrationResponse[]>('/api/integrations/connections');
      setIntegrations(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching integrations:', err);
      setError(err.response?.data?.message || 'No se pudieron cargar las integraciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const createIntegration = async (payload: CreateIntegrationPayload) => {
    try {
      const response = await api.post<IntegrationResponse>('/api/integrations/connections', payload);
      setIntegrations(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('Error creating integration:', err);
      return { success: false, error: err.response?.data?.message || 'Error al crear integración' };
    }
  };

  const updateIntegration = async (id: number, payload: UpdateIntegrationPayload) => {
    try {
      const response = await api.put<IntegrationResponse>(`/api/integrations/connections/${id}`, payload);
      setIntegrations(prev => prev.map(i => i.id === id ? response.data : i));
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('Error updating integration:', err);
      return { success: false, error: err.response?.data?.message || 'Error al actualizar' };
    }
  };

  const deleteIntegration = async (id: number) => {
    try {
      await api.delete(`/api/integrations/connections/${id}`);
      setIntegrations(prev => prev.filter(i => i.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting integration:', err);
      return { success: false, error: err.response?.data?.message || 'Error al eliminar' };
    }
  };

  return { integrations, loading, error, refetch: fetchIntegrations, createIntegration, updateIntegration, deleteIntegration };
}
