import { useState, useEffect, useCallback, useMemo } from 'react';
import { X, Sparkles, GitMerge, Loader2, AlertCircle } from 'lucide-react';
import { fetchSchemaMatches } from '../services/schemaMatchService';
import { useAuth } from '../context/AuthContext';
import MatchReviewCard from './MatchReviewCard';
import EtlExecutionPanel from './EtlExecutionPanel';
import type { SchemaMatch } from '../types';

interface Props {
  integrationId: number;
  onClose: () => void;
}

export default function SchemaMatcherModal({ integrationId, onClose }: Props) {
  const { userData } = useAuth();
  const [matches, setMatches] = useState<SchemaMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchemaMatches(integrationId)
      .then(data => {
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los mapeos');
        setLoading(false);
      });
  }, [integrationId]);

  const approvedCount = useMemo(() => matches.filter(m => m.status === 'ACCEPTED').length, [matches]);
  const hasApprovedMatches = approvedCount > 0;

  const handleReviewed = useCallback((updated: SchemaMatch) => {
    if (!updated) return;
    setMatches(prev => prev.map(m => m.id === updated.id ? updated : m));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl animate-in flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-violet-100 to-blue-100 border border-violet-200">
              <GitMerge size={15} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Vista de Mapeo Inteligente</h2>
              <p className="text-xs text-slate-500">Schema Matcher · Integración #{integrationId}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={28} className="text-blue-500 animate-spin mb-3" />
              <p className="text-sm text-slate-500">Cargando mapeos...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle size={28} className="text-red-400 mb-3" />
              <p className="text-sm text-slate-600 mb-3">{error}</p>
              <button onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
                Cerrar
              </button>
            </div>
          ) : matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Sparkles size={28} className="text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">No se encontraron mapeos para esta integración</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Origen (A)
                  </span>
                </div>
                <div />
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Destino (B)
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {matches.map((match) => (
                  <MatchReviewCard
                    key={match.id}
                    match={match}
                    userId={userData?.id ?? 0}
                    onReviewed={handleReviewed}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Sparkles size={13} className="text-violet-500" />
                <p className="text-xs text-slate-600">
                  <span className="font-semibold text-violet-700">{matches.length} coincidencias detectadas</span>
                  {' '}— Usando Embeddings Semánticos (modelo <code className="font-mono">etl-embed-v2</code>).
                </p>
              </div>
            </>
          )}
        </div>

        {!loading && !error && matches.length > 0 && (
          <div className="px-6 pb-5 flex-shrink-0">
            <EtlExecutionPanel
              integrationId={integrationId}
              hasApprovedMatches={hasApprovedMatches}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
