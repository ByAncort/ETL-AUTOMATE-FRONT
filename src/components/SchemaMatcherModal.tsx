import { useState, useEffect } from 'react';
import { X, Sparkles, GitMerge, Play, CheckCheck, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../services/api';

interface FieldMatch {
  fieldA: string; typeA: string; fieldB: string; typeB: string;
  confidence: number; method: string;
}

const typeColor: Record<string, string> = {
  string: 'text-blue-600', email: 'text-emerald-600', datetime: 'text-amber-600',
  date: 'text-amber-600', uuid: 'text-violet-600', integer: 'text-red-500',
};

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 95 ? '#059669' : value >= 85 ? '#2563eb' : value >= 75 ? '#d97706' : '#dc2626';
  return <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
    <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
  </div>;
}

interface Props {
  integrationId: number;
  onClose: () => void;
}

export default function SchemaMatcherModal({ integrationId, onClose }: Props) {
  const [matches, setMatches] = useState<FieldMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/api/schema-matches/integration/${integrationId}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const mapped: FieldMatch[] = data.map((item: Record<string, unknown>) => ({
          fieldA: String(item.sourceField || item.fieldA || ''),
          typeA: String(item.sourceType || item.typeA || 'string'),
          fieldB: String(item.targetField || item.fieldB || ''),
          typeB: String(item.targetType || item.typeB || 'string'),
          confidence: typeof item.confidence === 'number' ? Math.round(item.confidence * 100) : Number(item.confidence) || 0,
          method: String(item.method || (item.confidence && Number(item.confidence) > 0.9 ? 'Exacto' : 'Semántico')),
        }));
        setMatches(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los mapeos');
        setLoading(false);
      });
  }, [integrationId]);

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
                {matches.map((match, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                      <div>
                        <code className="text-xs text-slate-900 font-mono">{match.fieldA}</code>
                        <div className={cn('text-[10px] font-semibold mt-0.5', typeColor[match.typeA] ?? 'text-slate-400')}>{match.typeA}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 min-w-[80px]">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border border-violet-200">
                        <Sparkles size={9} />{match.confidence}%
                      </div>
                      <ConfidenceBar value={match.confidence} />
                      <div className="relative flex items-center w-full">
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-300 via-violet-400 to-cyan-300" />
                        <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-500" />
                      </div>
                      <span className="text-[9px] text-slate-400">{match.method}</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                      <div>
                        <code className="text-xs text-slate-900 font-mono">{match.fieldB}</code>
                        <div className={cn('text-[10px] font-semibold mt-0.5', typeColor[match.typeB] ?? 'text-slate-400')}>{match.typeB}</div>
                      </div>
                    </div>
                  </div>
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
          <div className="flex gap-3 px-6 pb-5 flex-shrink-0">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-violet-200 text-violet-700 text-sm font-semibold hover:bg-violet-50 transition-colors">
              <CheckCheck size={15} className="inline mr-1" />
              Confirmar Mapeo
            </button>
            <button onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
              <Play size={14} fill="currentColor" /> Ejecutar ETL Ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
