import { X, Sparkles, GitMerge, Play, CheckCheck } from 'lucide-react';
import { useSchemaMatches } from '../hooks/useSchemaMatches';

const typeColor: Record<string, string> = {
  string: 'text-blue-400',
  email: 'text-emerald-400',
  datetime: 'text-amber-400',
  date: 'text-amber-400',
  uuid: 'text-purple-400',
  integer: 'text-red-400',
};

interface Props {
  integrationId: number;
  onClose: () => void;
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 95 ? '#34d399' :
    value >= 85 ? '#60a5fa' :
    value >= 75 ? '#fbbf24' : '#f87171';

  return (
    <div className="w-12 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

function inferType(fieldName: string): string {
  const lower = fieldName.toLowerCase();
  if (lower.includes('email')) return 'email';
  if (lower.includes('uuid') || lower.includes('id')) return 'uuid';
  if (lower.includes('date') || lower.includes('created') || lower.includes('updated')) return 'datetime';
  if (lower.includes('phone') || lower.includes('telefono')) return 'string';
  if (lower.includes('amount') || lower.includes('price') || lower.includes('count')) return 'integer';
  return 'string';
}

export default function SchemaMatcherModal({ integrationId, onClose }: Props) {
  const { matches, loading, error } = useSchemaMatches(integrationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl flex flex-col max-h-[85vh] bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(59,130,246,0.7), transparent)' }} />

        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)] shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.25))', border: '1px solid rgba(139,92,246,0.4)' }}
            >
              <GitMerge size={15} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <h2 className="text-[var(--text-primary)] font-semibold text-sm">Vista de Mapeo Inteligente</h2>
              <p className="text-xs text-[var(--text-muted)]">Schema Matcher · IA Semántica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-sm text-[var(--text-muted)]">Analizando esquemas...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
              >
                Reintentar
              </button>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-[var(--text-muted)]">No se encontraron coincidencias de esquema para esta integración.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4 shrink-0">
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)]">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    API A — Origen
                  </div>
                </div>
                <div />
                <div className="text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    API B — Destino
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {matches.map((match) => {
                  const confidencePercent = Math.round(match.confidence * 100);
                  const sourceType = inferType(match.sourceField);
                  const targetType = inferType(match.targetField);

                  return (
                    <div key={match.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="flex items-center justify-between bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 group hover:border-blue-500/30 transition-all">
                        <div>
                          <code className="text-xs text-[var(--text-primary)] font-mono">{match.sourceField}</code>
                          <div className={`text-[10px] font-semibold mt-0.5 ${typeColor[sourceType] ?? 'text-[var(--text-muted)]'}`}>{sourceType}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 min-w-[80px]">
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
                        >
                          <Sparkles size={9} />
                          {confidencePercent}%
                        </div>
                        <ConfidenceBar value={confidencePercent} />
                        <div className="relative flex items-center w-full">
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-500/40 via-purple-500/60 to-cyan-500/40" />
                          <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400" />
                        </div>
                        <span className="text-[9px] text-[var(--text-muted)]">Automático</span>
                      </div>

                      <div className="flex items-center justify-between bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 group hover:border-cyan-500/30 transition-all">
                        <div>
                          <code className="text-xs text-[var(--text-primary)] font-mono">{match.targetField}</code>
                          <div className={`text-[10px] font-semibold mt-0.5 ${typeColor[targetType] ?? 'text-[var(--text-muted)]'}`}>{targetType}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shrink-0">
                <Sparkles size={13} style={{ color: '#a78bfa' }} />
                <p className="text-xs text-[var(--text-secondary)]">
                  <span style={{ color: '#a78bfa' }} className="font-semibold">{matches.length} coincidencias detectadas</span>
                  {' '}— Usando Embeddings Semánticos (modelo <code className="font-mono">etl-embed-v2</code>) para análisis de campos en idiomas mixtos.
                </p>
              </div>
            </>
          )}
        </div>

        {!loading && !error && matches.length > 0 && (
          <div className="flex gap-3 px-6 py-4 border-t border-[var(--border-color)] shrink-0">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] hover:bg-[var(--bg-tertiary)]"
              style={{ borderColor: 'rgba(139,92,246,0.4)', color: '#a78bfa' }}
              onClick={onClose}
            >
              <CheckCheck size={15} />
              Confirmar Mapeo
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
              onClick={onClose}
            >
              <Play size={14} fill="currentColor" />
              Ejecutar ETL Ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
