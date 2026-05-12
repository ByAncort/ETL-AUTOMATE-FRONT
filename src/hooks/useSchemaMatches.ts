import { useState, useEffect, useCallback } from 'react';
import { SchemaMatch } from '../types';
import api from '../services/api';

export function useSchemaMatches(integrationId: number) {
  const [matches, setMatches] = useState<SchemaMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/schema-matches/integration/${integrationId}`);
      setMatches(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching schema matches:', err);
      setError(err.response?.data?.message || 'No se pudieron cargar las coincidencias de esquema');
    } finally {
      setLoading(false);
    }
  }, [integrationId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, error, refetch: fetchMatches };
}
