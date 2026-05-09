import { useState } from 'react';
import { X, Plug, ChevronDown, Loader2, CheckCircle2, Braces } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type LoaderState = 'idle' | 'loading' | 'success';

export default function NewConnectionModal({ onClose, onSuccess }: Props) {
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [loaderState, setLoaderState] = useState<LoaderState>('idle');

  const handleTest = () => {
    setLoaderState('loading');
    setTimeout(() => {
      setLoaderState('success');
      setTimeout(() => onSuccess(), 1200);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <Plug size={15} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-[var(--text-primary)] font-semibold text-sm">Conectar API Externa</h2>
              <p className="text-xs text-[var(--text-muted)]">Nueva Conexión Rápida</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Nombre de la integración</label>
            <input
              type="text"
              placeholder="Ej: CRM Clientes v2"
              defaultValue=""
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">URL del Endpoint</label>
            <input
              type="text"
              placeholder="https://api.example.com/v1/contacts"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500/60 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Método HTTP</label>
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')}
                className="w-full appearance-none bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/60 transition-all cursor-pointer"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Authorization Header (Token)</label>
            <div className="relative">
              <Braces size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                placeholder="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500/60 transition-all font-mono"
              />
            </div>
          </div>

          {loaderState === 'loading' && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-950/40 border border-blue-500/30 animate-pulse">
              <Loader2 size={15} className="text-blue-400 animate-spin flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-300">Inferiendo tipos de datos con Schema Discovery...</p>
                <p className="text-[11px] text-blue-500 mt-0.5">Detectando emails, fechas, entidades numéricas...</p>
              </div>
            </div>
          )}

          {loaderState === 'success' && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-emerald-300">Conexión exitosa — 7 campos detectados</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Abriendo Schema Matcher...</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={handleTest}
            disabled={loaderState !== 'idle'}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
          >
            {loaderState === 'loading' ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analizando esquema...
              </>
            ) : loaderState === 'success' ? (
              <>
                <CheckCircle2 size={15} />
                Conexión verificada
              </>
            ) : (
              'Probar Conexión y Analizar Esquema'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
