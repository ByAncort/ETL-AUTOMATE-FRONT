import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { LlmConfigResponse, LlmConfigRequest } from '../types';

export function useLlmConfigs() {
  const [configs, setConfigs] = useState<LlmConfigResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<LlmConfigResponse[]>('/api/llm-configs');
      setConfigs(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching LLM configs:', err);
      setError(err.response?.data?.message || 'No se pudieron cargar las configuraciones LLM');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const createConfig = async (payload: LlmConfigRequest) => {
    try {
      const response = await api.post<LlmConfigResponse>('/api/llm-configs', payload);
      setConfigs(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('Error creating LLM config:', err);
      return { success: false, error: err.response?.data?.message || 'Error al crear configuración LLM' };
    }
  };

  const updateConfig = async (id: number, payload: LlmConfigRequest) => {
    try {
      const response = await api.put<LlmConfigResponse>(`/api/llm-configs/${id}`, payload);
      setConfigs(prev => prev.map(c => c.id === id ? response.data : c));
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('Error updating LLM config:', err);
      return { success: false, error: err.response?.data?.message || 'Error al actualizar configuración LLM' };
    }
  };

  const deleteConfig = async (id: number) => {
    try {
      await api.delete(`/api/llm-configs/${id}`);
      setConfigs(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting LLM config:', err);
      return { success: false, error: err.response?.data?.message || 'Error al eliminar configuración LLM' };
    }
  };

  const setDefault = async (id: number) => {
    try {
      const response = await api.patch<LlmConfigResponse>(`/api/llm-configs/${id}/default`);
      setConfigs(prev => prev.map(c => ({ ...c, isDefault: c.id === response.data.id })));
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('Error setting default LLM:', err);
      return { success: false, error: err.response?.data?.message || 'Error al establecer LLM por defecto' };
    }
  };

  return { configs, loading, error, refetch: fetchConfigs, createConfig, updateConfig, deleteConfig, setDefault };
}
