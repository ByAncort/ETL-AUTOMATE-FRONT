import { useState, useEffect } from 'react';
import { Integration, IntegrationStatus } from '../types';
import api from '../services/api';

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/integrations/connections');
      const data = response.data;
      
      const mappedData: Integration[] = data.map((item: any) => ({
        id: item.id.toString(),
        name: item.description || `Integración ${item.id}`,
        source: `${item.apiA || 'API A'} -> ${item.apiB || 'API B'}`,
        status: 'active' as IntegrationStatus,
        lastRun: item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A',
        recordsProcessed: '0',
        mlBadge: { label: 'Schema Matching', score: 95 }
      }));
      
      setIntegrations(mappedData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching integrations', err);
      setError('No se pudieron cargar las integraciones');
    } finally {
      setLoading(false);
    }
  };

  return { integrations, loading, error, refetch: fetchIntegrations };
}
