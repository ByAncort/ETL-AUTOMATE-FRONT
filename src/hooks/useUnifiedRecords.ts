import { useState, useEffect } from 'react';
import { UnifiedRecord } from '../types';
import api from '../services/api';

export function useUnifiedRecords() {
  const [records, setRecords] = useState<UnifiedRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/schema-matches');
      const data = response.data;
      
      const mappedData: UnifiedRecord[] = data.map((item: any) => ({
        unifiedId: `UNI-${item.id}`,
        entityName: `${item.sourceField} a ${item.targetField}`,
        originA: item.sourceField,
        originB: item.targetField,
        confidence: item.confidence ? parseFloat(item.confidence) * 100 : 0,
        highlight: item.status === 'PENDING'
      }));
      
      setRecords(mappedData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching schema matches', err);
      setError('No se pudieron cargar los registros unificados');
    } finally {
      setLoading(false);
    }
  };

  return { records, loading, error, refetch: fetchRecords };
}
