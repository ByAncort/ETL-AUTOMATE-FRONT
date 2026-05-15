import { useState, useCallback } from 'react';
import { runEtl } from '../services/etlService';
import type { EtlResponse } from '../types';

export type EtlPhase = 'idle' | 'extracting' | 'transforming' | 'loading' | 'done' | 'error';

export function useEtlExecution() {
  const [phase, setPhase] = useState<EtlPhase>('idle');
  const [result, setResult] = useState<EtlResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const execute = useCallback(async (integrationId: number) => {
    setPhase('extracting');
    setProgress(10);
    setError(null);
    setResult(null);

    try {
      setProgress(30);
      setPhase('transforming');

      setProgress(60);
      setPhase('loading');

      const response = await runEtl({ integrationId });

      setProgress(100);
      setPhase(response.errors.length === 0 ? 'done' : 'error');
      setResult(response);
      if (response.errors.length > 0) {
        setError(`Se cargaron ${response.loadedRecords} de ${response.totalRecords} registros`);
      }
    } catch (e) {
      setPhase('error');
      setResult(null);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Error desconocido al ejecutar ETL');
      }
    }
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setResult(null);
    setError(null);
    setProgress(0);
  }, []);

  return { phase, result, error, progress, execute, reset };
}
