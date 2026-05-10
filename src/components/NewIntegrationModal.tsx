import { useState } from 'react';
import { X, Plug, Loader2, GitMerge, ArrowRight } from 'lucide-react';
import { ApiConnection } from '../hooks/useApiConnections';
import { CreateIntegrationPayload } from '../hooks/useIntegrations';

interface Props {
  connections: ApiConnection[];
  onClose: () => void;
  onSuccess: (payload: CreateIntegrationPayload) => Promise<void>;
}

const methodColors: Record<string, string> = {
  GET: 'text-emerald-400',
  POST: 'text-blue-400',
  PUT: 'text-amber-400',
  DELETE: 'text-red-400',
  PATCH: 'text-purple-400',
};

export default function NewIntegrationModal({ connections, onClose, onSuccess }: Props) {
  const [apiA, setApiA] = useState<number | null>(null);
  const [apiB, setApiB] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiA || !apiB || apiA === apiB) return;

    setLoading(true);
    setError(null);
    try {
      await onSuccess({ apiA, apiB, description });
    } catch (err: any) {
      setError(err.message || 'Error al crear integración');
      setLoading(false);
    }
  };

  const selectedA = connections.find(c => c.id === apiA);
  const selectedB = connections.find(c => c.id === apiB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <GitMerge size={15} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-[var(--text-primary)] font-semibold text-sm">Nueva Integración</h2>
              <p className="text-xs text-[var(--text-muted)]">Conectar APIs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">API Origen (A)</label>
            <div className="relative">
              <select
                value={apiA ?? ''}
                onChange={(e) => setApiA(e.target.value ? Number(e.target.value) : null)}
                className="w-full appearance-none bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/60 transition-all cursor-pointer"
              >
                <option value="">Seleccionar API...</option>
                {connections.filter(c => c.id !== apiB).map(conn => (
                  <option key={conn.id} value={conn.id}>
                    {conn.description || `API ${conn.id}`} ({conn.method})
                  </option>
                ))}
              </select>
            </div>
            {selectedA && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${methodColors[selectedA.method] || 'text-gray-400'}`}>
                    {selectedA.method}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-mono truncate">
                    {selectedA.url}{selectedA.pathParams}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
              <ArrowRight size={14} className="text-[var(--text-muted)]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">API Destino (B)</label>
            <div className="relative">
              <select
                value={apiB ?? ''}
                onChange={(e) => setApiB(e.target.value ? Number(e.target.value) : null)}
                className="w-full appearance-none bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/60 transition-all cursor-pointer"
              >
                <option value="">Seleccionar API...</option>
                {connections.filter(c => c.id !== apiA).map(conn => (
                  <option key={conn.id} value={conn.id}>
                    {conn.description || `API ${conn.id}`} ({conn.method})
                  </option>
                ))}
              </select>
            </div>
            {selectedB && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${methodColors[selectedB.method] || 'text-gray-400'}`}>
                    {selectedB.method}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] font-mono truncate">
                    {selectedB.url}{selectedB.pathParams}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Sincronización CRM → ERP"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>
        </form>

        <div className="flex gap-3 px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!apiA || !apiB || apiA === apiB || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Plug size={15} />
                Crear Integración
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
